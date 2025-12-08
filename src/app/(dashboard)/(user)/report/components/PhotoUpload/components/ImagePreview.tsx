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
          className="object-cover rounded-lg border"
        />
      </div>
      
      <div className="text-sm text-gray-600">
        <p className="font-medium">{fileName}</p>
        <p>{fileSizeMB} MB</p>
      </div>
      
      <button
        onClick={onRemove}
        className="text-sm text-red-600 hover:text-red-800 transition-colors"
      >
        Remove photo
      </button>
    </div>
  );
}
