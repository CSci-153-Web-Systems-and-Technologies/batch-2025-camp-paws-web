// Refactored PhotoUpload component applying SOLID principles
'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { PhotoUploadProps, PhotoUploadState } from './types/PhotoUploadTypes';
import { PhotoFileValidator } from './validation/PhotoFileValidator';
import { ImagePreviewGenerator } from './utils/ImagePreviewGenerator';
import DropZone from './components/DropZone';
import ImagePreview from './components/ImagePreview';
import UploadFeedback from './feedback/UploadFeedback';
import Button from '@/components/ui/Button';

// Open/Closed Principle: This component is open for extension (new upload features)
// but closed for modification (core logic doesn't change)
export default function PhotoUploadRefactored({ data, onNext }: PhotoUploadProps) {
  // Single Responsibility: State management only
  const [uploadState, setUploadState] = useState<PhotoUploadState>({
    selectedFile: data.photo,
    preview: null,
    dragActive: false,
    error: null,
  });

  // Dependency Inversion: Depend on abstractions, not concretions
  // Using useMemo to prevent recreation on every render
  const validator = useMemo(() => new PhotoFileValidator(), []);
  const previewGenerator = useMemo(() => new ImagePreviewGenerator(), []);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (uploadState.preview) {
        previewGenerator.revoke(uploadState.preview);
      }
    };
  }, [uploadState.preview, previewGenerator]);

  // Single Responsibility: Handle file selection and validation
  const handleFileSelect = useCallback((file: File) => {
    // Validate file
    const validationResult = validator.validate(file);
    
    if (!validationResult.isValid) {
      setUploadState(prev => ({
        ...prev,
        error: validationResult.error,
        selectedFile: null,
        preview: null,
      }));
      return;
    }

    // Generate preview
    const previewUrl = previewGenerator.generate(file);
    
    setUploadState(prev => {
      // Revoke old preview URL if exists
      if (prev.preview) {
        previewGenerator.revoke(prev.preview);
      }
      
      return {
        selectedFile: file,
        preview: previewUrl,
        dragActive: false,
        error: null,
      };
    });
  }, [validator, previewGenerator]);

  // Single Responsibility: Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setUploadState(prev => ({ ...prev, dragActive: true }));
    } else if (e.type === "dragleave") {
      setUploadState(prev => ({ ...prev, dragActive: false }));
    }
  }, []);

  // Single Responsibility: Handle drop event
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState(prev => ({ ...prev, dragActive: false }));
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  // Single Responsibility: Handle file input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  }, [handleFileSelect]);

  // Single Responsibility: Handle photo removal
  const handleRemove = useCallback(() => {
    if (uploadState.preview) {
      previewGenerator.revoke(uploadState.preview);
    }
    
    setUploadState({
      selectedFile: null,
      preview: null,
      dragActive: false,
      error: null,
    });
  }, [uploadState.preview, previewGenerator]);

  // Single Responsibility: Handle form submission
  const handleNext = useCallback(() => {
    if (uploadState.selectedFile) {
      onNext(uploadState.selectedFile);
    }
  }, [uploadState.selectedFile, onNext]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-2">Upload Animal Photo</h2>
        <p className="text-[rgb(var(--color-text-secondary))]">
          Report a stray animal by uploading a photo and marking its location.
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-[rgb(var(--color-surface))] rounded-lg border-2 border-dashed border-[rgb(var(--color-border))] p-8 text-center hover:border-[rgb(var(--color-primary))] transition-colors">
        {uploadState.preview ? (
          // Liskov Substitution: ImagePreview component follows consistent interface
          <ImagePreview
            preview={uploadState.preview}
            fileName={uploadState.selectedFile?.name || ''}
            fileSize={uploadState.selectedFile?.size || 0}
            onRemove={handleRemove}
          />
        ) : (
          // Liskov Substitution: DropZone component follows consistent interface
          <DropZone
            dragActive={uploadState.dragActive}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onFileSelect={handleInputChange}
          />
        )}
      </div>

      {/* Validation Feedback */}
      <UploadFeedback
        error={uploadState.error}
        selectedFile={uploadState.selectedFile}
      />

      {/* Navigation Buttons */}
      <div className="flex justify-end mt-8">
        <Button
          onClick={handleNext}
          disabled={!uploadState.selectedFile}
          variant="primary"
          size="lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
