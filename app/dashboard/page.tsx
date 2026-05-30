'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Edit } from 'lucide-react';
import { useAnalysis } from '@/contexts/AnalysisContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAnalysis();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4]">
      <div className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, {user?.name || 'Utilizador'}
          </h1>
          <p className="text-gray-600">Escolha como deseja analisar o produto</p>
        </div>

        {/* Analysis Options */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Image Analysis Option */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-8 hover:border-[#16a34a] hover:shadow-lg hover:shadow-[#16a34a]/10 hover:-translate-y-0.5 transition-all duration-300">
            <div className="p-4 bg-[#f0fdf4] rounded-full w-fit mb-6">
              <Camera className="h-8 w-8 text-[#16a34a]" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Análise por Imagem</h3>
            <p className="text-gray-600 mb-6">
              Envie uma imagem do alimento para análise automática usando inteligência artificial.
            </p>
            <button
              onClick={() => router.push('/analyze')}
              className="w-full py-3 px-4 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors"
            >
              <Camera className="h-5 w-5 mr-2 inline" />
              Fazer Análise por Imagem
            </button>
          </div>

          {/* Manual Entry Option */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-8 hover:border-[#16a34a] hover:shadow-lg hover:shadow-[#16a34a]/10 hover:-translate-y-0.5 transition-all duration-300">
            <div className="p-4 bg-[#f0fdf4] rounded-full w-fit mb-6">
              <Edit className="h-8 w-8 text-[#16a34a]" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Análise Manual</h3>
            <p className="text-gray-600 mb-6">
              Insira manualmente os dados nutricionais do alimento para análise detalhada.
            </p>
            <button
              onClick={() => router.push('/manual-entry')}
              className="w-full py-3 px-4 border-2 border-[#16a34a] text-[#16a34a] rounded-lg font-medium hover:bg-[#16a34a] hover:text-white transition-colors"
            >
              <Edit className="h-5 w-5 mr-2 inline" />
              Inserir Dados Manualmente
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h4 className="font-semibold mb-4 text-gray-900">Como funciona?</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#16a34a] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <p>Escolha o tipo de análise (imagem ou manual)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#16a34a] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <p>Forneça os dados do alimento (imagem ou informações manuais)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#16a34a] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <p>Receba um relatório detalhado com análise nutricional e exporte em PDF</p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="max-w-4xl mx-auto mt-8">
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-[#16a34a] transition-colors"
          >
            Sair da conta
          </button>
        </div>
      </div>
    </div>
  );
}
