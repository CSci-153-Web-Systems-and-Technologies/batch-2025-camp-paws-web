'use client';

import { useState, useMemo, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  AddToGroupModalProps, 
  AnimalGroup
} from '../types/RecordsTypes';

/**
 * Modal for selecting an existing group to add an ungrouped report to.
 * Features search/filter by characteristics, group preview cards, and confirmation.
 */
export default function AddToGroupModal({
  isOpen,
  onClose,
  report,
  groups,
  onSubmit,
}: AddToGroupModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Get animal emoji for display
  const reportEmoji = report.animalType === 'dog' ? '🐕' : '🐈';

  // Get matching characteristics count for a group
  const getMatchScore = useCallback((group: AnimalGroup): number => {
    let matches = 0;
    if (group.sex === report.sex) matches++;
    if (group.primaryColor === report.primaryColor) matches++;
    if (group.colorPattern === report.colorPattern) matches++;
    return matches;
  }, [report.sex, report.primaryColor, report.colorPattern]);

  // Filter groups based on search query and report characteristics
  const filteredGroups = useMemo(() => {
    let filtered = groups;

    // Filter by animal type (must match)
    filtered = filtered.filter((g: AnimalGroup) => g.animalType === report.animalType);

    // Apply search query (search in name, ID, description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((g: AnimalGroup) => 
        g.name.toLowerCase().includes(query) ||
        g.id.toLowerCase().includes(query) ||
        g.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [groups, report.animalType, searchQuery]);

  // Sort groups by match score (highest first)
  const sortedGroups = useMemo(() => {
    return [...filteredGroups].sort((a, b) => getMatchScore(b) - getMatchScore(a));
  }, [filteredGroups, getMatchScore]);

  const handleSubmit = () => {
    if (!selectedGroupId) return;
    onSubmit(selectedGroupId, report.id);
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedGroupId(null);
    onClose();
  };

  // Get sex emoji
  const getSexEmoji = (sex: string) => {
    if (sex === 'male') return '♂️';
    if (sex === 'female') return '♀️';
    return '❓';
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Add Report to Group"
      size="lg"
    >
      <div className="space-y-4">
        {/* Report Info Banner */}
        <div className="bg-[rgb(var(--color-primary)/0.1)] rounded-lg p-3 border border-[rgb(var(--color-primary)/0.3)]">
          <div className="flex items-center gap-3">
            {report.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={report.photoUrl} 
                alt="Report" 
                className="w-12 h-12 rounded object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded bg-[rgb(var(--color-muted))] flex items-center justify-center text-2xl">
                {reportEmoji}
              </div>
            )}
            <div className="flex-1">
              <div className="font-medium text-[rgb(var(--color-text))]">
                Report #{report.id}
              </div>
              <div className="text-sm text-[rgb(var(--color-text-muted))]">
                {reportEmoji} {report.animalType} • {getSexEmoji(report.sex)} {report.sex} • {report.primaryColor} {report.colorPattern}
              </div>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--color-text-muted))]" />
          <Input
            type="text"
            placeholder="Search groups by name, ID, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Info */}
        <div className="text-sm text-[rgb(var(--color-text-muted))]">
          Showing {sortedGroups.length} {report.animalType} group{sortedGroups.length !== 1 ? 's' : ''}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>

        {/* Groups List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {sortedGroups.length === 0 ? (
            <div className="text-center py-8 text-[rgb(var(--color-text-muted))]">
              {groups.filter((g: AnimalGroup) => g.animalType === report.animalType).length === 0 ? (
                <>
                  <p className="mb-2">No {report.animalType} groups available</p>
                  <p className="text-sm">Create a new group for this report instead</p>
                </>
              ) : (
                <>
                  <p className="mb-2">No groups match your search</p>
                  <p className="text-sm">Try a different search term</p>
                </>
              )}
            </div>
          ) : (
            sortedGroups.map((group) => {
              const matchScore = getMatchScore(group);
              const isSelected = selectedGroupId === group.id;
              const groupEmoji = group.animalType === 'dog' ? '🐕' : '🐈';

              return (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroupId(group.id)}
                  className={`
                    w-full text-left p-4 rounded-lg border-2 transition-all
                    ${isSelected 
                      ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary)/0.1)]' 
                      : 'border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary)/0.5)]'
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      {/* Group Header */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{groupEmoji}</span>
                        <div className="font-medium text-[rgb(var(--color-text))]">
                          {group.name}
                        </div>
                        <span className="text-xs text-[rgb(var(--color-text-muted))]">
                          #{group.id}
                        </span>
                      </div>

                      {/* Characteristics */}
                      <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                        <div>
                          <span className="text-[rgb(var(--color-text-muted))]">Sex: </span>
                          <span className={group.sex === report.sex ? 'text-[rgb(var(--color-success))]' : ''}>
                            {getSexEmoji(group.sex)} {group.sex}
                          </span>
                        </div>
                        <div>
                          <span className="text-[rgb(var(--color-text-muted))]">Color: </span>
                          <span className={group.primaryColor === report.primaryColor ? 'text-[rgb(var(--color-success))]' : ''}>
                            {group.primaryColor}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[rgb(var(--color-text-muted))]">Pattern: </span>
                          <span className={group.colorPattern === report.colorPattern ? 'text-[rgb(var(--color-success))]' : ''}>
                            {group.colorPattern}
                          </span>
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      {matchScore > 0 && (
                        <div className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-[rgb(var(--color-success)/0.2)] text-[rgb(var(--color-success))]">
                          ✓ {matchScore} matching characteristic{matchScore !== 1 ? 's' : ''}
                        </div>
                      )}

                      {/* Sightings Count */}
                      <div className="mt-2 text-xs text-[rgb(var(--color-text-muted))]">
                        {group.reportIds.length} sighting{group.reportIds.length !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[rgb(var(--color-primary))] flex items-center justify-center text-white text-sm shrink-0">
                        ✓
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-[rgb(var(--color-border))]">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!selectedGroupId}
          >
            Add to Selected Group
          </Button>
        </div>
      </div>
    </Modal>
  );
}
