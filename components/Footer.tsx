'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Mail, Phone, Globe } from 'lucide-react';

export function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-[#14532d] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Column 1 - Logo & Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white rounded-full">
                <Leaf className="h-5 w-5 text-[#14532d]" />
              </div>
              <div>
                <span className="font-bold text-white text-lg">Bendula</span>
                <span className="text-[#16a34a] text-sm ml-1">Food Analyzer</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Plataforma de análise inteligente de produtos alimentares, desenvolvida 
              para tornar a informação nutricional mais clara e acessível a consumidores 
              e empresas.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => router.push('/')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Início
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/analisar')}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Analisar Produto
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors">
                  Sobre
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition-colors">
                  Contactos
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-300">
                <Globe className="h-4 w-4" />
                <span>bendulafoodanalyzer.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>isaacvieira1224@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+244 936310371</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom - Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          © 2026 Bendula Food Analyzer. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
