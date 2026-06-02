import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage } from '@/services/aiService';

export async function POST(request: NextRequest) {
  try {
    console.log('[API Route] Recebendo requisição de análise...');

    const body = await request.json();
    const { imageBase64, requestId } = body;

    if (!imageBase64) {
      console.error('[API Route] Imagem não fornecida');
      return NextResponse.json(
        {
          success: false,
          errorType: 'INVALID_INPUT',
          message: 'Imagem não fornecida'
        },
        { status: 400 }
      );
    }

    // Validação básica do formato base64
    if (typeof imageBase64 !== 'string' || imageBase64.length === 0) {
      console.error('[API Route] Formato de imagem inválido');
      return NextResponse.json(
        {
          success: false,
          errorType: 'INVALID_INPUT',
          message: 'Formato de imagem inválido'
        },
        { status: 400 }
      );
    }

    console.log('[API Route] Imagem recebida, iniciando análise...');
    const analysis = await analyzeImage(imageBase64);

    console.log('[API Route] Análise concluída com sucesso');
    return NextResponse.json({
      success: true,
      analysis,
      requestId: requestId || null
    });
  } catch (error) {
    console.error('[API Route] Erro na API de análise:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro ao analisar imagem';
    
    // Detecta tipo de erro e retorna código HTTP apropriado
    if (errorMessage.includes('QUOTA_EXCEEDED')) {
      console.log('[API Route] Retornando status 429 (quota exceeded)');
      return NextResponse.json(
        { 
          success: false,
          errorType: 'QUOTA_EXCEEDED',
          message: 'Limite diário da IA atingido. Tente novamente mais tarde.'
        },
        { status: 429 }
      );
    }
    
    if (errorMessage.includes('SERVICE_UNAVAILABLE')) {
      console.log('[API Route] Retornando status 503 (service unavailable)');
      const message = errorMessage.includes('API key válida')
        ? 'Nenhuma API key válida disponível no momento. Tente novamente mais tarde.'
        : 'Nenhum modelo de IA disponível no momento. Tente novamente mais tarde.';
      
      return NextResponse.json(
        { 
          success: false,
          errorType: 'SERVICE_UNAVAILABLE',
          message
        },
        { status: 503 }
      );
    }
    
    if (errorMessage.includes('temporariamente indisponível') || errorMessage.includes('503')) {
      console.log('[API Route] Retornando status 503 (service unavailable)');
      return NextResponse.json(
        { 
          success: false,
          errorType: 'SERVICE_UNAVAILABLE',
          message: 'Serviço temporariamente indisponível. Tente novamente mais tarde.'
        },
        { status: 503 }
      );
    }
    
    if (errorMessage.includes('API key') || errorMessage.includes('não configurada')) {
      console.log('[API Route] Retornando status 500 (configuration error)');
      return NextResponse.json(
        { 
          success: false,
          errorType: 'CONFIGURATION_ERROR',
          message: 'Erro de configuração do serviço. Contacte o suporte.'
        },
        { status: 500 }
      );
    }
    
    if (errorMessage.includes('inválidos') || errorMessage.includes('formato')) {
      console.log('[API Route] Retornando status 400 (invalid image)');
      return NextResponse.json(
        { 
          success: false,
          errorType: 'INVALID_IMAGE',
          message: 'Imagem inválida. Verifique o formato e tente novamente.'
        },
        { status: 400 }
      );
    }
    
    // Erro genérico
    console.log('[API Route] Retornando status 500 (internal error)');
    return NextResponse.json(
      { 
        success: false,
        errorType: 'INTERNAL_ERROR',
        message: 'Erro ao analisar imagem. Tente novamente.'
      },
      { status: 500 }
    );
  }
}
