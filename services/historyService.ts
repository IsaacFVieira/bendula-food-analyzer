import { AnalysisResult } from '@/types';

const HISTORY_KEY = 'ai-analyzer-history';

/**
 * Salva uma análise no histórico local
 */
export function saveToHistory(result: AnalysisResult): void {
  if (typeof window === 'undefined') return;
  
  const history = getHistory();
  history.unshift(result);
  
  // Mantém apenas as últimas 20 análises
  const trimmedHistory = history.slice(0, 20);
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));
}

/**
 * Retorna o histórico de análises
 */
export function getHistory(): AnalysisResult[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Limpa o histórico de análises
 */
export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(HISTORY_KEY);
}

/**
 * Remove uma análise específica do histórico
 */
export function removeFromHistory(id: string): void {
  if (typeof window === 'undefined') return;
  
  const history = getHistory();
  const filtered = history.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
}
