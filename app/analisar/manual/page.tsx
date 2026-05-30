'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Upload } from 'lucide-react';
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

  const [category, setCategory] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    if (!formData.productName) {
      addToast('error', 'Por favor, preencha o nome do produto');
      return;
    }

    // Add category to notes if selected
    const finalData = {
      ...formData,
      notes: category ? `${formData.notes}\nCategoria: ${category}`.trim() : formData.notes,
    };

    // Save to context for report page
    const result: AnalysisResult = {
      id: Date.now().toString(),
      analysis: finalData,
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
        <div className="max-w-[680px] mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/analisar')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#16a34a] transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#16a34a]/10 rounded-full text-[#16a34a] text-sm font-medium mb-4">
              ✨ ANÁLISE INTELIGENTE
            </div>
            <h2 className="text-3xl font-bold mb-3 text-gray-900">
              Análise de Produto Alimentar
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Insira os dados do produto para receber uma análise nutricional inteligente e exportar um relatório PDF profissional.
            </p>
          </div>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#e5e7eb] p-8 space-y-6 animate-slide-up">
            {/* Nome do produto */}
            <div>
              <label htmlFor="productName" className="block text-sm font-medium mb-2 text-gray-700">
                Nome do produto
              </label>
              <input
                id="productName"
                name="productName"
                type="text"
                value={formData.productName}
                onChange={handleChange}
                placeholder="Ex: Iogurte natural grego"
                className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                required
              />
            </div>

            {/* Fabricante e Data de validade */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="supplier" className="block text-sm font-medium mb-2 text-gray-700">
                  Fabricante (opcional)
                </label>
                <input
                  id="supplier"
                  name="supplier"
                  type="text"
                  value={formData.supplier}
                  onChange={handleChange}
                  placeholder="Ex: Lacticínios Bendula Lda."
                  className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                />
              </div>

              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium mb-2 text-gray-700">
                  Data de validade (opcional)
                </label>
                <input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  placeholder="Ex: 12/2026"
                  className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                />
              </div>
            </div>

            {/* Ingredientes */}
            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium mb-2 text-gray-700">
                Ingredientes
              </label>
              <textarea
                id="ingredients"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Ex: leite pasteurizado, fermentos lácteos, açúcar..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a] resize-none"
              />
            </div>

            {/* Calorias e Açúcar */}
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
            </div>

            {/* Sódio e Gordura */}
            <div className="grid grid-cols-2 gap-4">
              <div>
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
            </div>

            {/* Categoria alimentar */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2 text-gray-700">
                Categoria alimentar
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
              >
                <option value="">Selecione uma categoria</option>
                <option value="Cereais">Cereais</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Lacticínios">Lacticínios</option>
                <option value="Carnes">Carnes</option>
                <option value="Frutas e Vegetais">Frutas e Vegetais</option>
                <option value="Snacks">Snacks</option>
                <option value="Condimentos">Condimentos</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            {/* Upload de imagem OPCIONAL */}
            <div className="border-2 border-dashed border-[#16a34a] rounded-lg p-8 text-center hover:bg-[#f0fdf4] transition-colors cursor-pointer">
              <Upload className="h-8 w-8 text-[#16a34a] mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Carregar imagem para análise automática
              </p>
              <p className="text-xs text-gray-600">
                A IA lê o rótulo e preenche o formulário. Apenas alimentos.
              </p>
            </div>

            {/* Botão submit */}
            <button
              type="submit"
              className="w-full py-4 px-6 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors text-lg flex items-center justify-center gap-2"
            >
              <Search className="h-5 w-5" />
              Analisar Produto
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
