import { FoodAnalysis } from '@/types';

/**
 * Motor de análise local inteligente (fallback)
 * Executa análise baseada em regras quando a IA falha
 */
export class LocalAnalysisService {
  /**
   * Analisa uma imagem usando heurísticas locais
   * @param imageBase64 - Imagem em formato base64
   * @returns Análise do alimento com informações nutricionais e alergénios
   */
  static async analyzeImageLocally(imageBase64: string): Promise<FoodAnalysis> {
    console.log('[Local Analysis] Iniciando análise local...');

    // Como não podemos analisar a imagem sem IA, retornamos uma análise genérica
    // que indica que a análise manual é necessária
    return {
      is_food: true,
      food_type: 'prato',
      name_guess: 'Alimento não identificado',
      ingredients: [],
      possible_allergens: [],
      processing_level: 'processado',
      health_score: 5,
      confidence: 'baixa',
      notes: 'A análise automática não foi possível. Por favor, utilize a análise manual para obter informações detalhadas sobre este alimento.'
    };
  }

  /**
   * Gera alertas baseados em dados nutricionais
   * @param calories - Calorias
   * @param sugar - Açúcar em gramas
   * @param fat - Gordura em gramas
   * @param sodium - Sódio em miligramas
   * @returns Lista de alertas
   */
  static generateAlerts(calories: number, sugar: number, fat: number, sodium: number): string[] {
    const alerts: string[] = [];

    if (calories > 500) {
      alerts.push('Alto teor calórico - consuma com moderação');
    }

    if (sugar > 15) {
      alerts.push('Alto teor de açúcar - pode ser prejudicial à saúde se consumido em excesso');
    }

    if (fat > 20) {
      alerts.push('Alto teor de gordura - prefira opções com menor teor de gordura');
    }

    if (sodium > 600) {
      alerts.push('Alto teor de sódio - pode contribuir para hipertensão se consumido em excesso');
    }

    if (alerts.length === 0) {
      alerts.push('Nenhum alerta específico - produto parece equilibrado');
    }

    return alerts;
  }

  /**
   * Calcula score de saúde baseado em dados nutricionais
   * @param calories - Calorias
   * @param sugar - Açúcar em gramas
   * @param fat - Gordura em gramas
   * @param sodium - Sódio em miligramas
   * @returns Score de 0 a 10
   */
  static calculateHealthScore(calories: number, sugar: number, fat: number, sodium: number): number {
    let score = 10;

    // Penalizar calorias altas
    if (calories > 500) score -= 2;
    if (calories > 700) score -= 2;

    // Penalizar açúcar alto
    if (sugar > 10) score -= 1;
    if (sugar > 15) score -= 2;
    if (sugar > 25) score -= 2;

    // Penalizar gordura alta
    if (fat > 15) score -= 1;
    if (fat > 20) score -= 2;
    if (fat > 30) score -= 2;

    // Penalizar sódio alto
    if (sodium > 400) score -= 1;
    if (sodium > 600) score -= 2;
    if (sodium > 800) score -= 2;

    return Math.max(0, Math.min(10, score));
  }

  /**
   * Gera recomendações baseadas em dados nutricionais
   * @param healthScore - Score de saúde
   * @param alerts - Lista de alertas
   * @returns Lista de recomendações
   */
  static generateRecommendations(healthScore: number, alerts: string[]): string[] {
    const recommendations: string[] = [];

    if (healthScore >= 7) {
      recommendations.push('Este produto parece ser uma opção saudável');
      recommendations.push('Pode ser consumido regularmente como parte de uma dieta equilibrada');
    } else if (healthScore >= 4) {
      recommendations.push('Este produto deve ser consumido com moderação');
      recommendations.push('Considere equilibrar com opções mais saudáveis');
    } else {
      recommendations.push('Este produto deve ser consumido ocasionalmente');
      recommendations.push('Prefira opções mais saudáveis para consumo regular');
    }

    if (alerts.some(a => a.includes('açúcar'))) {
      recommendations.push('Reduza o consumo de outros alimentos açucarados no dia');
    }

    if (alerts.some(a => a.includes('sódio'))) {
      recommendations.push('Beba bastante água para ajudar a eliminar o excesso de sódio');
    }

    if (alerts.some(a => a.includes('gordura'))) {
      recommendations.push('Prefira métodos de cozimento que não adicionem gordura extra');
    }

    return recommendations;
  }

  /**
   * Detecta alergénios comuns baseados em ingredientes
   * @param ingredients - Lista de ingredientes
   * @returns Lista de alergénios possíveis
   */
  static detectAllergens(ingredients: string[]): string[] {
    const allergens: string[] = [];
    const commonAllergens = [
      'glúten', 'trigo', 'cevada', 'centeio', 'aveia',
      'lactose', 'leite', 'derivados do leite',
      'ovos', 'ovo',
      'amendoim', 'amendoins',
      'frutos secos', 'nozes', 'amêndoas', 'avelãs', 'castanhas',
      'soja', 'soja',
      'peixe', 'marisco', 'crustáceos', 'moluscos'
    ];

    const ingredientsText = ingredients.join(' ').toLowerCase();

    commonAllergens.forEach(allergen => {
      if (ingredientsText.includes(allergen)) {
        if (!allergens.includes(allergen)) {
          allergens.push(allergen);
        }
      }
    });

    return allergens;
  }

  /**
   * Determina nível de processamento baseado em ingredientes
   * @param ingredients - Lista de ingredientes
   * @returns Nível de processamento
   */
  static determineProcessingLevel(ingredients: string[]): 'não processado' | 'pouco processado' | 'processado' | 'ultra processado' {
    if (ingredients.length === 0) {
      return 'processado';
    }

    const ingredientsText = ingredients.join(' ').toLowerCase();

    // Indicadores de ultra processado
    const ultraProcessedIndicators = [
      'xarope', 'corante', 'aromatizante', 'conservante', 'emulsificante',
      'estabilizante', 'espessante', 'realçador', 'antioxidante', 'gordura hidrogenada'
    ];

    const hasUltraProcessedIndicators = ultraProcessedIndicators.some(indicator =>
      ingredientsText.includes(indicator)
    );

    if (hasUltraProcessedIndicators) {
      return 'ultra processado';
    }

    // Indicadores de processado
    const processedIndicators = [
      'açúcar', 'sal', 'óleo', 'farinha', 'extrato', 'concentrado'
    ];

    const hasProcessedIndicators = processedIndicators.some(indicator =>
      ingredientsText.includes(indicator)
    );

    if (hasProcessedIndicators || ingredients.length > 5) {
      return 'processado';
    }

    // Ingredientes simples e poucos
    if (ingredients.length <= 3) {
      return 'não processado';
    }

    return 'pouco processado';
  }
}
