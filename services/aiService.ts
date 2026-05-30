import { GoogleGenerativeAI } from '@google/generative-ai';
import { FoodAnalysis } from '@/types';

// Função para mascarar API key para logs seguros
function maskApiKey(key: string): string {
  if (!key || key.length <= 4) return '****';
  return `****${key.slice(-4)}`;
}

// Inicializa o cliente Google Generative AI
const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.error('[AI Service] GEMINI_API_KEY não configurada nas variáveis de ambiente');
  throw new Error('GEMINI_API_KEY não configurada');
}

const genAI = new GoogleGenerativeAI(apiKey);

console.log('[AI Service] SDK Gemini inicializado');
console.log('[AI Service] API key carregada com sucesso');
console.log(`[AI Service] Utilizando key terminada em: ${maskApiKey(apiKey)}`);

// Configurações de retry
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT_MS = 30000;

// Cache simples em memória para evitar reprocessamento
const imageCache = new Map<string, { result: FoodAnalysis; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

// Lista de modelos válidos em ordem de prioridade (fallback em cascata)
const MODEL_PRIORITY = [
  'gemini-2.5-flash',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
];

// Erros que não devem ser retry (quota excedida)
const QUOTA_ERROR_PATTERNS = [
  '429',
  'quota exceeded',
  'limit exceeded',
  'free_tier_requests',
  'quota',
];

// Erros que devem fazer fallback para próximo modelo
const MODEL_ERROR_PATTERNS = [
  '404',
  'not found',
  'model not found',
  'model not supported',
  'invalid model',
  'invalid model version',
];

// Erros temporários que podem ser retry
const TEMPORARY_ERROR_PATTERNS = [
  '503',
  'timeout',
  'unavailable',
  'temporary',
  'ECONNRESET',
  'ETIMEDOUT',
];

/**
 * Extrai o MIME type de uma string base64 de imagem
 * @param imageBase64 - Imagem em formato base64 com ou sem prefixo
 * @returns MIME type detectado ou fallback para image/jpeg
 */
function extractMimeType(imageBase64: string): string {
  const match = imageBase64.match(/^data:image\/(\w+);base64,/);
  return match ? `image/${match[1]}` : 'image/jpeg';
}

/**
 * Verifica se um erro é de quota (não deve retry)
 * @param error - Error object ou string
 * @returns true se for erro de quota
 */
function isQuotaError(error: Error | string): boolean {
  const errorMessage = typeof error === 'string' ? error : error.message;
  return QUOTA_ERROR_PATTERNS.some(pattern => 
    errorMessage.toLowerCase().includes(pattern.toLowerCase())
  );
}

/**
 * Verifica se um erro é de modelo inválido (deve fazer fallback)
 * @param error - Error object ou string
 * @returns true se for erro de modelo
 */
function isModelError(error: Error | string): boolean {
  const errorMessage = typeof error === 'string' ? error : error.message;
  return MODEL_ERROR_PATTERNS.some(pattern => 
    errorMessage.toLowerCase().includes(pattern.toLowerCase())
  );
}

/**
 * Verifica se um erro é temporário (pode retry)
 * @param error - Error object ou string
 * @returns true se for erro temporário
 */
function isTemporaryError(error: Error | string): boolean {
  const errorMessage = typeof error === 'string' ? error : error.message;
  return TEMPORARY_ERROR_PATTERNS.some(pattern => 
    errorMessage.toLowerCase().includes(pattern.toLowerCase())
  );
}

/**
 * Função de delay para retry com backoff progressivo
 * @param attempt - Número da tentativa atual
 * @returns Milissegundos para esperar
 */
function getBackoffDelay(attempt: number): number {
  // Backoff progressivo: 2s, 4s, 8s
  return Math.pow(2, attempt) * 1000;
}

/**
 * Função de delay para retry
 * @param ms - Milissegundos para esperar
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wrapper para adicionar timeout a uma Promise
 * @param promise - Promise para adicionar timeout
 * @param timeoutMs - Timeout em milissegundos
 */
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]);
}

/**
 * Limpa entradas expiradas do cache
 */
function cleanExpiredCache(): void {
  const now = Date.now();
  for (const [key, value] of imageCache.entries()) {
    if (now - value.timestamp > CACHE_TTL_MS) {
      imageCache.delete(key);
    }
  }
}

/**
 * Analisa uma imagem usando a API Vision do Google Gemini com fallback de modelos
 * Focado exclusivamente em detecção de alimentos e bebidas
 * @param imageBase64 - Imagem em formato base64
 * @returns Análise do alimento com informações nutricionais e alergénios
 */
