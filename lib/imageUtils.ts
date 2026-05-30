/**
 * Utilitários para processamento e compressão de imagens
 */

const MAX_WIDTH = 768;
const MAX_HEIGHT = 768;
const JPEG_QUALITY = 0.7;

/**
 * Gera um hash simples de uma string base64 para cache
 * @param base64 - Imagem em base64
 * @returns Hash string
 */
export function generateImageHash(base64: string): string {
  let hash = 0;
  for (let i = 0; i < base64.length; i++) {
    const char = base64.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

/**
 * Redimensiona e comprime uma imagem
 * @param file - Arquivo de imagem original
 * @returns Promise com a imagem comprimida em base64 e informações de compressão
 */
export async function compressImage(file: File): Promise<{ 
  compressedBase64: string; 
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
  processingTime: number;
}> {
  const startTime = performance.now();
  const originalSize = file.size;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Não foi possível obter contexto do canvas'));
      return;
    }

    img.onload = () => {
      // Calcula dimensões mantendo aspect ratio
      let { width, height } = img;

      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      // Desenha a imagem redimensionada (remove metadados automaticamente)
      ctx.drawImage(img, 0, 0, width, height);

      // Converte para JPEG com compressão
      const compressedDataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
      
      const processingTime = performance.now() - startTime;
      const compressedSize = Math.round((compressedDataUrl.length * 3) / 4);
      const reductionPercentage = Math.round(((originalSize - compressedSize) / originalSize) * 100);

      // Logs de otimização
      console.log('[Optimization] Original:', `${(originalSize / 1024).toFixed(2)}KB`);
      console.log('[Optimization] Compressed:', `${(compressedSize / 1024).toFixed(2)}KB`);
      console.log('[Optimization] Reduction:', `${reductionPercentage}%`);
      console.log('[Optimization] Processing time:', `${processingTime.toFixed(2)}ms`);
      console.log('[Optimization] Dimensions:', `${width}x${height}`);

      resolve({
        compressedBase64: compressedDataUrl,
        originalSize,
        compressedSize,
        reductionPercentage,
        processingTime,
      });
    };

    img.onerror = () => {
      reject(new Error('Erro ao carregar imagem para compressão'));
    };

    // Carrega a imagem
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo de imagem'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Valida se um arquivo é uma imagem válida
 * @param file - Arquivo para validar
 * @returns true se válido, false caso contrário
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
}

/**
 * Valida o tamanho do arquivo
 * @param file - Arquivo para validar
 * @param maxSizeMB - Tamanho máximo em MB (padrão: 10)
 * @returns true se válido, false caso contrário
 */
export function isValidFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Obtém informações sobre a imagem comprimida
 * @param base64 - Imagem em base64
 * @returns Objeto com informações da imagem
 */
export function getImageInfo(base64: string): {
  size: number;
  sizeKB: number;
  mimeType: string;
} {
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
  const size = base64Data.length;
  const sizeKB = Math.round((size * 3) / 4 / 1024);
  const mimeType = base64.match(/^data:image\/(\w+);base64,/)?.[1] || 'jpeg';

  return { size, sizeKB, mimeType: `image/${mimeType}` };
}
