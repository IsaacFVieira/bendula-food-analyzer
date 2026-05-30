'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { ImageUpload } from '@/components/ImageUpload';
import { AnalysisResult } from '@/components/AnalysisResult';
import { Skeleton } from '@/components/ui/Skeleton';
import { UploadState, AnalysisResult as AnalysisResultType, FoodAnalysis } from '@/types';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { addToast } from '@/services/toastService';

export default function AnalyzePage() {
  const router = useRouter();
  const { setCurrentAnalysis } = useAnalysis();
  
  const [uploadState, setUploadState] = useState<UploadState>({
    isDragging: false,
    isUploading: false,
    preview: null,
    error: null,
  });
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = async (base64: string, file: File) => {
    setUploadState((prev) => ({
      ...prev,
      preview: base64,
      isUploading: true,
      error: null,
    }));
    setIsLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64: base64 }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Frontend] Erro na API:', response.status, errorText);
        throw new Error(errorText || 'Erro ao analisar imagem');
      }

      const data = await response.json();
      
      setAnalysis(data.analysis);
      
      if (data.analysis.is_food) {
        addToast('success', 'Alimento identificado com sucesso!');
        
        // Save to context for report page
        const result: AnalysisResultType = {
          id: Date.now().toString(),
          imageUrl: base64,
          analysis: data.analysis,
          timestamp: Date.now(),
          analysisType: 'image',
        };
        setCurrentAnalysis(result);
      } else {
        addToast('info', 'A imagem não contém alimentos');
      }
    } catch (error) {
      setUploadState((prev) => ({
        ...prev,
        error: 'Erro ao analisar imagem. Tente novamente.',
      }));
      addToast('error', 'Erro ao analisar imagem');
    } finally {
      setUploadState((prev) => ({ ...prev, isUploading: false }));
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setUploadState({
      isDragging: false,
      isUploading: false,
      preview: null,
      error: null,
    });
    setAnalysis(null);
  };

  const handleViewReport = () => {
    if (analysis && analysis.is_food) {
      router.push('/report');
    }
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4]">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push('/analisar')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#16a34a] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        {!analysis && !isLoading ? (
          <>
            {/* Hero Section */}
            <div className="text-center py-12 animate-fade-in">
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Análise por Imagem
              </h2>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Envie uma imagem do alimento para análise automática usando inteligência artificial.
              </p>
            </div>

            {/* Upload Section */}
            <div className="max-w-3xl mx-auto animate-slide-up">
              <ImageUpload
                onImageSelect={handleImageSelect}
                state={uploadState}
                onClear={handleClear}
              />
            </div>
          </>
        ) : (
          <div className="max-w-4xl mx-auto">
            {isLoading ? (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Analisando alimento...</h2>
                  <button
                    onClick={handleClear}
                    className="px-4 py-2 border border-[#e5e7eb] rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
                
                <Skeleton className="h-64 w-full rounded-xl" />
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </div>
            ) : analysis && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {analysis.is_food ? 'Resultado da Análise' : 'Não é Alimento'}
                  </h2>
                  <div className="flex gap-2">
                    {analysis.is_food && (
                      <button
                        onClick={handleViewReport}
                        className="py-2 px-4 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors"
                      >
                        Ver Relatório Completo
                      </button>
                    )}
                    <button
                      onClick={handleClear}
                      className="py-2 px-4 border border-[#e5e7eb] rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Nova Análise
                    </button>
                  </div>
                </div>
                
                {uploadState.preview && (
                  <Image
                    src={uploadState.preview}
                    alt="Analyzed"
                    width={800}
                    height={256}
                    className="w-full h-64 object-contain rounded-xl border-2 border-[#e5e7eb] bg-white mb-6"
                    unoptimized
                  />
                )}
                
                <AnalysisResult
                  analysis={analysis}
                  imageUrl={uploadState.preview || ''}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
