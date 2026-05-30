'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Camera, Lock } from 'lucide-react';

export default function AnalisarPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f0fdf4]">
      {/* Navbar will be included in layout */}
      
      <div className="container mx-auto px-4 py-16">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#16a34a]/10 rounded-full text-[#16a34a] text-sm font-medium">
            ✨ ANÁLISE INTELIGENTE
          </span>
        </div>

        {/* Title */}
        <div className="text-center mb-4 px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Como prefere analisar o produto?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Escolha o método de inserção dos dados do produto alimentar.
          </p>
        </div>

        {/* Cards */}
        <div className="max-w-[720px] mx-auto flex flex-col md:flex-row gap-6 mt-12">
          {/* Card 1 - Manual */}
          <div className="w-full md:w-1/2 bg-white rounded-2xl border border-[#e5e7eb] p-8 shadow-lg hover:border-[#16a34a] hover:shadow-xl hover:shadow-[#16a34a]/10 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-[#f0fdf4] rounded-full">
                <FileText className="h-8 w-8 text-[#16a34a]" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
              Inserir Manualmente
            </h3>
            <p className="text-gray-600 text-sm mb-4 text-center">
              Preencha os campos com o nome, ingredientes e valores nutricionais.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-[#16a34a]">✓</span>
                Controlo total
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-[#16a34a]">✓</span>
                Sem necessidade de imagem
              </li>
            </ul>
            <button
              onClick={() => router.push('/analisar/manual')}
              className="w-full py-3 px-4 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors"
            >
              Inserir Manualmente →
            </button>
          </div>

          {/* Card 2 - Imagem */}
          <div className="w-full md:w-1/2 bg-white rounded-2xl border border-[#e5e7eb] p-8 shadow-lg hover:border-[#16a34a] hover:shadow-xl hover:shadow-[#16a34a]/10 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-[#f0fdf4] rounded-full">
                <Camera className="h-8 w-8 text-[#16a34a]" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
              Enviar Imagem
            </h3>
            <p className="text-gray-600 text-sm mb-4 text-center">
              Carregue a foto do rótulo e o reconhecimento inteligente extrai os dados automaticamente.
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-[#16a34a]">✓</span>
                Mais rápido
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-[#16a34a]">✓</span>
                Processamento instantâneo
              </li>
            </ul>
            <button
              onClick={() => router.push('/analyze')}
              className="w-full py-3 px-4 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors"
            >
              Enviar Imagem →
            </button>
          </div>
        </div>

        {/* Footer note */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lock className="h-4 w-4" />
            <span>Os seus dados são processados localmente e não são armazenados.</span>
          </div>
        </div>
      </div>

      {/* Footer will be included in layout */}
    </div>
  );
}
