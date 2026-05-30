'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf } from 'lucide-react';
import { DevelopmentModal } from '@/components/ui/DevelopmentModal';

export function Navbar() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleModalTrigger = () => {
    setShowModal(true);
  };

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left - Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => router.push('/')}
            >
              <div className="p-2 bg-[#16a34a] rounded-full">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-black text-lg">Bendula</span>
                <span className="text-[#16a34a] text-sm ml-1">Food Analyzer</span>
              </div>
            </div>

            {/* Center - Links */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                className="text-gray-700 hover:text-[#16a34a] transition-colors"
                onClick={handleModalTrigger}
              >
                Sobre
              </button>
              <button 
                className="text-gray-700 hover:text-[#16a34a] transition-colors"
                onClick={handleModalTrigger}
              >
                Como Funciona
              </button>
              <button 
                className="text-gray-700 hover:text-[#16a34a] transition-colors"
                onClick={handleModalTrigger}
              >
                Parcerias
              </button>
              <button 
                className="text-gray-700 hover:text-[#16a34a] transition-colors"
                onClick={handleModalTrigger}
              >
                Contactos
              </button>
            </div>

            {/* Right - Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleModalTrigger}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={handleModalTrigger}
                className="px-4 py-2 border-2 border-[#16a34a] text-[#16a34a] rounded-lg hover:bg-[#16a34a] hover:text-white transition-colors"
              >
                Criar Conta
              </button>
            </div>
          </div>
        </div>
      </nav>

      <DevelopmentModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
