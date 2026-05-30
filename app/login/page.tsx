'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Utensils, LogIn } from 'lucide-react';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { addToast } from '@/services/toastService';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAnalysis();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login delay
    setTimeout(() => {
      const success = login(email, password);
      
      if (success) {
        addToast('success', 'Login realizado com sucesso!');
        router.push('/dashboard');
      } else {
        addToast('error', 'Email ou senha inválidos');
      }
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-8">
          <div className="text-center mb-8">
            <div className="p-3 bg-[#f0fdf4] rounded-lg w-fit mx-auto mb-4">
              <Utensils className="h-8 w-8 text-[#16a34a]" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-gray-900">Bendula Food Analysis</h1>
            <p className="text-gray-600">Entre para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#16a34a] text-white rounded-lg font-medium hover:bg-[#15803d] transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                'Entrando...'
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2 inline" />
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <button className="text-[#16a34a] hover:underline">
                Criar conta
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Para demonstração, use qualquer email e senha
        </p>
      </div>
    </div>
  );
}
