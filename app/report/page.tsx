'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, FileText, AlertTriangle, CheckCircle, XCircle, ThumbsUp, ThumbsDown, Snowflake, Thermometer } from 'lucide-react';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { FoodAnalysis, ManualFoodEntry } from '@/types';
import { generatePDF } from '@/services/pdfService';

export default function ReportPage() {
  const router = useRouter();
  const { currentAnalysis } = useAnalysis();

  useEffect(() => {
    if (!currentAnalysis) {
      router.push('/analisar');
    }
  }, [currentAnalysis, router]);

  if (!currentAnalysis) {
    return null;
  }

  const isImageAnalysis = currentAnalysis.analysisType === 'image';
  const analysis = currentAnalysis.analysis as FoodAnalysis;
  const manualData = currentAnalysis.analysis as ManualFoodEntry;

  const getHealthAssessment = () => {
    if (isImageAnalysis) {
      const score = analysis.health_score || 0;
      if (score >= 7) return { status: 'Saudável', color: 'bg-[#dcfce7] text-[#16a34a]', progress: 'bg-[#16a34a]', gaugeColor: '#16A34A' };
      if (score >= 4) return { status: 'Moderado', color: 'bg-[#fff7ed] text-[#f97316]', progress: 'bg-[#f97316]', gaugeColor: '#F59E0B' };
      return { status: 'Ultraprocessado', color: 'bg-[#fef2f2] text-[#ef4444]', progress: 'bg-[#ef4444]', gaugeColor: '#EF4444' };
    } else {
      // Simple calculation for manual entry
      const totalScore = manualData.calories > 400 ? -1 : 1;
      const sugarScore = manualData.sugar > 15 ? -1 : 1;
      const fatScore = manualData.fat > 20 ? -1 : 1;
      const finalScore = totalScore + sugarScore + fatScore;
      
      if (finalScore >= 2) return { status: 'Saudável', color: 'bg-[#dcfce7] text-[#16a34a]', progress: 'bg-[#16a34a]', gaugeColor: '#16A34A' };
      if (finalScore >= 0) return { status: 'Moderado', color: 'bg-[#fff7ed] text-[#f97316]', progress: 'bg-[#f97316]', gaugeColor: '#F59E0B' };
      return { status: 'Ultraprocessado', color: 'bg-[#fef2f2] text-[#ef4444]', progress: 'bg-[#ef4444]', gaugeColor: '#EF4444' };
    }
  };

  const getGaugeColor = (score: number) => {
    if (score <= 40) return '#EF4444'; // Red for 0-40
    if (score <= 70) return '#F59E0B'; // Orange for 41-70
    return '#16A34A'; // Green for 71-100
  };

  const healthAssessment = getHealthAssessment();
  const score = isImageAnalysis ? (analysis.health_score || 0) * 10 : 50; // Default score for manual

  const handleExportPDF = async () => {
    if (!currentAnalysis) return;
    
    try {
      await generatePDF(currentAnalysis);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  };

  const getAlerts = () => {
    const alerts = [];
    if (isImageAnalysis) {
      if (analysis.possible_allergens && analysis.possible_allergens.length > 0) {
        alerts.push(`Contém alergénios: ${analysis.possible_allergens.join(', ')}`);
      }
      if (analysis.processing_level === 'ultra processado') {
        alerts.push('Alimento ultra processado');
      }
    } else {
      if (manualData.sugar > 15) alerts.push('Alto teor de açúcar');
      if (manualData.fat > 20) alerts.push('Alto teor de gordura');
      if (manualData.sodium > 600) alerts.push('Alto teor de sódio');
    }
    return alerts;
  };

  const getBenefits = () => {
    const benefits = [];
    if (isImageAnalysis) {
      benefits.push('Análise inteligente Bendula');
    } else {
      benefits.push('Dados inseridos manualmente pelo utilizador');
      benefits.push('Informações nutricionais detalhadas');
    }
    return benefits;
  };

  const alerts = getAlerts();
  const benefits = getBenefits();

  return (
    <div className="min-h-screen bg-[#f0fdf4]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
          {/* Back Button */}
          <button
            onClick={() => router.push('/analisar')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#16a34a] transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          {/* SECÇÃO 1 — Cabeçalho do produto (3 colunas) */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Col esquerda: imagem do produto */}
              <div className="flex items-center justify-center">
                <div className="w-40 h-40 bg-[#f0fdf4] rounded-lg flex items-center justify-center border border-[#e5e7eb]">
                  <FileText className="h-16 w-16 text-[#16a34a]" />
                </div>
              </div>

              {/* Col centro */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#16a34a]/10 rounded-full text-[#16a34a] text-xs font-medium">
                  ✨ Análise inteligente Bendula
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isImageAnalysis ? analysis.name_guess || 'Não identificado' : manualData.productName}
                </h2>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${healthAssessment.color}`}>
                  {healthAssessment.status}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    📂 {isImageAnalysis ? analysis.food_type || 'Não especificado' : 'Alimento'}
                  </span>
                  {!isImageAnalysis && manualData.supplier && (
                    <span className="flex items-center gap-1">
                      🏭 {manualData.supplier}
                    </span>
                  )}
                  {!isImageAnalysis && manualData.expiryDate && (
                    <span className="flex items-center gap-1">
                      📅 {new Date(manualData.expiryDate).toLocaleDateString('pt-PT')}
                    </span>
                  )}
                </div>
                <div className="w-full">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Score</span>
                    <span>{score}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${healthAssessment.progress}`} style={{ width: `${score}%` }}></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {isImageAnalysis 
                    ? `${analysis.name_guess || 'Não identificado'} apresenta perfil nutricional ${healthAssessment.status.toLowerCase()} na categoria ${analysis.food_type || 'Não especificado'}. Equilibre com alimentos frescos no restante da dieta.`
                    : `${manualData.productName} apresenta perfil nutricional ${healthAssessment.status.toLowerCase()}. Equilibre com alimentos frescos no restante da dieta.`
                  }
                </p>
                
                {/* Ficha Técnica Rápida */}
                <div className="mt-4 p-3 bg-[#f0fdf4] rounded-lg border border-[#16a34a]/20">
                  <p className="text-xs text-gray-700 font-medium mb-1">Ficha Técnica Rápida</p>
                  <p className="text-xs text-gray-600">
                    {isImageAnalysis 
                      ? `Categoria: ${analysis.food_type || 'Não especificado'}. Classificação: ${healthAssessment.status}. Sem alertas críticos nos critérios avaliados.`
                      : `Porção analisada: ${manualData.calories} kcal, ${manualData.sugar}g açúcar, ${manualData.sodium}mg sódio, ${manualData.fat}g gordura. Categoria: Alimento. Classificação: ${healthAssessment.status}.`
                    }
                  </p>
                </div>
              </div>

              {/* Col direita: score circular SVG */}
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle 
                      cx="64" cy="64" r="56" 
                      stroke={getGaugeColor(score)}
                      strokeWidth="8" 
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - score / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{score}</span>
                    <span className="text-xs text-gray-600">Score</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECÇÃO 2 — Grid 2 colunas */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card "⚠️ Alertas" */}
            <div className={`bg-white rounded-xl border border-[#e5e7eb] p-6 ${alerts.length > 0 ? 'border-l-4 border-l-[#ef4444]' : 'border-l-4 border-l-[#16a34a]'}`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                ⚠️ Alertas
              </h3>
              {alerts.length > 0 ? (
                <ul className="space-y-2">
                  {alerts.map((alert, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <XCircle className="h-4 w-4 text-[#ef4444] mt-0.5 flex-shrink-0" />
                      {alert}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#16a34a] flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Nenhum alerta crítico identificado.
                </p>
              )}
            </div>

            {/* Card "💚 Benefícios" */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 border-l-4 border-l-[#16a34a]">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                💚 Benefícios
              </h3>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-[#16a34a] mt-0.5 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SECÇÃO 3 — Conservação Recomendada */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
              <Thermometer className="h-5 w-5 text-[#16a34a]" />
              Conservação Recomendada
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-[#16a34a]">•</span>
                Manter refrigerado entre 2°C e 8°C.
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-[#16a34a]">•</span>
                Consumir preferencialmente até à data indicada na embalagem.
              </li>
            </ul>
          </div>

          {/* SECÇÃO 4 — Recomendações */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Recomendações</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-[#16a34a]">•</span>
                Consulte um nutricionista para orientação personalizada.
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-[#16a34a]">•</span>
                Compare sempre o rótulo com produtos da mesma categoria.
              </li>
            </ul>
          </div>

          {/* SECÇÃO 5 — Quem pode consumir / Quem deve evitar */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card verde claro "👍 Quem pode consumir" */}
            <div className="bg-[#dcfce7] rounded-xl border border-[#16a34a]/20 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#16a34a]">
                👍 Quem pode consumir
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-[#16a34a] mt-0.5 flex-shrink-0" />
                  Adultos saudáveis em consumo ocasional
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-[#16a34a] mt-0.5 flex-shrink-0" />
                  Pessoas sem restrições médicas específicas
                </li>
              </ul>
            </div>

            {/* Card vermelho claro "👎 Quem deve evitar" */}
            <div className="bg-[#fef2f2] rounded-xl border border-[#ef4444]/20 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#ef4444]">
                👎 Quem deve evitar
              </h3>
              <ul className="space-y-2">
                {alerts.length > 0 ? (
                  alerts.map((alert, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <XCircle className="h-4 w-4 text-[#ef4444] mt-0.5 flex-shrink-0" />
                      {alert}
                    </li>
                  ))
                ) : (
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-[#16a34a] mt-0.5 flex-shrink-0" />
                    Nenhum grupo específico
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* BOTÕES FINAIS */}
          <div className="flex justify-center gap-4">
            <button 
              className="py-3 px-6 border-2 border-[#16a34a] text-[#16a34a] rounded-lg font-medium hover:bg-[#f0fdf4] transition-colors flex items-center gap-2"
              onClick={handleExportPDF}
            >
              <FileText className="h-5 w-5" />
              Gerar Relatório PDF
            </button>
            <button 
              className="py-3 px-6 border border-[#e5e7eb] text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              onClick={() => router.push('/analisar')}
            >
              <ArrowLeft className="h-5 w-5" />
              Analisar Outro Produto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
