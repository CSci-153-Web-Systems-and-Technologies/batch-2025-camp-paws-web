'use client';

import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import GroupCard from './GroupCard';
import { GroupedViewProps } from '../types/RecordsTypes';

/**
 * View for displaying groups of reports.
 * Shows a grid of GroupCard components with empty state and create button.
 */
export default function GroupedView({
  groups,
  reports,
  onViewGroup,
  onEditGroup,
  onDeleteGroup,
  onCreateGroup,
}: GroupedViewProps) {
  // Empty state
  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-[rgb(var(--color-text))] mb-2">
            No Groups Yet
          </h3>
          <p className="text-[rgb(var(--color-text-muted))] mb-6">
            Groups help organize sightings of the same individual animal. Create your first group to get started.
          </p>
          <Button 
            variant="primary" 
            leftIcon={<Plus />}
            onClick={onCreateGroup}
          >
            Create First Group
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[rgb(var(--color-text))]">
            Grouped Animals
          </h2>
          <p className="text-sm text-[rgb(var(--color-text-muted))]">
            {groups.length} unique {groups.length === 1 ? 'animal' : 'animals'} identified
          </p>
        </div>
        <Button 
          variant="primary" 
          leftIcon={<Plus />}
          onClick={onCreateGroup}
        >
          Create New Group
        </Button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {groups.map((group) => {
          // Get reports for this group
          const groupReports = reports.filter(r => group.reportIds.includes(r.id));
          
          return (
            <GroupCard
              key={group.id}
              group={group}
              reports={groupReports}
              onViewDetails={() => onViewGroup(group.id)}
              onEdit={() => onEditGroup(group.id)}
              onDelete={() => onDeleteGroup(group.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
