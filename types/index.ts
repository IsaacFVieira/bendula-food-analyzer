// Tipos para análise de alimentos
export interface FoodAnalysis {
  is_food: boolean;
  reason?: string;
  food_type?: 'prato' | 'bebida' | 'snack' | 'ingrediente';
  name_guess?: string;
  ingredients?: string[];
  possible_allergens?: string[];
  processing_level?: 'não processado' | 'pouco processado' | 'processado' | 'ultra processado';
  health_score?: number;
  confidence?: 'baixa' | 'média' | 'alta';
  notes?: string;
  nutritional_info?: {
    calories?: number;
    sugar?: number;
    sodium?: number;
    fat?: number;
    protein?: number;
  };
}

export interface ManualFoodEntry {
  productName: string;
  calories: number;
  sugar: number;
  fat: number;
  protein: number;
  sodium: number;
  expiryDate: string;
  supplier: string;
  notes?: string;
}

export interface AnalysisResult {
  id: string;
  imageUrl?: string;
  analysis: FoodAnalysis | ManualFoodEntry;
  timestamp: number;
  analysisType: 'image' | 'manual';
}

export interface UploadState {
  isDragging: boolean;
  isUploading: boolean;
  preview: string | null;
  error: string | null;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface User {
  email: string;
  name?: string;
}
