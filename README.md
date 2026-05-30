# AI Image Analyzer

Uma aplicação web moderna para análise de imagens usando inteligência artificial. Extraia texto, identifique objetos e obtenha descrições detalhadas automaticamente.

## 🚀 Tecnologias

- **Next.js 15+** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna
- **Google Gemini 1.5 Flash** - Análise de imagens com IA multimodal
- **Lucide React** - Ícones modernos

## ✨ Funcionalidades

- ✅ Upload de imagens via drag & drop
- ✅ Extração de texto (OCR)
- ✅ Detecção de objetos
- ✅ Descrição detalhada da imagem
- ✅ Categorização automática
- ✅ Resumo inteligente
- ✅ Histórico local de análises
- ✅ Exportação de resultados (TXT)
- ✅ Interface moderna e responsiva
- ✅ Tema escuro
- ✅ Animações suaves

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Uma API Key do Google Gemini com acesso ao modelo Gemini 1.5 Flash

## 🔧 Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar a API do Google Gemini

1. Acesse [makersuite.google.com](https://makersuite.google.com)
2. Faça login com sua conta Google
3. Clique em "Get API Key" no canto superior direito
4. Crie um novo projeto ou selecione um existente
5. Copie a chave gerada

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione sua API key:

```env
GEMINI_API_KEY=sua_chave_aqui
MODEL_NAME=gemini-1.5-flash
```

**Importante:** Nunca commit o arquivo `.env` com sua API key real!

### 4. Executar o projeto

```bash
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
ai-image-analyzer/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # API endpoint para análise
│   ├── globals.css               # Estilos globais
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página inicial
├── components/
│   ├── ui/
│   │   ├── Button.tsx            # Componente de botão
│   │   ├── Card.tsx              # Componente de card
│   │   ├── Skeleton.tsx          # Componente de skeleton loading
│   │   └── Toast.tsx             # Componente de notificações
│   ├── AnalysisResult.tsx        # Exibição dos resultados
│   ├── History.tsx               # Histórico de análises
│   └── ImageUpload.tsx           # Componente de upload
├── lib/
│   └── utils.ts                  # Funções utilitárias
├── services/
│   ├── aiService.ts              # Serviço de integração com Google Gemini
│   ├── historyService.ts         # Serviço de histórico local
│   └── toastService.ts           # Serviço de notificações
├── types/
│   └── index.ts                  # Tipos TypeScript
├── .env.example                  # Exemplo de variáveis de ambiente
├── next.config.js                # Configuração do Next.js
├── package.json                  # Dependências
├── tailwind.config.ts            # Configuração do Tailwind
└── tsconfig.json                 # Configuração do TypeScript
```

## 🚀 Deploy na Vercel

### 1. Preparar para deploy

Certifique-se de que:
- Seu código está no GitHub
- O arquivo `.env` não está commitado (está no `.gitignore`)
- Você tem sua API key do Google Gemini

### 2. Deploy automático

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "Add New Project"
4. Importe o repositório do projeto
5. Configure as variáveis de ambiente:
   - Vá em Settings → Environment Variables
   - Adicione `GEMINI_API_KEY` com sua chave
   - Adicione `MODEL_NAME` com valor `gemini-1.5-flash`
6. Clique em "Deploy"

### 3. Deploy manual via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

Durante o deploy, você será perguntado sobre as variáveis de ambiente. Adicione:
- `GEMINI_API_KEY`: sua chave do Google Gemini
- `MODEL_NAME`: gemini-1.5-flash

## 💡 Uso

1. Abra a aplicação no navegador
2. Arraste e solte uma imagem ou clique para selecionar
3. Aguarde a análise pela IA
4. Visualize os resultados:
   - Texto extraído (OCR)
   - Descrição da imagem
   - Objetos identificados
   - Categorias
   - Resumo inteligente
5. Copie ou baixe os resultados em TXT
6. Acesse o histórico para análises anteriores

## 🔒 Segurança

- A API key é armazenada apenas em variáveis de ambiente
- As imagens são processadas temporariamente
- O histórico é armazenado localmente no navegador
- Nenhum dado é persistido em servidores externos além do Google Gemini

## 📝 Notas

- O modelo padrão é o `gemini-1.5-flash`, otimizado para o plano gratuito da Gemini API
- Imagens são automaticamente redimensionadas para máximo 1024px e comprimidas antes do envio
- O sistema implementa retry automático (3 tentativas) para erros temporários
- Para uso em produção, considere implementar rate limiting
- O histórico é limitado às últimas 20 análises
- Imagens maiores que 10MB podem causar problemas

## 🤝 Contribuindo

Sinta-se à vontade para abrir issues e pull requests!

## 📄 Licença

Este projeto é fornecido como está para fins educacionais.
