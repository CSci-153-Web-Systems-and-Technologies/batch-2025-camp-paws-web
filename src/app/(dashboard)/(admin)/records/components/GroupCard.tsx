// Single Responsibility: Display a simplified group card with photo, name, and description
'use client';

import Image from 'next/image';
import { GroupCardProps } from '../types/RecordsTypes';

export default function GroupCard({
  group,
  reports,
  onViewDetails,
}: GroupCardProps) {
  const animalEmoji = group.animalType === 'dog' ? '🐕' : '🐈';

  // Get the first report (or admin-selected) photo
  const primaryReport = reports.length > 0 ? reports[0] : null;
  const primaryPhoto = primaryReport?.photoUrl;

  return (
    <div 
      className="bg-[rgb(var(--color-surface))] rounded-lg shadow-sm border border-[rgb(var(--color-border))] overflow-hidden transition-all hover:shadow-lg hover:border-[rgb(var(--color-primary))] cursor-pointer"
      onClick={() => onViewDetails(group.id)}
    >
      {/* Prominent Photo Header */}
      {primaryPhoto ? (
        <div className="relative w-full h-64 bg-[rgb(var(--color-background))]">
          <Image
            src={primaryPhoto}
            alt={`${group.name}`}
            fill
            className="object-cover"
          />
          {/* Overlay Badge */}
          <div className="absolute top-3 right-3 bg-[rgb(var(--color-primary))] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            {group.reportCount} {group.reportCount === 1 ? 'sighting' : 'sightings'}
          </div>
        </div>
      ) : (
        <div className="relative w-full h-64 bg-linear-to-br from-[rgb(var(--color-background))] to-[rgb(var(--color-surface-hover))] flex items-center justify-center">
          <span className="text-8xl opacity-40">{animalEmoji}</span>
          {/* Overlay Badge */}
          <div className="absolute top-3 right-3 bg-[rgb(var(--color-primary))] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            {group.reportCount} {group.reportCount === 1 ? 'sighting' : 'sightings'}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Group Name */}
        <h3 className="text-xl font-bold text-[rgb(var(--color-text))] mb-2">
          {group.name}
        </h3>

        {/* Description */}
        {group.description ? (
          <p className="text-sm text-[rgb(var(--color-text-secondary))] line-clamp-3">
            {group.description}
          </p>
        ) : (
          <p className="text-sm text-[rgb(var(--color-text-tertiary))] italic">
            No description provided
          </p>
        )}
      </div>
    </div>
  );
}
