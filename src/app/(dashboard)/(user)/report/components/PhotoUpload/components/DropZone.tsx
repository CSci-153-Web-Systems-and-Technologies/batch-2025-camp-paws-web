// Single Responsibility Principle: Component focused only on drag-and-drop area
import { DropZoneProps } from '../types/PhotoUploadTypes';
import Image from 'next/image';

export default function DropZone({
  dragActive,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
}: DropZoneProps) {
  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`space-y-4 ${dragActive ? 'bg-[rgb(var(--color-primary-light))]' : ''}`}
    >
      <div className="flex justify-center">
        <Image
          src="/mode-landscape.svg"
          alt="Upload photo"
          width={120}
          height={120}
          className="text-[rgb(var(--color-text-tertiary))]"
        />
      </div>
      
      <div>
        <p className="text-lg text-[rgb(var(--color-text-secondary))] mb-2">
          Drag & drop your files here, or click to upload
        </p>
        <p className="text-sm text-[rgb(var(--color-text-tertiary))]">
          (JPG, JPEG, PNG only)
        </p>
      </div>

      <div>
        <input
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          className="hidden"
          id="photo-upload"
        />
        <label
          htmlFor="photo-upload"
          className="inline-block bg-[rgb(var(--color-primary))] text-white px-6 py-2 rounded-lg hover:bg-[rgb(var(--color-primary-hover))] cursor-pointer transition-colors"
        >
          Choose File
        </label>
      </div>
    </div>
  );
}
