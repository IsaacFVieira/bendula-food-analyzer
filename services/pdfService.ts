import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FoodAnalysis, ManualFoodEntry, AnalysisResult } from '@/types';

// Color Palette Constants
const COLOR_PRIMARY = '#1A7A4A';
const COLOR_PRIMARY_DARK = '#0F4F30';
const COLOR_PRIMARY_LIGHT = '#E8F5EE';
const COLOR_ACCENT = '#2ECC71';
const COLOR_WHITE = '#FFFFFF';
const COLOR_TEXT_DARK = '#1C2B22';
const COLOR_TEXT_MUTED = '#5A7A65';
const COLOR_BORDER = '#C8E6D5';
const COLOR_ALERT_BG = '#FFF8E1';
const COLOR_ALERT_TEXT = '#7A5C00';

// Helper function to convert hex to RGB array
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
};

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

  private addHeader(title: string, subtitle: string, isFirstPage: boolean = true) {
    const headerHeight = isFirstPage ? 60 : 22;
    const headerRgb = hexToRgb(COLOR_PRIMARY_DARK);
    const accentRgb = hexToRgb(COLOR_ACCENT);

    // Header background
    this.doc.setFillColor(headerRgb[0], headerRgb[1], headerRgb[2]);
    this.doc.rect(0, 0, this.pageWidth, headerHeight, 'F');

    if (isFirstPage) {
      // Main header (page 1)
      // White text for title
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(21);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(title, this.margin, 22);

      // Accent color for subtitle
      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
      this.doc.text(subtitle, this.margin, 38);
    } else {
      // Repeated header (subsequent pages)
      this.doc.setTextColor(255, 255, 255);
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(title, this.margin, 14);
    }
  }

  private addSectionTitle(title: string, y: number) {
    const primaryRgb = hexToRgb(COLOR_PRIMARY);
    const primaryLightRgb = hexToRgb(COLOR_PRIMARY_LIGHT);

    // Section title in primary color
    this.doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(title, this.margin, y);

    // Horizontal line in primary light color
    this.doc.setDrawColor(primaryLightRgb[0], primaryLightRgb[1], primaryLightRgb[2]);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, y + 3, this.pageWidth - this.margin, y + 3);

    return y + 12;
  }

  private addFooter(pageNum: number, totalPages: number) {
    const footerY = this.pageHeight - 25;
    const borderRgb = hexToRgb(COLOR_BORDER);
    const mutedRgb = hexToRgb(COLOR_TEXT_MUTED);

    // Divider line
    this.doc.setDrawColor(borderRgb[0], borderRgb[1], borderRgb[2]);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, footerY - 8, this.pageWidth - this.margin, footerY - 8);

    // Footer text
    this.doc.setFontSize(7);
    this.doc.setTextColor(mutedRgb[0], mutedRgb[1], mutedRgb[2]);
    this.doc.setFont('helvetica', 'normal');

    // Left: Spaço Uma Gravi contact
    this.doc.text('Spaço Uma Gravi', this.margin, footerY);

    // Center: Email
    this.doc.text('contato@espacoumagravi.com', this.pageWidth / 2, footerY, { align: 'center' });

    // Right: Page number
    this.doc.text(`Relatório Técnico Nutricional — Pág. ${pageNum} de ${totalPages}`, this.pageWidth - this.margin, footerY, { align: 'right' });
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
    const footerMargin = 45; // 45px margin for footer safety
    const footerStart = this.pageHeight - footerMargin;
    return y + requiredSpace > footerStart;
  }

  private ensurePageBreak(y: number, requiredSpace: number = 40, isFirstPage: boolean = false): number {
    if (this.checkPageBreak(y, requiredSpace)) {
      this.doc.addPage();
      this.addHeader('Bendula Food Analyzer', 'Relatório Nutricional Inteligente', isFirstPage);
      return isFirstPage ? 70 : 32; // Reset Y to top of new page based on header height
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

    // Extract nutritional values - use real values if available, otherwise show N/A
    const calories = isImageAnalysis
      ? (analysis.nutritional_info?.calories ?? null)
      : (manualData.calories || null);
    const sugar = isImageAnalysis
      ? (analysis.nutritional_info?.sugar ?? null)
      : (manualData.sugar || null);
    const sodium = isImageAnalysis
      ? (analysis.nutritional_info?.sodium ?? null)
      : (manualData.sodium || null);
    const fat = isImageAnalysis
      ? (analysis.nutritional_info?.fat ?? null)
      : (manualData.fat || null);

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

    // PAGE 1: Dashboard Único - Todas as informações consolidadas
    this.addHeader('Bendula Food Analyzer', 'Relatório Técnico Nutricional', true);

    let y = 70;

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
      y += 6;
    });

    y += 3;

    // Ingredients section
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(51, 51, 51);
    this.doc.text('Ingredientes:', this.margin, y);
    y += 6;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(80, 80, 80);
    const splitIngredients = this.doc.splitTextToSize(ingredients, this.pageWidth - 2 * this.margin);
    this.doc.text(splitIngredients, this.margin, y);
    y += splitIngredients.length * 4 + 10;

    // Highlight note after ingredients
    if ((sugar !== null && sugar > 15) || (sodium !== null && sodium > 600) || (fat !== null && fat > 20)) {
      this.doc.setFillColor(255, 243, 205); // Light yellow background
      this.doc.roundedRect(this.margin, y - 4, this.pageWidth - 2 * this.margin, 16, 3, 3, 'F');
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(180, 83, 9); // Dark orange
      const highlightText = (sugar !== null && sugar > 15)
        ? '⚠ Alto teor de açúcar, consumo deve ser ocasional.'
        : (sodium !== null && sodium > 600)
          ? '⚠ Alto teor de sódio, consumo deve ser moderado.'
          : '⚠ Alto teor de gordura, consumo deve ser moderado.';
      this.doc.text(highlightText, this.margin + 4, y + 6);
      y += 22;
    }

    // Check if we need a page break before nutritional table
    y = this.ensurePageBreak(y, 120);

    // Bloco 2: Informação Nutricional
    y = this.addSectionTitle('Informação Nutricional', y);

    // Add date/time stamp below section title
    const timestamp = new Date(analysisResult.timestamp).toLocaleString('pt-PT');
    this.doc.setFontSize(7);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(128, 128, 128);
    this.doc.text(`Gerado em: ${timestamp}`, this.margin, y);
    y += 6;

    const nutritionalData = [
      ['Nutriente', 'Valor', 'Referência'],
      ['Calorias', calories !== null ? `${calories} kcal` : 'N/A', '< 400 ideal'],
      ['Açúcar', sugar !== null ? `${sugar} g` : 'N/A', '< 10g ideal'],
      ['Sódio', sodium !== null ? `${sodium} mg` : 'N/A', '< 400mg ideal'],
      ['Gordura', fat !== null ? `${fat} g` : 'N/A', '< 15g ideal'],
    ];

    const primaryRgb = hexToRgb(COLOR_PRIMARY);
    const primaryLightRgb = hexToRgb(COLOR_PRIMARY_LIGHT);
    const borderRgb = hexToRgb(COLOR_BORDER);
    const textDarkRgb = hexToRgb(COLOR_TEXT_DARK);

    autoTable(this.doc, {
      startY: y,
      head: [['Nutriente', 'Valor', 'Referência']],
      body: nutritionalData,
      theme: 'grid',
      headStyles: {
        fillColor: primaryRgb,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 10,
        textColor: textDarkRgb,
      },
      alternateRowStyles: {
        fillColor: primaryLightRgb,
      },
      margin: { left: this.margin, right: this.margin },
      styles: {
        cellPadding: { vertical: 3, horizontal: 6 },
        lineColor: borderRgb,
        lineWidth: 0.5,
        fontSize: 9,
      },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'center' },
        2: { halign: 'right' },
      },
      pageBreak: 'avoid',
      rowPageBreak: 'avoid',
    });

    y = this.getSafeFinalY(y);

    // Score Nutricional com destaque visual especial para ULTRAPROCESSADO
    y = this.addSectionTitle('Score Nutricional', y);

    // Score card with visual highlight - especial para ULTRAPROCESSADO
    const accentRgb = hexToRgb(COLOR_ACCENT);
    const primaryDarkRgb = hexToRgb(COLOR_PRIMARY_DARK);

    // Background color based on classification
    if (classification === 'Ultraprocessado') {
      this.doc.setFillColor(254, 226, 226); // Light red background for ultraprocessado
    } else if (classification === 'Saudável') {
      this.doc.setFillColor(236, 253, 245); // Light green background for healthy
    } else {
      this.doc.setFillColor(primaryLightRgb[0], primaryLightRgb[1], primaryLightRgb[2]); // Default light green
    }

    this.doc.roundedRect(this.margin, y - 4, this.pageWidth - 2 * this.margin, 32, 5, 5, 'F');

    // Left accent border (4pt thick) - color based on classification
    if (classification === 'Ultraprocessado') {
      this.doc.setFillColor(239, 68, 68); // Red for ultraprocessado
    } else if (classification === 'Saudável') {
      this.doc.setFillColor(22, 163, 74); // Green for healthy
    } else {
      this.doc.setFillColor(accentRgb[0], accentRgb[1], accentRgb[2]); // Default green
    }

    this.doc.rect(this.margin, y - 4, 4, 32, 'F');

    // Classification - color based on classification
    this.doc.setTextColor(classificationColor[0], classificationColor[1], classificationColor[2]);
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(classification.toUpperCase(), this.margin + 12, y + 6);

    // Score numeric
    this.doc.setTextColor(primaryDarkRgb[0], primaryDarkRgb[1], primaryDarkRgb[2]);
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`${healthScore}/100`, this.margin + 12, y + 20);

    y += 38;

    // Check page break
    y = this.ensurePageBreak(y, 100);

    // Bloco 3: Alertas de Alergénios - Quadro de destaque específico
    y = this.addSectionTitle('Alertas de Alergénios', y);

    const allergens = isImageAnalysis && analysis.possible_allergens ? analysis.possible_allergens : [];

    if (allergens.length > 0) {
      // Create special allergen alert box
      const alertBgRgb = [254, 226, 226]; // Light red background
      const alertTextRgb = [185, 28, 28]; // Dark red text
      const alertBorderRgb = [239, 68, 68]; // Red border

      this.doc.setFillColor(alertBgRgb[0], alertBgRgb[1], alertBgRgb[2]);
      this.doc.roundedRect(this.margin, y - 4, this.pageWidth - 2 * this.margin, 20, 5, 5, 'F');

      // Left red border (6pt thick for emphasis)
      this.doc.setFillColor(alertBorderRgb[0], alertBorderRgb[1], alertBorderRgb[2]);
      this.doc.rect(this.margin, y - 4, 6, 20, 'F');

      // Warning icon
      this.doc.setTextColor(alertTextRgb[0], alertTextRgb[1], alertTextRgb[2]);
      this.doc.setFontSize(12);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('⚠', this.margin + 10, y + 8);

      // Allergen text
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'bold');
      const allergenText = `ALERTA: Contém alergénios - ${allergens.join(', ')}`;
      const splitAllergen = this.doc.splitTextToSize(allergenText, this.pageWidth - 2 * this.margin - 20);
      this.doc.text(splitAllergen, this.margin + 22, y + 8);

      y += 24;
    } else {
      this.doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('✓ Nenhum alergénio identificado.', this.margin, y);
      y += 8;
    }

    y += 8;

    // Check page break
    y = this.ensurePageBreak(y, 100);

    // Bloco 4: Conservação Recomendada - Lista organizada com ícones
    y = this.addSectionTitle('Conservação Recomendada', y);
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(hexToRgb(COLOR_TEXT_DARK)[0], hexToRgb(COLOR_TEXT_DARK)[1], hexToRgb(COLOR_TEXT_DARK)[2]);

    const conservation = [
      { icon: '❄', text: 'Manter em local fresco e seco' },
      { icon: '☀', text: 'Proteger da luz solar direta' },
      { icon: '📅', text: 'Consumir antes da data de validade' },
      { icon: '🧊', text: 'Após aberto, conservar em refrigeração se necessário' },
    ];

    conservation.forEach((item) => {
      this.doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
      this.doc.text(item.icon, this.margin, y);
      this.doc.setTextColor(hexToRgb(COLOR_TEXT_DARK)[0], hexToRgb(COLOR_TEXT_DARK)[1], hexToRgb(COLOR_TEXT_DARK)[2]);
      this.doc.text(item.text, this.margin + 8, y);
      y += 6;
    });

    y += 8;

    // Check page break
    y = this.ensurePageBreak(y, 100);

    // Bloco 5: Alertas Encontrados
    const alerts = [];
    if (isImageAnalysis) {
      if (analysis.processing_level === 'ultra processado') {
        alerts.push('Alimento ultra processado');
      }
    } else {
      if (manualData.sugar > 15) alerts.push('Alto teor de açúcar');
      if (manualData.fat > 20) alerts.push('Alto teor de gordura');
      if (manualData.sodium > 600) alerts.push('Alto teor de sódio');
    }

    if (alerts.length > 0) {
      y = this.addSectionTitle('Alertas Encontrados', y);
      const alertBgRgb = hexToRgb(COLOR_ALERT_BG);
      const alertTextRgb = hexToRgb(COLOR_ALERT_TEXT);
      const amberRgb = [240, 180, 41]; // #F0B429

      alerts.forEach((alert) => {
        const splitAlert = this.doc.splitTextToSize(alert, this.pageWidth - 2 * this.margin - 12);
        const alertHeight = splitAlert.length * 4 + 8;

        this.doc.setFillColor(alertBgRgb[0], alertBgRgb[1], alertBgRgb[2]);
        this.doc.roundedRect(this.margin, y - 2, this.pageWidth - 2 * this.margin, alertHeight, 3, 3, 'F');

        // Left amber border
        this.doc.setFillColor(amberRgb[0], amberRgb[1], amberRgb[2]);
        this.doc.rect(this.margin, y - 2, 3, alertHeight, 'F');

        this.doc.setTextColor(alertTextRgb[0], alertTextRgb[1], alertTextRgb[2]);
        this.doc.setFontSize(8);
        this.doc.setFont('helvetica', 'normal');
        this.doc.text(`! ${splitAlert[0]}`, this.margin + 6, y + 2);
        for (let i = 1; i < splitAlert.length; i++) {
          this.doc.text(splitAlert[i], this.margin + 6, y + 2 + i * 4);
        }
        y += alertHeight + 4;
      });
      y += 8;
    }

    // Check page break
    y = this.ensurePageBreak(y, 70);

    // Footer for page 1
    this.addFooter(1, 1);

    // Save the PDF
    this.doc.save(`bendula-relatorio-${productName.replace(/\s+/g, '-')}.pdf`);
  }
}

export const generatePDF = async (analysisResult: AnalysisResult): Promise<void> => {
  const pdfService = new PDFService();
  await pdfService.generatePDF(analysisResult);
};
