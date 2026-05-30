'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { ManualFoodEntry, AnalysisResult } from '@/types';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { addToast } from '@/services/toastService';

export default function ManualEntryPage() {
  const router = useRouter();
  const { setCurrentAnalysis } = useAnalysis();
  
  const [formData, setFormData] = useState<ManualFoodEntry>({
    productName: '',
    calories: 0,
    sugar: 0,
    fat: 0,
    protein: 0,
    sodium: 0,
    expiryDate: '',
    supplier: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'calories' || name === 'sugar' || name === 'fat' || name === 'protein' || name === 'sodium' 
        ? parseFloat(value) || 0 
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.productName || !formData.supplier || !formData.expiryDate) {
      addToast('error', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Save to context for report page
    const result: AnalysisResult = {
      id: Date.now().toString(),
      analysis: formData,
      timestamp: Date.now(),
      analysisType: 'manual',
    };
    
    setCurrentAnalysis(result);
    addToast('success', 'Dados guardados com sucesso!');
    router.push('/report');
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/analisar')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#16a34a] transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          {/* Hero Section */}
          <div className="text-center py-8 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Inserir Dados do Alimento
            </h2>
            
            <p className="text-gray-600 mb-8">
              Preencha os dados nutricionais do alimento para gerar um relatório detalhado.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">Informações Básicas</h3>
              
              <div>
                <label htmlFor="productName" className="block text-sm font-medium mb-2 text-gray-700">
                  Nome do Produto *
                </label>
                <input
                  id="productName"
                  name="productName"
                  type="text"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Ex: Arroz Integral"
                  className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                  required
                />
              </div>

              <div>
                <label htmlFor="supplier" className="block text-sm font-medium mb-2 text-gray-700">
                  Fornecedor *
                </label>
                <input
                  id="supplier"
                  name="supplier"
                  type="text"
                  value={formData.supplier}
                  onChange={handleChange}
                  placeholder="Ex: Supermercado X"
                  className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                  required
                />
              </div>

              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium mb-2 text-gray-700">
                  Data de Validade *
                </label>
                <input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                  required
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">Informações Nutricionais (por 100g)</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="calories" className="block text-sm font-medium mb-2 text-gray-700">
                    Calorias (kcal)
                  </label>
                  <input
                    id="calories"
                    name="calories"
                    type="number"
                    step="0.1"
                    value={formData.calories || ''}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                  />
                </div>

                <div>
                  <label htmlFor="sugar" className="block text-sm font-medium mb-2 text-gray-700">
                    Açúcar (g)
                  </label>
                  <input
                    id="sugar"
                    name="sugar"
                    type="number"
                    step="0.1"
                    value={formData.sugar || ''}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                  />
                </div>

                <div>
                  <label htmlFor="fat" className="block text-sm font-medium mb-2 text-gray-700">
                    Gordura (g)
                  </label>
                  <input
                    id="fat"
                    name="fat"
                    type="number"
                    step="0.1"
                    value={formData.fat || ''}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                  />
                </div>

                <div>
                  <label htmlFor="protein" className="block text-sm font-medium mb-2 text-gray-700">
                    Proteína (g)
                  </label>
                  <input
                    id="protein"
                    name="protein"
                    type="number"
                    step="0.1"
                    value={formData.protein || ''}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                  />
                </div>

                <div className="col-span-2">
                  <label htmlFor="sodium" className="block text-sm font-medium mb-2 text-gray-700">
                    Sódio (mg)
                  </label>
                  <input
                    id="sodium"
                    name="sodium"
                    type="number"
                    step="0.1"
                    value={formData.sodium || ''}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 space-y-4">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">Informações Adicionais</h3>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-2 text-gray-700">
                  Notas (Opcional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Observações adicionais sobre o produto..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a] resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                type="button" 
                className="flex-1 py-3 px-4 border border-[#e5e7eb] rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => router.push('/analisar')}
              >
                Cancelar
              </button>
              <button type="submit" className="flex-1 py-3 px-4 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors">
                <Save className="h-4 w-4 mr-2 inline" />
                Guardar e Gerar Relatório
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
