import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toast } from '@/components/ui/Toast';
import { AnalysisProvider } from '@/contexts/AnalysisContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bendula Food Analyzer',
  description: 'Analise alimentos com inteligência artificial - identifique ingredientes, alergénios e informações nutricionais',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AnalysisProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toast />
        </AnalysisProvider>
      </body>
    </html>
  );
}
