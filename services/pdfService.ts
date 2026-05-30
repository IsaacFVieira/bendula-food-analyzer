import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FoodAnalysis, ManualFoodEntry, AnalysisResult } from '@/types';

// Extend jsPDF to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

export class PDFService {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 20;
  }

  private addHeader(title: string, subtitle: string) {
    // Professional dark gray header
    this.doc.setFillColor(51, 51, 51); // #333333
    this.doc.rect(0, 0, this.pageWidth, 45, 'F');

    // White text for title
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, 18);

    // Lighter gray for subtitle
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(220, 220, 220);
    this.doc.text(subtitle, this.margin, 28);
  }

  private addSectionTitle(title: string, y: number) {
    this.doc.setTextColor(51, 51, 51); // Dark gray
    this.doc.setFontSize(13);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, y);
    
    // Add underline
    this.doc.setDrawColor(22, 163, 74); // Green accent
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, y + 3, this.pageWidth - this.margin, y + 3);
    
    return y + 12;
  }

  private addFooter(pageNum: number, totalPages: number) {
    const footerY = this.pageHeight - 35;
    
    // Subtle divider line
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.3);
    this.doc.line(this.margin, footerY - 12, this.pageWidth - this.margin, footerY - 12);

    // Footer text
    this.doc.setFontSize(8);
    this.doc.setTextColor(100, 100, 100);
    this.doc.setFont('helvetica', 'normal');
    
    // System name (identification)
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Bendula Food Analyzer', this.margin, footerY);
    
    // Contact information
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Site: bendulafoodanalyzer.com', this.margin, footerY + 6);
    this.doc.text('Email: isaacvieira1224@gmail.com', this.margin, footerY + 12);
    this.doc.text('Telefone: +244 936310371', this.margin, footerY + 18);
    
    // Automation note (centered)
    this.doc.text('Relatório gerado automaticamente', this.pageWidth / 2, footerY + 6, { align: 'center' });
    
    // Page number on the right
    this.doc.text(`Página ${pageNum} de ${totalPages}`, this.pageWidth - this.margin, footerY + 12, { align: 'right' });
  }

  private getSafeFinalY(defaultY: number): number {
    try {
      if ((this.doc as any).lastAutoTable && (this.doc as any).lastAutoTable.finalY) {
        return (this.doc as any).lastAutoTable.finalY + 15;
      }
    } catch (e) {
      // Fallback to default
    }
    return defaultY + 15;
  }

  private checkPageBreak(y: number, requiredSpace: number = 40): boolean {
    const footerMargin = 60; // 60px margin for footer safety
    const footerStart = this.pageHeight - footerMargin;
    return y + requiredSpace > footerStart;
  }

  private ensurePageBreak(y: number, requiredSpace: number = 40): number {
    if (this.checkPageBreak(y, requiredSpace)) {
      this.doc.addPage();
      this.addHeader('Bendula Food Analyzer', 'Relatório Nutricional Inteligente');
      return 55; // Reset Y to top of new page
    }
    return y;
  }

  public async generatePDF(analysisResult: AnalysisResult): Promise<void> {
    const isImageAnalysis = analysisResult.analysisType === 'image';
    const analysis = analysisResult.analysis as FoodAnalysis;
    const manualData = analysisResult.analysis as ManualFoodEntry;

    // Extract data (no changes to data variables)
    const productName = isImageAnalysis ? (analysis.name_guess || 'Não identificado') : manualData.productName;
    const category = isImageAnalysis ? (analysis.food_type || 'Não especificado') : 'Alimento';
    const supplier = isImageAnalysis ? 'N/A' : (manualData.supplier || 'N/A');
    const expiry = isImageAnalysis ? 'N/A' : (manualData.expiryDate ? new Date(manualData.expiryDate).toLocaleDateString('pt-PT') : 'N/A');
    const ingredients = isImageAnalysis 
      ? (analysis.ingredients?.join(', ') || 'N/A') 
      : (manualData.notes || 'N/A');

    const calories = isImageAnalysis ? 0 : (manualData.calories || 0);
    const sugar = isImageAnalysis ? 0 : (manualData.sugar || 0);
    const sodium = isImageAnalysis ? 0 : (manualData.sodium || 0);
    const fat = isImageAnalysis ? 0 : (manualData.fat || 0);

    const healthScore = isImageAnalysis ? (analysis.health_score || 0) * 10 : 50;
    
    // Classification logic
    let classification = 'Moderado';
    let classificationColor = [249, 115, 22]; // orange
    
    if (healthScore >= 70) {
      classification = 'Saudável';
      classificationColor = [22, 163, 74]; // green
    } else if (healthScore < 40) {
      classification = 'Ultraprocessado';
      classificationColor = [239, 68, 68]; // red
    }

    // PAGE 1: Dados do Produto e Informação Nutricional
    this.addHeader('Bendula Food Analyzer', 'Relatório Nutricional Inteligente');

    let y = 55;

    // Bloco 1: Dados do Produto
    y = this.addSectionTitle('Dados do Produto', y);
    
    // Product data in technical list format with vertical bar delimiters
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(60, 60, 60);

    const productLines = [
      `Nome: ${productName} | Categoria: ${category} | Fabricante: ${supplier} | Validade: ${expiry}`,
    ];

    productLines.forEach((line) => {
      this.doc.text(line, this.margin, y);
      y += 8;
    });

    y += 5;

    // Ingredients section
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(51, 51, 51);
    this.doc.text('Ingredientes:', this.margin, y);
    y += 8;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(80, 80, 80);
    const splitIngredients = this.doc.splitTextToSize(ingredients, this.pageWidth - 2 * this.margin);
    this.doc.text(splitIngredients, this.margin, y);
    y += splitIngredients.length * 5 + 15;

    // Highlight note after ingredients
    if (sugar > 15 || sodium > 600 || fat > 20) {
      this.doc.setFillColor(255, 243, 205); // Light yellow background
      this.doc.roundedRect(this.margin, y - 5, this.pageWidth - 2 * this.margin, 20, 3, 3, 'F');
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(180, 83, 9); // Dark orange
      const highlightText = sugar > 15 
        ? '⚠ Alto teor de açúcar, consumo deve ser ocasional.'
        : sodium > 600 
          ? '⚠ Alto teor de sódio, consumo deve ser moderado.'
          : '⚠ Alto teor de gordura, consumo deve ser moderado.';
      this.doc.text(highlightText, this.margin + 5, y + 8);
      y += 30;
    }

    // Check if we need a page break before nutritional table
    // Nutritional table needs approximately 100px space, add buffer
    y = this.ensurePageBreak(y, 120);

    // Bloco 2: Informação Nutricional
    y = this.addSectionTitle('Informação Nutricional', y);

    // Add date/time stamp below section title
    const timestamp = new Date(analysisResult.timestamp).toLocaleString('pt-PT');
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(128, 128, 128);
    this.doc.text(`Gerado em: ${timestamp}`, this.margin, y);
    y += 10;

    const nutritionalData = [
      ['Nutriente', 'Valor', 'Referência'],
      ['Calorias', `${calories} kcal`, '< 400 ideal'],
      ['Açúcar', `${sugar} g`, '< 10g ideal'],
      ['Sódio', `${sodium} mg`, '< 400mg ideal'],
      ['Gordura', `${fat} g`, '< 15g ideal'],
    ];

    autoTable(this.doc, {
      startY: y,
      head: [['Nutriente', 'Valor', 'Referência']],
      body: nutritionalData,
      theme: 'grid',
      headStyles: {
        fillColor: [51, 51, 51],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 10,
        textColor: [60, 60, 60],
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { left: this.margin, right: this.margin },
      styles: {
        cellPadding: 8,
      },
      pageBreak: 'avoid', // Prevent table from splitting across pages
      rowPageBreak: 'avoid', // Prevent rows from breaking
    });

    y = this.getSafeFinalY(y);

    // Footer for page 1
    this.addFooter(1, 2);

    // PAGE 2: Análise Visual dos Nutrientes e Resultados
    this.doc.addPage();
    this.addHeader('Bendula Food Analyzer', 'Relatório Nutricional Inteligente');

    y = 55;

    // Visual chart for nutritional values
    y = this.addSectionTitle('Análise Visual dos Nutrientes', y);

    const chartY = y;
    const barHeight = 10;
    const barSpacing = 14;
    const maxBarWidth = this.pageWidth - 2 * this.margin - 70;

    // Calories (green)
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(51, 51, 51);
    this.doc.text('Calorias', this.margin, chartY + 7);
    this.doc.setFillColor(22, 163, 74);
    const caloriesWidth = Math.min((calories / 400) * maxBarWidth, maxBarWidth);
    this.doc.roundedRect(this.margin + 55, chartY, caloriesWidth, barHeight, 2, 2, 'F');
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(80, 80, 80);
    this.doc.text(`${calories} kcal`, this.margin + 55 + caloriesWidth + 8, chartY + 7);

    // Sugar (orange)
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(51, 51, 51);
    this.doc.text('Açúcar', this.margin, chartY + barSpacing + 7);
    this.doc.setFillColor(249, 115, 22);
    const sugarWidth = Math.min((sugar / 20) * maxBarWidth, maxBarWidth);
    this.doc.roundedRect(this.margin + 55, chartY + barSpacing, sugarWidth, barHeight, 2, 2, 'F');
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(80, 80, 80);
    this.doc.text(`${sugar} g`, this.margin + 55 + sugarWidth + 8, chartY + barSpacing + 7);

    // Sodium (blue)
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(51, 51, 51);
    this.doc.text('Sódio', this.margin, chartY + barSpacing * 2 + 7);
    this.doc.setFillColor(59, 130, 246);
    const sodiumWidth = Math.min((sodium / 600) * maxBarWidth, maxBarWidth);
    this.doc.roundedRect(this.margin + 55, chartY + barSpacing * 2, sodiumWidth, barHeight, 2, 2, 'F');
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(80, 80, 80);
    this.doc.text(`${sodium} mg`, this.margin + 55 + sodiumWidth + 8, chartY + barSpacing * 2 + 7);

    // Fat (purple)
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(51, 51, 51);
    this.doc.text('Gordura', this.margin, chartY + barSpacing * 3 + 7);
    this.doc.setFillColor(147, 51, 234);
    const fatWidth = Math.min((fat / 20) * maxBarWidth, maxBarWidth);
    this.doc.roundedRect(this.margin + 55, chartY + barSpacing * 3, fatWidth, barHeight, 2, 2, 'F');
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(80, 80, 80);
    this.doc.text(`${fat} g`, this.margin + 55 + fatWidth + 8, chartY + barSpacing * 3 + 7);

    y = chartY + barSpacing * 4 + 25;

    // Bloco 3: Resultados Bendula
    y = this.addSectionTitle('Resultados Bendula', y);

    // Score card
    this.doc.setFillColor(245, 245, 245);
    this.doc.roundedRect(this.margin, y - 5, this.pageWidth - 2 * this.margin, 35, 5, 5, 'F');
    
    // Classification badge
    this.doc.setFillColor(classificationColor[0], classificationColor[1], classificationColor[2]);
    this.doc.roundedRect(this.margin + 10, y, 80, 20, 3, 3, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(classification.toUpperCase(), this.margin + 50, y + 13, { align: 'center' });

    // Score
    this.doc.setTextColor(51, 51, 51);
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`${healthScore}/100`, this.pageWidth - this.margin - 30, y + 13, { align: 'center' });
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Score Nutricional', this.pageWidth - this.margin - 30, y + 22, { align: 'center' });

    y += 45;

    // Descriptive summary
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(80, 80, 80);
    const description = isImageAnalysis 
      ? (analysis.notes || 'Análise baseada em inteligência artificial.')
      : `O produto ${productName} foi analisado e classificado como ${classification}. Fabricante: ${supplier}. Validade: ${expiry}.`;
    const splitDescription = this.doc.splitTextToSize(description, this.pageWidth - 2 * this.margin);
    this.doc.text(splitDescription, this.margin, y);
    y += splitDescription.length * 5 + 25;

    // Bloco 4: Seções de Diretrizes
    const alerts = [];
    if (isImageAnalysis) {
      if (analysis.possible_allergens && analysis.possible_allergens.length > 0) {
        alerts.push(`Contém alergénios: ${analysis.possible_allergens.join(', ')}`);
      }
      if (analysis.processing_level === 'ultra processado') {
        alerts.push('Alimento ultra processado');
      }
    } else {
      if (manualData.sugar > 15) alerts.push('Alto teor de açúcar');
      if (manualData.fat > 20) alerts.push('Alto teor de gordura');
      if (manualData.sodium > 600) alerts.push('Alto teor de sódio');
    }

    // Conservação Recomendada
    y = this.addSectionTitle('Conservação Recomendada', y);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(80, 80, 80);
    const conservation = [
      '• Manter em local fresco e seco',
      '• Proteger da luz solar direta',
      '• Consumir antes da data de validade',
      '• Após aberto, conservar em refrigeração se necessário',
    ];
    conservation.forEach((item) => {
      this.doc.text(item, this.margin, y);
      y += 7;
    });
    y += 12;

    // Alertas encontrados
    y = this.addSectionTitle('Alertas Encontrados', y);
    if (alerts.length > 0) {
      this.doc.setTextColor(239, 68, 68);
      alerts.forEach((alert) => {
        const splitAlert = this.doc.splitTextToSize(`✗ ${alert}`, this.pageWidth - 2 * this.margin);
        this.doc.text(splitAlert, this.margin, y);
        y += splitAlert.length * 5 + 6;
      });
    } else {
      this.doc.setTextColor(22, 163, 74);
      this.doc.text('✓ Nenhum alerta crítico identificado.', this.margin, y);
      y += 10;
    }
    y += 12;

    // Benefícios
    y = this.addSectionTitle('Benefícios', y);
    this.doc.setTextColor(22, 163, 74);
    const benefits = isImageAnalysis 
      ? ['Análise realizada com IA de última geração']
      : ['Dados inseridos manualmente pelo utilizador', 'Informações nutricionais detalhadas'];
    benefits.forEach((benefit) => {
      const splitBenefit = this.doc.splitTextToSize(`✓ ${benefit}`, this.pageWidth - 2 * this.margin);
      this.doc.text(splitBenefit, this.margin, y);
      y += splitBenefit.length * 5 + 6;
    });
    y += 12;

    // Recomendações
    y = this.addSectionTitle('Recomendações', y);
    this.doc.setTextColor(80, 80, 80);
    const recommendations = [
      '• Consumo moderado recomendado',
      '• Consulte nutricionista para orientações personalizadas',
      '• Mantenha uma dieta equilibrada e variada',
    ];
    recommendations.forEach((rec) => {
      this.doc.text(rec, this.margin, y);
      y += 7;
    });
    y += 12;

    // Quem pode consumir
    y = this.addSectionTitle('Quem Pode Consumir', y);
    this.doc.setTextColor(22, 163, 74);
    const canConsume = ['Adultos saudáveis', 'Crianças (com moderação)', 'Idosos (com supervisão)'];
    canConsume.forEach((item) => {
      this.doc.text(`✓ ${item}`, this.margin, y);
      y += 7;
    });
    y += 12;

    // Quem deve evitar
    y = this.addSectionTitle('Quem Deve Evitar', y);
    this.doc.setTextColor(239, 68, 68);
    if (alerts.length > 0) {
      const avoidList = ['Pessoas com diabetes', 'Pessoas com hipertensão', 'Pessoas com colesterol alto'];
      avoidList.forEach((item) => {
        this.doc.text(`✗ ${item}`, this.margin, y);
        y += 7;
      });
    } else {
      this.doc.setTextColor(22, 163, 74);
      this.doc.text('✓ Nenhum grupo específico precisa evitar', this.margin, y);
      y += 7;
    }

    y += 12;

    // Ensure we have space before footer on page 2
    y = this.ensurePageBreak(y, 70);

    // Footer for page 2
    this.addFooter(2, 2);

    // Save the PDF
    this.doc.save(`bendula-relatorio-${productName.replace(/\s+/g, '-')}.pdf`);
  }
}

export const generatePDF = async (analysisResult: AnalysisResult): Promise<void> => {
  const pdfService = new PDFService();
  await pdfService.generatePDF(analysisResult);
};
