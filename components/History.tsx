'use client';

import React from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Trash2, Clock } from 'lucide-react';
import { AnalysisResult as AnalysisResultType } from '@/types';
import { formatDate } from '@/lib/utils';
import { removeFromHistory, clearHistory } from '@/services/historyService';
import { addToast } from '@/services/toastService';

interface HistoryProps {
  history: AnalysisResultType[];
  onSelect: (result: AnalysisResultType) => void;
  onRefresh: () => void;
}

export function History({ history, onSelect, onRefresh }: HistoryProps) {
  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromHistory(id);
    onRefresh();
    addToast('info', 'Análise removida do histórico');
  };

  const handleClear = () => {
    clearHistory();
    onRefresh();
    addToast('info', 'Histórico limpo');
  };

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhuma análise no histórico</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Histórico</h3>
        <Button onClick={handleClear} variant="ghost" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Limpar
        </Button>
      </div>
      <div className="space-y-3">
        {history.map((item) => (
          <Card
            key={item.id}
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => onSelect(item)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <img
                  src={item.imageUrl}
                  alt="Thumbnail"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {'summary' in item.analysis && typeof item.analysis.summary === 'string'
                      ? (item.analysis.summary as string).slice(0, 50) + '...'
                      : 'Sem resumo'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(item.timestamp)}
                  </p>
                </div>
                <Button
                  onClick={(e) => handleRemove(item.id, e)}
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
