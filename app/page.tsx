'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, FileText, Camera, FileText as FileIcon, Target, Eye, Heart, Upload, Brain, BarChart3, CheckCircle, Users, Building2, Stethoscope, Mail, Phone, Globe, Send } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const handleAnalyzeProduct = () => {
    router.push('/analisar');
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#16a34a]/10 rounded-full text-[#16a34a] text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            <span>Powered by AI</span>
          </div>
          
          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Análise Inteligente de
            <span className="text-[#16a34a]"> Produtos Alimentares</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Identifique ingredientes, detecte alergénios e obtenha informações nutricionais 
            automaticamente usando inteligência artificial de última geração.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleAnalyzeProduct}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors text-lg"
          >
            Analisar Produto
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 text-center">
            <div className="p-4 bg-[#f0fdf4] rounded-full w-fit mx-auto mb-4">
              <Camera className="h-8 w-8 text-[#16a34a]" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Análise por Imagem</h3>
            <p className="text-sm text-gray-600">
              Envie uma imagem do rótulo para análise automática com IA.
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 text-center">
            <div className="p-4 bg-[#f0fdf4] rounded-full w-fit mx-auto mb-4">
              <FileText className="h-8 w-8 text-[#16a34a]" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Entrada Manual</h3>
            <p className="text-sm text-gray-600">
              Insira dados nutricionais manualmente para análise detalhada.
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 text-center">
            <div className="p-4 bg-[#f0fdf4] rounded-full w-fit mx-auto mb-4">
              <FileIcon className="h-8 w-8 text-[#16a34a]" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-gray-900">Relatórios PDF</h3>
            <p className="text-sm text-gray-600">
              Gere relatórios profissionais com gráficos e exportação PDF.
            </p>
          </div>
        </div>

        {/* SOBRE Section */}
        <section className="max-w-6xl mx-auto mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que é o Bendula Food Analyzer?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              O Bendula é uma plataforma que ajuda consumidores e empresas a compreenderem melhor produtos alimentares através da análise inteligente de ingredientes e informação nutricional. Surgiu da necessidade de tornar os rótulos mais legíveis, especialmente em produtos ultraprocessados com listas complexas de aditivos. O objetivo é apoiar escolhas alimentares mais conscientes com tecnologia acessível.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <div className="p-3 bg-[#16a34a]/10 rounded-lg w-fit mb-4">
                <Target className="h-6 w-6 text-[#16a34a]" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Missão</h3>
              <p className="text-sm text-gray-600">
                Democratizar o acesso à interpretação nutricional com ferramentas digitais intuitivas.
              </p>
            </div>
            
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <div className="p-3 bg-[#16a34a]/10 rounded-lg w-fit mb-4">
                <Eye className="h-6 w-6 text-[#16a34a]" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Visão</h3>
              <p className="text-sm text-gray-600">
                Ser referência em análise alimentar inteligente para consumidores e marcas.
              </p>
            </div>
            
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6">
              <div className="p-3 bg-[#16a34a]/10 rounded-lg w-fit mb-4">
                <Heart className="h-6 w-6 text-[#16a34a]" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Valores</h3>
              <p className="text-sm text-gray-600">
                Transparência alimentar, Inovação responsável, Educação nutricional, Acessibilidade digital.
              </p>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA Section */}
        <section className="max-w-6xl mx-auto mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quatro passos para uma análise completa
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 text-center">
              <div className="p-4 bg-[#f0fdf4] rounded-full w-fit mx-auto mb-4">
                <Upload className="h-8 w-8 text-[#16a34a]" />
              </div>
              <div className="text-sm font-semibold text-[#16a34a] mb-2">Passo 1</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Inserção dos dados</h3>
              <p className="text-sm text-gray-600">
                Introduza o nome, ingredientes, valores nutricionais, categoria ou imagem opcional do produto.
              </p>
            </div>
            
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 text-center">
              <div className="p-4 bg-[#f0fdf4] rounded-full w-fit mx-auto mb-4">
                <Brain className="h-8 w-8 text-[#16a34a]" />
              </div>
              <div className="text-sm font-semibold text-[#16a34a] mb-2">Passo 2</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Processamento inteligente</h3>
              <p className="text-sm text-gray-600">
                O motor de análise interpreta a composição e cruza os dados com evidências nutricionais.
              </p>
            </div>
            
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 text-center">
              <div className="p-4 bg-[#f0fdf4] rounded-full w-fit mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-[#16a34a]" />
              </div>
              <div className="text-sm font-semibold text-[#16a34a] mb-2">Passo 3</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Análise nutricional</h3>
              <p className="text-sm text-gray-600">
                São calculados score, classificação, alertas de saúde e perfil de risco alimentar.
              </p>
            </div>
            
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 text-center">
              <div className="p-4 bg-[#f0fdf4] rounded-full w-fit mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-[#16a34a]" />
              </div>
              <div className="text-sm font-semibold text-[#16a34a] mb-2">Passo 4</div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Resultado e recomendações</h3>
              <p className="text-sm text-gray-600">
                Receba descrição automática, benefícios, recomendações e orientação sobre quem pode consumir.
              </p>
            </div>
          </div>
        </section>

        {/* PARCEIROS Section */}
        <section className="max-w-6xl mx-auto mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ecossistema colaborador
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              O Bendula foi concebido para integrar especialistas, instituições e o setor alimentar.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 text-center">
              <div className="p-4 bg-[#f0fdf4] rounded-full w-fit mx-auto mb-4">
                <Stethoscope className="h-8 w-8 text-[#16a34a]" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Nutricionistas</h3>
              <p className="text-sm text-gray-600">
                Parcerias com profissionais de nutrição para validação de critérios e recomendações de consumo.
              </p>
            </div>
            
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 text-center">
              <div className="p-4 bg-[#f0fdf4] rounded-full w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-[#16a34a]" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Autoridades de saúde</h3>
              <p className="text-sm text-gray-600">
                Alinhamento com boas práticas de informação alimentar e literacia em saúde pública.
              </p>
            </div>
            
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6 text-center">
              <div className="p-4 bg-[#f0fdf4] rounded-full w-fit mx-auto mb-4">
                <Building2 className="h-8 w-8 text-[#16a34a]" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Empresas alimentares</h3>
              <p className="text-sm text-gray-600">
                Colaboração com marcas para transparência de rótulos e melhoria contínua de formulações.
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors">
              Tornar-se Parceiro
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </section>

        {/* CONTACTO Section */}
        <section className="max-w-6xl mx-auto mt-24 mb-16">
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Left Column - Contact Info */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Fale connosco
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Tem dúvidas sobre parcerias, análises ou demonstrações da plataforma? Envie uma mensagem.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-[#16a34a]" />
                    <span className="text-gray-700">bendulafoodanalyzer.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-[#16a34a]" />
                    <span className="text-gray-700">isaacvieira1224@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-[#16a34a]" />
                    <span className="text-gray-700">+244 936310371</span>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Contact Form */}
              <div>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      O seu nome
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent outline-none"
                      placeholder="João Silva"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      O seu email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent outline-none"
                      placeholder="joao@exemplo.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto da mensagem
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent outline-none"
                      placeholder="Parceria / Dúvida / Demonstração"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Escreva a sua mensagem aqui
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-[#16a34a] focus:border-transparent outline-none resize-none"
                      placeholder="A sua mensagem..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors"
                  >
                    Enviar mensagem
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
