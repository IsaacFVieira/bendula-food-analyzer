'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UploadState } from '@/types';
import { compressImage, isValidImageFile, isValidFileSize, getImageInfo } from '@/lib/imageUtils';

interface ImageUploadProps {
  onImageSelect: (base64: string, file: File) => void;
  state: UploadState;
  onClear: () => void;
}

export function ImageUpload({ onImageSelect, state, onClear }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    []
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    []
  );

  const processFile = async (file: File) => {
    // Validações
    if (!isValidImageFile(file)) {
      onImageSelect('', file);
      onClear();
      return;
    }

    if (!isValidFileSize(file, 10)) {
      onImageSelect('', file);
      onClear();
      return;
    }

    try {
      // Comprime a imagem antes de enviar
      const compressionResult = await compressImage(file);
      console.log('[ImageUpload] Imagem comprimida com sucesso');
      console.log('[ImageUpload] Redução de tamanho:', compressionResult.reductionPercentage, '%');
      onImageSelect(compressionResult.compressedBase64, file);
    } catch (error) {
      console.error('[ImageUpload] Erro ao comprimir imagem:', error);
      onImageSelect('', file);
      onClear();
    }
  };

  return (
    <div className="w-full">
      {state.preview ? (
        <div className="relative group">
          <img
            src={state.preview}
            alt="Preview"
            className="w-full h-64 object-contain rounded-xl border-2 border-border bg-card"
          />
          <button
            onClick={onClear}
            className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer',
            isDragging || state.isDragging
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/50 hover:bg-accent/50'
          )}
        >
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
            disabled={state.isUploading}
          />
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center gap-4 cursor-pointer"
          >
            <div className="p-4 rounded-full bg-primary/10">
              {state.isUploading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Upload className="h-8 w-8 text-primary" />
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {state.isUploading ? 'Processando...' : 'Arraste e solte sua imagem'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                ou clique para selecionar
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              PNG, JPG ou JPEG (máx. 10MB)
            </p>
          </label>
        </div>
      )}
      {state.error && (
        <p className="text-sm text-destructive mt-2">{state.error}</p>
      )}
    </div>
  );
}
