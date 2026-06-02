'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, FileText } from 'lucide-react';

interface ErrorFallbackProps {
  onRetry: () => void;
  onManualAnalysis: () => void;
  isRetrying?: boolean;
}

export function ErrorFallback({ onRetry, onManualAnalysis, isRetrying = false }: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-white rounded-xl border border-[#e5e7eb] p-8">
      <div className="max-w-lg text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-[#fef3c7] rounded-full">
            <AlertTriangle className="h-8 w-8 text-[#f59e0b]" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Análise Temporariamente Indisponível
        </h3>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Estamos a crescer e a melhorar continuamente o Bendula. Neste momento não foi possível concluir a análise automática através da IA. Isto pode acontecer devido a limitações temporárias dos nossos serviços.
          <br /><br />
          Pode tentar novamente ou continuar utilizando a análise manual. Agradecemos o seu apoio enquanto trabalhamos para tornar a plataforma cada vez mais robusta.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                A Tentar...
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5" />
                Tentar Novamente
              </>
            )}
          </button>

          <button
            onClick={onManualAnalysis}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-[#e5e7eb] rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-5 w-5" />
            Análise Manual
          </button>
        </div>
      </div>
    </div>
  );
}
