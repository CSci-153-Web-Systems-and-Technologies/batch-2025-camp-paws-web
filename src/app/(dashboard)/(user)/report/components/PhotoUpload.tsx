'use client';
import { useState, useCallback } from 'react';
import Image from 'next/image';

export interface FormData {
  photo: File | null;
  animalType: string;
  sex: string;
  collar: string;
  color: string;
  bodyConditionScore: number | null;
  physicalProblems: string[];
  notes: string;
  location: { lat: number; lng: number } | null;
  date: string;
  time: string;
}

interface PhotoUploadProps {
  data: FormData;
  onNext: (photo: File) => void;
}

export default function PhotoUpload({ data, onNext }: PhotoUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(data.photo);
  const [preview, setPreview] = useState<string | null>(null);

  // Create preview URL when file is selected
  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  }, []);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Handle next button
  const handleNext = () => {
    if (selectedFile) {
      onNext(selectedFile);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Animal Photo</h2>
        <p className="text-gray-600">
          Report a stray animal by uploading a photo and marking its location.
        </p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-green-400 transition-colors">
        {preview ? (
          // Preview of selected image
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
              <p className="font-medium">{selectedFile?.name}</p>
              <p>{selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) : 0} MB</p>
            </div>
            <button
              onClick={() => {
                setSelectedFile(null);
                setPreview(null);
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove photo
            </button>
          </div>
        ) : (
          // Upload interface
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`space-y-4 ${dragActive ? 'bg-green-50' : ''}`}
          >
            <div className="flex justify-center">
              <Image
                src="/mode-landscape.svg"
                alt="Upload photo"
                width={120}
                height={120}
                className="text-gray-400"
              />
            </div>
            
            <div>
              <p className="text-lg text-gray-600 mb-2">
                Drag & drop your files here, or click to upload
              </p>
              <p className="text-sm text-gray-500">
                (maximum of 3 JPG, JPEG, PNG only)
              </p>
            </div>

            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
              >
                Choose File
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Next Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleNext}
          disabled={!selectedFile}
          className={`px-6 py-2 rounded-lg font-medium ${
            selectedFile
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}