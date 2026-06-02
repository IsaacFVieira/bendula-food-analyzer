/**
 * Serviço de logging estruturado para erros
 * Ajuda na manutenção sem expor detalhes técnicos ao utilizador
 */

export enum ErrorType {
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  RATE_LIMIT = 'RATE_LIMIT',
  INVALID_KEY = 'INVALID_KEY',
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  EMPTY_RESPONSE = 'EMPTY_RESPONSE',
  MALFORMED_RESPONSE = 'MALFORMED_RESPONSE',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ErrorLog {
  timestamp: number;
  errorType: ErrorType;
  message: string;
  details?: any;
  context?: string;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];

  /**
   * Registra um erro estruturado
   */
  log(errorType: ErrorType, message: string, details?: any, context?: string): void {
    const log: ErrorLog = {
      timestamp: Date.now(),
      errorType,
      message,
      details,
      context,
    };

    this.logs.push(log);

    // Log no console para desenvolvimento
    console.error(`[Error Logger] ${errorType}: ${message}`, details);

    // Em produção, enviar para serviço de monitorização (ex: Sentry, DataDog)
    // Por enquanto, apenas armazenamos em memória
  }

  /**
   * Detecta o tipo de erro baseado na mensagem
   */
  detectErrorType(error: Error | string): ErrorType {
    const errorMessage = typeof error === 'string' ? error : error.message;

    if (errorMessage.includes('QUOTA_EXCEEDED') || errorMessage.includes('quota exceeded') || errorMessage.includes('429')) {
      return ErrorType.QUOTA_EXCEEDED;
    }

    if (errorMessage.includes('SERVICE_UNAVAILABLE') || errorMessage.includes('503') || errorMessage.includes('indisponível')) {
      return ErrorType.SERVICE_UNAVAILABLE;
    }

    if (errorMessage.includes('timeout') || errorMessage.includes('TIMEOUT')) {
      return ErrorType.TIMEOUT;
    }

    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      return ErrorType.RATE_LIMIT;
    }

    if (errorMessage.includes('API key') || errorMessage.includes('chave inválida') || errorMessage.includes('não configurada')) {
      return ErrorType.INVALID_KEY;
    }

    if (errorMessage.includes('provider') || errorMessage.includes('provedor')) {
      return ErrorType.PROVIDER_ERROR;
    }

    if (errorMessage.includes('empty') || errorMessage.includes('vazia')) {
      return ErrorType.EMPTY_RESPONSE;
    }

    if (errorMessage.includes('malformed') || errorMessage.includes('mal formada') || errorMessage.includes('parse')) {
      return ErrorType.MALFORMED_RESPONSE;
    }

    if (errorMessage.includes('network') || errorMessage.includes('ECONNRESET') || errorMessage.includes('ETIMEDOUT')) {
      return ErrorType.NETWORK_ERROR;
    }

    return ErrorType.UNKNOWN_ERROR;
  }

  /**
   * Retorna mensagem amigável para o utilizador
   */
  getUserFriendlyMessage(errorType: ErrorType): string {
    switch (errorType) {
      case ErrorType.QUOTA_EXCEEDED:
        return 'Limite diário da IA atingido. Tente novamente mais tarde.';
      case ErrorType.SERVICE_UNAVAILABLE:
        return 'Serviço temporariamente indisponível. Tente novamente mais tarde.';
      case ErrorType.TIMEOUT:
        return 'A requisição demorou muito tempo. Tente novamente.';
      case ErrorType.RATE_LIMIT:
        return 'Muitas requisições. Aguarde um momento e tente novamente.';
      case ErrorType.INVALID_KEY:
        return 'Erro de configuração do serviço. Contacte o suporte.';
      case ErrorType.PROVIDER_ERROR:
        return 'Erro no serviço de IA. Tente novamente mais tarde.';
      case ErrorType.EMPTY_RESPONSE:
        return 'Resposta vazia do serviço. Tente novamente.';
      case ErrorType.MALFORMED_RESPONSE:
        return 'Resposta inválida do serviço. Tente novamente.';
      case ErrorType.NETWORK_ERROR:
        return 'Erro de conexão. Verifique sua internet e tente novamente.';
      default:
        return 'Erro ao processar a análise. Tente novamente.';
    }
  }

  /**
   * Retorna todos os logs
   */
  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  /**
   * Limpa os logs
   */
  clearLogs(): void {
    this.logs = [];
  }
}

// Singleton
export const errorLogger = new ErrorLogger();
