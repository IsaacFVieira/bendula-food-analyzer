'use client';

import React from 'react';

interface DevelopmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DevelopmentModal({ isOpen, onClose }: DevelopmentModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl p-8 max-w-md w-full animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-5xl mb-4">🚧</div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">
            Sistema em Desenvolvimento
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Esta funcionalidade será implementada brevemente. Estamos a trabalhar 
            para oferecer a melhor experiência possível. Obrigado pela sua paciência! 🙏
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
