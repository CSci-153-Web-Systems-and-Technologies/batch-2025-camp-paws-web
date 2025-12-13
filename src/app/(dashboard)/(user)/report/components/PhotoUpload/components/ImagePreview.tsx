// Single Responsibility Principle: Component focused only on image preview display
import { ImagePreviewProps } from '../types/PhotoUploadTypes';
import Image from 'next/image';

export default function ImagePreview({
  preview,
  fileName,
  fileSize,
  onRemove,
}: ImagePreviewProps) {
  const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-md mx-auto h-64">
        <Image 
          src={preview} 
          alt="Animal preview" 
          fill
          className="object-cover rounded-lg border border-[rgb(var(--color-border))]"
        />
      </div>
      
      <div className="text-sm text-[rgb(var(--color-text-secondary))]">
        <p className="font-medium text-[rgb(var(--color-text-primary))]">{fileName}</p>
        <p>{fileSizeMB} MB</p>
      </div>
      
      <button
        onClick={onRemove}
        className="text-sm text-[rgb(var(--color-error))] hover:opacity-80 transition-opacity"
      >
        Remove photo
      </button>
    </div>
  );
}