export async function analyzeImage(imageBase64: string): Promise<FoodAnalysis> {
  // Limpa cache expirado periodicamente
  cleanExpiredCache();

  // Gera hash da imagem para cache
  const imageHash = imageBase64.substring(0, 100); // Usa primeiros 100 caracteres como hash simples
  
  // Verifica cache
  const cached = imageCache.get(imageHash);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    console.log('[AI Service] Cache hit - reutilizando resultado anterior');
    return cached.result;
  }

  // Determina lista de modelos a tentar (prioridade + fallback)
  const modelsToTry = process.env.MODEL_NAME 
    ? [process.env.MODEL_NAME, ...MODEL_PRIORITY.filter(m => m !== process.env.MODEL_NAME)]
    : MODEL_PRIORITY;

  let lastError: Error | null = null;

  // Tenta cada modelo na ordem de prioridade
  for (const modelName of modelsToTry) {
    console.log(`[AI Service] Modelo atual: ${modelName}`);
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[AI Service] Tentativa ${attempt}/${MAX_RETRIES} com modelo ${modelName}`);

        const model = genAI.getGenerativeModel({ 
          model: modelName 
        });

        // Extrai MIME type e remove o prefixo data:image/...;base64, se existir
        const mimeType = extractMimeType(imageBase64);
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

        console.log('[AI Service] MIME type detectado:', mimeType);
        console.log('[AI Service] Tamanho da imagem em base64:', base64Data.length, 'caracteres');
        console.log('[AI Service] Payload otimizado pronto para envio');

        const prompt = `Você é um especialista em análise de alimentos. Analise esta imagem e determine se ela contém alimentos ou bebidas.

REGRAS IMPORTANTES:
1. Se a imagem NÃO contiver alimentos ou bebidas claramente identificáveis (pessoas, animais não preparados, objetos, documentos, paisagens sem comida, produtos não comestíveis), responda APENAS:
{
  "is_food": false,
  "reason": "A imagem não contém alimentos ou bebidas."
}

2. Se a imagem contiver alimentos ou bebidas (pratos preparados, frutas, vegetais, bebidas, snacks, ingredientes crus), responda APENAS:
{
  "is_food": true,
  "food_type": "prato | bebida | snack | ingrediente",
  "name_guess": "nome provável do alimento",
  "ingredients": ["lista de ingredientes visíveis ou inferidos"],
  "possible_allergens": ["possíveis alergénios como glúten, lactose, ovos, frutos secos"],
  "processing_level": "não processado | pouco processado | processado | ultra processado",
  "health_score": número de 0 a 10,
  "confidence": "baixa | média | alta",
  "notes": "observações curtas e objetivas"
}

INSTRUÇÕES:
- Não inventar ingredientes que não sejam visíveis ou altamente prováveis
- Ser conservador nas inferências
- Priorizar precisão em vez de quantidade de informação
- Não identificar marcas a menos que estejam claramente visíveis
- Se houver dúvida, reduzir a confiança
- Manter respostas curtas, objetivas e estruturadas
- Retorne APENAS o JSON válido, sem markdown ou explicações adicionais`;

        const imagePart = {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        };

        console.log('[AI Service] Enviando requisição para Gemini API...');
        
        // Adiciona timeout à requisição
        const result = await withTimeout(
          model.generateContent([prompt, imagePart]),
          REQUEST_TIMEOUT_MS
        );
        
        const response = await result.response;
        const content = response.text();

        console.log('[AI Service] Resposta recebida, tamanho:', content.length, 'caracteres');

        // Remove markdown code blocks se existirem
        const cleanContent = content
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim();
        
        // Tenta fazer parse do JSON
        try {
          const parsed = JSON.parse(cleanContent);
          console.log('[AI Service] JSON parseado com sucesso');
          
          // Valida estrutura mínima
          if (typeof parsed.is_food !== 'boolean') {
            throw new Error('Campo is_food obrigatório não encontrado');
          }
          
          // Armazena resultado no cache
          imageCache.set(imageHash, { result: parsed as FoodAnalysis, timestamp: Date.now() });
          console.log('[AI Service] Resultado armazenado no cache');
          console.log(`[AI Service] Modelo ativo: ${modelName}`);
          
          return parsed as FoodAnalysis;
        } catch (parseError) {
          console.error('[AI Service] Erro ao fazer parse do JSON:', parseError);
          console.error('[AI Service] Conteúdo recebido:', cleanContent.substring(0, 200));
          // Se falhar o parse, retorna resposta padrão indicando erro
          return {
            is_food: false,
            reason: 'Erro ao processar a análise da imagem',
          };
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`[AI Service] Erro na tentativa ${attempt} com modelo ${modelName}:`, lastError.message);

        // Verifica se é erro de quota (não deve retry nem fazer fallback)
        if (isQuotaError(lastError)) {
          console.log('[AI Service] Erro de quota detectado');
          console.log('[AI Service] Retry e fallback cancelados');
          throw new Error('QUOTA_EXCEEDED: Limite diário da IA atingido. Tente novamente mais tarde.');
        }

        // Verifica se é erro de modelo (deve fazer fallback para próximo modelo)
        if (isModelError(lastError)) {
          console.log('[AI Service] Erro 404 detectado');
          console.log(`[AI Service] Fallback de modelo ativado`);
          break; // Sai do loop de retry e tenta próximo modelo
        }

        // Verifica se é erro temporário (pode retry com mesmo modelo)
        if (isTemporaryError(lastError)) {
          console.log('[AI Service] Erro temporário detectado, aguardando para retry...');
        } else {
          // Outros erros não devem retry
          console.log('[AI Service] Erro não recuperável detectado');
          throw lastError;
        }

        // Se não for a última tentativa, espera antes de retry com backoff progressivo
        if (attempt < MAX_RETRIES) {
          const delayTime = getBackoffDelay(attempt);
          console.log(`[AI Service] Aguardando ${delayTime}ms antes da próxima tentativa...`);
          await delay(delayTime);
        }
      }
    }
  }

  // Se todos os modelos falharam
  throw new Error('SERVICE_UNAVAILABLE: Nenhum modelo de IA disponível no momento. Tente novamente mais tarde.');
}
