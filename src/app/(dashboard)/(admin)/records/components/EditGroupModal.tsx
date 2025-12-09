// Single Responsibility: Modal for editing an existing animal group
'use client';

import { useState, useMemo } from 'react';
import { EditGroupModalProps, EditGroupInput, AnimalType, Sex } from '../types/RecordsTypes';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';

export default function EditGroupModal({
  isOpen,
  onClose,
  onSubmit,
  group,
}: EditGroupModalProps) {
  // Initialize form data from group
  const initialValues = useMemo(() => ({
    name: group.name,
    description: group.description || '',
    animalType: group.animalType,
    sex: group.sex,
    colorPattern: group.colorPattern,
    primaryColor: group.primaryColor,
  }), [group]);

  const [formData, setFormData] = useState<Required<EditGroupInput>>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof EditGroupInput, string>>>({});

  const handleChange = (field: keyof EditGroupInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EditGroupInput, string>> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Group name is required';
    }
    if (!formData.primaryColor?.trim()) {
      newErrors.primaryColor = 'Primary color is required';
    }
    if (!formData.colorPattern?.trim()) {
      newErrors.colorPattern = 'Color pattern is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Only send changed fields
      const changes: EditGroupInput = {};
      if (formData.name !== group.name) changes.name = formData.name;
      if (formData.description !== group.description) changes.description = formData.description;
      if (formData.animalType !== group.animalType) changes.animalType = formData.animalType;
      if (formData.sex !== group.sex) changes.sex = formData.sex;
      if (formData.colorPattern !== group.colorPattern) changes.colorPattern = formData.colorPattern;
      if (formData.primaryColor !== group.primaryColor) changes.primaryColor = formData.primaryColor;

      onSubmit(group.id, changes);
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

  // Generate unique key to force remount when group changes
  const modalKey = `edit-${group.id}`;

  return (
    <Modal key={modalKey} isOpen={isOpen} onClose={onClose} title="Edit Group" size="lg">
      <div className="space-y-4">
        {/* Group Info Banner */}
        <div className="p-3 bg-[rgb(var(--color-background))] border border-[rgb(var(--color-border))] rounded-lg">
          <div className="text-sm text-[rgb(var(--color-text-secondary))]">
            <span className="font-semibold text-[rgb(var(--color-text-primary))]">Editing Group:</span> {group.name}
          </div>
          <div className="text-xs text-[rgb(var(--color-text-tertiary))] mt-1">
            {group.reportCount} {group.reportCount === 1 ? 'report' : 'reports'} • Created by {group.createdBy}
          </div>
        </div>

        {/* Warning about reports */}
        {group.reportCount > 0 && (
          <div className="p-3 bg-[rgb(var(--color-warning-bg))] border border-[rgb(var(--color-warning))] rounded-lg">
            <p className="text-sm text-[rgb(var(--color-warning))]">
              ⚠️ <span className="font-semibold">Note:</span> Changing characteristics may affect how this group represents its {group.reportCount} sighting{group.reportCount !== 1 ? 's' : ''}. Reports with different characteristics can still belong to this group.
            </p>
          </div>
        )}

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
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
