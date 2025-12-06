import { FormData } from './PhotoUpload';

interface PhysicalDetailsProps {
  data: FormData;
  onNext: (data: Partial<FormData>) => void;
  onBack: () => void;
}

export default function PhysicalDetails({ data, onNext, onBack }: PhysicalDetailsProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Physical Status</h2>
        <p className="text-gray-600">
          Describe the physical characteristics and condition of the animal.
        </p>
      </div>

      {/* Form will be implemented here */}
      <div className="bg-white rounded-lg border p-8">
        <p className="text-gray-600 text-center py-16">
          Physical Details form will be implemented next...
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Back
        </button>
        <button
          onClick={() => onNext({})}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Next
        </button>
      </div>
    </div>
  );
}