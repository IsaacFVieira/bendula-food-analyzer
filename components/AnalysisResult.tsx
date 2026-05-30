'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Copy, Download, AlertCircle, CheckCircle, Utensils, AlertTriangle, Heart, Scale } from 'lucide-react';
import { FoodAnalysis } from '@/types';
import { cn } from '@/lib/utils';
import { copyToClipboard, downloadAsTxt } from '@/lib/utils';
import { addToast } from '@/services/toastService';

interface AnalysisResultProps {
  analysis: FoodAnalysis;
  imageUrl: string;
}

export function AnalysisResult({ analysis, imageUrl }: AnalysisResultProps) {
  const handleCopy = () => {
    const fullText = analysis.is_food
      ? `
=== Análise de Alimento - Bendula ===

Tipo de Alimento: ${analysis.food_type}
Nome Identificado: ${analysis.name_guess}

Ingredientes:
${analysis.ingredients?.join(', ') || 'Não identificados'}

Possíveis Alergénios:
${analysis.possible_allergens?.join(', ') || 'Nenhum identificado'}

Nível de Processamento: ${analysis.processing_level}
Pontuação de Saúde: ${analysis.health_score}/10
Confiança: ${analysis.confidence}

Observações:
${analysis.notes || 'Nenhuma'}

=== Fim da Análise ===
      `.trim()
      : `
=== Análise de Alimento - Bendula ===

Resultado: Não é alimento
Motivo: ${analysis.reason}

=== Fim da Análise ===
      `.trim();

    copyToClipboard(fullText).then(() => {
      addToast('success', 'Resultado copiado para a área de transferência');
    });
  };

  const handleDownload = () => {
    const fullText = analysis.is_food
      ? `
=== Análise de Alimento - Bendula ===

Tipo de Alimento: ${analysis.food_type}
Nome Identificado: ${analysis.name_guess}

Ingredientes:
${analysis.ingredients?.join(', ') || 'Não identificados'}

Possíveis Alergénios:
${analysis.possible_allergens?.join(', ') || 'Nenhum identificado'}

Nível de Processamento: ${analysis.processing_level}
Pontuação de Saúde: ${analysis.health_score}/10
Confiança: ${analysis.confidence}

Observações:
${analysis.notes || 'Nenhuma'}

=== Fim da Análise ===
      `.trim()
      : `
=== Análise de Alimento - Bendula ===

Resultado: Não é alimento
Motivo: ${analysis.reason}

=== Fim da Análise ===
      `.trim();

    downloadAsTxt(fullText, 'analise-alimento.txt');
    addToast('success', 'Arquivo baixado com sucesso');
  };

  const getHealthScoreColor = (score?: number) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 7) return 'text-green-500';
    if (score >= 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getConfidenceColor = (confidence?: string) => {
    if (!confidence) return 'text-muted-foreground';
    if (confidence === 'alta') return 'text-green-500';
    if (confidence === 'média') return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex gap-3 justify-end">
        <Button onClick={handleCopy} variant="outline" size="sm">
          <Copy className="h-4 w-4 mr-2" />
          Copiar
        </Button>
        <Button onClick={handleDownload} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Baixar TXT
        </Button>
      </div>

      {!analysis.is_food ? (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Não é Alimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{analysis.reason}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-primary" />
                Identificação do Alimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tipo</p>
                <p className="text-lg font-semibold capitalize">{analysis.food_type}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Nome Identificado</p>
                <p className="text-lg font-semibold">{analysis.name_guess}</p>
              </div>
            </CardContent>
          </Card>

          {analysis.ingredients && analysis.ingredients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  Ingredientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {analysis.possible_allergens && analysis.possible_allergens.length > 0 && (
            <Card className="border-orange-500/50 bg-orange-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-500">
                  <AlertTriangle className="h-5 w-5" />
                  Possíveis Alergénios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.possible_allergens.map((allergen, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-sm font-medium"
                    >
                      {allergen}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Informações Nutricionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Nível de Processamento
                  </p>
                  <p className="text-lg font-semibold capitalize">{analysis.processing_level}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Pontuação de Saúde
                  </p>
                  <p className={cn('text-2xl font-bold', getHealthScoreColor(analysis.health_score))}>
                    {analysis.health_score}/10
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Confiança da Análise
                </p>
                <p className={cn('text-sm font-medium', getConfidenceColor(analysis.confidence))}>
                  {analysis.confidence?.toUpperCase()}
                </p>
              </div>
            </CardContent>
          </Card>

          {analysis.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{analysis.notes}</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
