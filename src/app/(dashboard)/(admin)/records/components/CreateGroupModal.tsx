// Single Responsibility: Modal for creating a new animal group
'use client';

import { useState, useMemo } from 'react';
import { CreateGroupModalProps, CreateGroupInput, AnimalType, Sex } from '../types/RecordsTypes';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';

export default function CreateGroupModal({
  isOpen,
  onClose,
  onSubmit,
  initialReport,
  mode,
}: CreateGroupModalProps) {
  // Generate initial values based on mode and report
  const initialValues = useMemo(() => {
    if (mode === 'from-report' && initialReport) {
      return {
        name: `${initialReport.primaryColor} ${initialReport.sex} ${initialReport.animalType}`.trim(),
        description: initialReport.notes || '',
        animalType: initialReport.animalType,
        sex: initialReport.sex,
        colorPattern: initialReport.colorPattern,
        primaryColor: initialReport.primaryColor,
        initialReportId: initialReport.id,
      };
    }
    return {
      name: '',
      description: '',
      animalType: 'dog' as AnimalType,
      sex: 'unknown' as Sex,
      colorPattern: '',
      primaryColor: '',
    };
  }, [mode, initialReport]);

  const [formData, setFormData] = useState<CreateGroupInput>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateGroupInput, string>>>({});

  const handleChange = (field: keyof CreateGroupInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateGroupInput, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required';
    }
    if (!formData.primaryColor.trim()) {
      newErrors.primaryColor = 'Primary color is required';
    }
    if (!formData.colorPattern.trim()) {
      newErrors.colorPattern = 'Color pattern is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
      onClose();
    }
  };

  const animalTypeOptions = [
    { value: 'dog', label: '🐕 Dog' },
    { value: 'cat', label: '🐈 Cat' },
  ];

  const sexOptions = [
    { value: 'male', label: '♂️ Male' },
    { value: 'female', label: '♀️ Female' },
    { value: 'unknown', label: '❓ Unknown' },
  ];

  const colorPatternOptions = [
    { value: 'solid', label: 'Solid' },
    { value: 'spotted', label: 'Spotted' },
    { value: 'striped', label: 'Striped' },
    { value: 'patched', label: 'Patched' },
    { value: 'brindle', label: 'Brindle' },
    { value: 'merle', label: 'Merle' },
  ];

  const primaryColorOptions = [
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
    { value: 'brown', label: 'Brown' },
    { value: 'gray', label: 'Gray' },
    { value: 'tan', label: 'Tan' },
    { value: 'golden', label: 'Golden' },
    { value: 'cream', label: 'Cream' },
    { value: 'red', label: 'Red' },
    { value: 'orange', label: 'Orange' },
  ];

  // Generate unique key to force remount when mode or report changes
  const modalKey = `${mode}-${initialReport?.id || 'manual'}`;

  return (
    <Modal key={modalKey} isOpen={isOpen} onClose={onClose} title="Create New Group" size="lg">
      <div className="space-y-4">
        {/* Mode indicator */}
        <div className="p-3 bg-[rgb(var(--color-primary-light))] border border-[rgb(var(--color-primary))] rounded-lg">
          <p className="text-sm text-[rgb(var(--color-text-secondary))]">
            {mode === 'from-report' ? (
              <>
                <span className="font-semibold text-[rgb(var(--color-primary))]">Auto-fill Mode:</span>{' '}
                Creating group from report data. You can modify any field below.
              </>
            ) : (
              <>
                <span className="font-semibold text-[rgb(var(--color-primary))]">Manual Mode:</span>{' '}
                Enter the characteristics of the unique animal.
              </>
            )}
          </p>
        </div>

        {/* Group Name */}
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
            Group Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Brown Male Dog - Campus Center"
            error={errors.name}
          />
          <p className="text-xs text-[rgb(var(--color-text-tertiary))] mt-1">
            A descriptive name to identify this unique animal
          </p>
        </div>

        {/* Animal Type */}
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
            Animal Type <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.animalType}
            onChange={(e) => handleChange('animalType', e.target.value as AnimalType)}
            options={animalTypeOptions}
          />
        </div>

        {/* Sex */}
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
            Sex
          </label>
          <Select
            value={formData.sex}
            onChange={(e) => handleChange('sex', e.target.value as Sex)}
            options={sexOptions}
          />
        </div>

        {/* Primary Color */}
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
            Primary Color <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.primaryColor}
            onChange={(e) => handleChange('primaryColor', e.target.value)}
            options={primaryColorOptions}
            error={errors.primaryColor}
          />
        </div>

        {/* Color Pattern */}
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
            Color Pattern <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.colorPattern}
            onChange={(e) => handleChange('colorPattern', e.target.value)}
            options={colorPatternOptions}
            error={errors.colorPattern}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[rgb(var(--color-text-primary))] mb-1">
            Description (Optional)
          </label>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Add any additional details about this animal..."
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-[rgb(var(--color-border))]">
          <Button variant="secondary" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} fullWidth>
            Create Group
          </Button>
        </div>
      </div>
    </Modal>
  );
}
