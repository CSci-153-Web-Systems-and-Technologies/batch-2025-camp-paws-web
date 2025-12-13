'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
// Views
import { ViewSelector, GroupedView, UngroupedView, AllView } from './views';
// Modals
import {
  CreateGroupModal,
  EditGroupModal,
  GroupDetailsModal,
  AddToGroupModal,
  DeleteConfirmation,
  DeleteGroupConfirmation,
} from './modals';
import ReportDetailsModal from '@/components/ui/ReportDetailsModal';
import { normalizeRows } from '@/lib/transformers/records';
import { 
  ViewType, 
  AcceptedReport, 
  AnimalGroup,
  CreateGroupInput,
  EditGroupInput
} from '../types/RecordsTypes';

type CreateGroupMode = 'manual' | 'from-report';

/**
 * Main orchestrator component for the Records management system.
 * Manages view state, modal state, data fetching, and coordinates all child components.
 */
export default function RecordsRefactored() {
  // View state
  const [currentView, setCurrentView] = useState<ViewType>('grouped');
  
  // Data state
  const [reports, setReports] = useState<AcceptedReport[]>([]);
  const [groups, setGroups] = useState<AnimalGroup[]>([]);
  // Track server-provided is_grouped flags so we can accurately compute ungrouped reports
  const [ungroupedIds, setUngroupedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [createGroupModal, setCreateGroupModal] = useState<{
    isOpen: boolean;
    mode: CreateGroupMode;
    report?: AcceptedReport;
  }>({
    isOpen: false,
    mode: 'manual'
  });

  // When creating a group from multiple selected reports, store pending selection here
  const [pendingGroupSelection, setPendingGroupSelection] = useState<string[] | null>(null);

  const [editGroupModal, setEditGroupModal] = useState<{
    isOpen: boolean;
    group?: AnimalGroup;
  }>({
    isOpen: false
  });

  const [groupDetailsModal, setGroupDetailsModal] = useState<{
    isOpen: boolean;
    group?: AnimalGroup;
  }>({
    isOpen: false
  });

  const [addToGroupModal, setAddToGroupModal] = useState<{
    isOpen: boolean;
    report?: AcceptedReport;
  }>({
    isOpen: false
  });

  // Delete confirmation state
  const [deleteGroupModal, setDeleteGroupModal] = useState<{
    isOpen: boolean;
    group?: AnimalGroup;
  }>({
    isOpen: false
  });

  const [deleteReportModal, setDeleteReportModal] = useState<{
    isOpen: boolean;
    report?: AcceptedReport;
  }>({
    isOpen: false
  });

  const [removeReportModal, setRemoveReportModal] = useState<{
    isOpen: boolean;
    report?: AcceptedReport;
  }>({
    isOpen: false
  });

  const [reportDetailsModal, setReportDetailsModal] = useState<{
    isOpen: boolean;
    report?: AcceptedReport;
  }>({
    isOpen: false
  });

  // Selected items for bulk operations
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Call the server-side records endpoint to fetch verified reports and groups
      const [reportsRes, groupsRes] = await Promise.all([
        fetch('/api/admin/records').then(r => r.json()),
        fetch('/api/groups').then(r => r.json()).catch(() => ({ data: [] }))
      ]);

      if (reportsRes?.error) {
        throw new Error(reportsRes.error);
      }

  const rows = (reportsRes?.data ?? []) as Array<Record<string, unknown>>;

      // Normalize server rows to AcceptedReport using shared utility
      const mappedReports: AcceptedReport[] = normalizeRows(rows as Array<Record<string, unknown>>);

      // Compute which rows are flagged as grouped/ungrouped by the server using the normalized shape
      const ungroupedSet = new Set<string>(mappedReports.filter(r => !r.isGrouped).map(r => r.id));

      setReports(mappedReports);
      setUngroupedIds(ungroupedSet);
      setGroups(groupsRes?.data ?? []);
    } catch (err) {
      setError('Failed to load data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Group actions
  const handleCreateGroup = async (input: CreateGroupInput) => {
    try {
      // Build payload: include pending selection (reportIds) if present
      const selectedIds = pendingGroupSelection ?? (input.initialReportId ? [input.initialReportId] : []);
      const payload = { ...input, reportIds: selectedIds } as Record<string, unknown>;

      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json?.error) throw new Error(json.error);

  const g = (json?.data ?? {}) as Record<string, unknown>;

      // Convert server result into local AnimalGroup shape
      const createdGroup: AnimalGroup = {
        id: String(g.group_id),
        name: String(g.group_name ?? input.name),
        description: String(g.group_description ?? input.description ?? ''),
        animalType: input.animalType,
  sex: (input.sex as unknown as AcceptedReport['sex']) ?? 'unknown',
        primaryColor: input.primaryColor ?? '',
        colorPattern: input.colorPattern ?? '',
        reportCount: Number(g.report_count ?? (selectedIds.length)),
        firstSightedDate: String(g.first_sighted_date ?? new Date().toISOString().split('T')[0]),
        lastSightedDate: String(g.last_sighted_date ?? new Date().toISOString().split('T')[0]),
        createdAt: String(g.group_created_at ?? new Date().toISOString()),
        createdBy: String(g.group_created_by ?? 'current-admin'),
        updatedAt: String(g.group_updated_at ?? new Date().toISOString()),
        reportIds: Array.isArray(g.report_ids) ? g.report_ids.map(String) : selectedIds,
      };

      // Update client state
      setGroups(prev => [...prev, createdGroup]);
      if (createdGroup.reportIds.length > 0) {
        setReports(prev => prev.map(r => createdGroup.reportIds.includes(r.id) ? { ...r, groupId: createdGroup.id, isGrouped: true } : r));
      }

      // Clear pending selection after creation
      setPendingGroupSelection(null);

      console.log('Group created successfully (server):', createdGroup);
    } catch (err) {
      console.error('Error creating group:', err);
      alert('Failed to create group. Please try again.');
    }
  };

  const handleEditGroup = async (groupId: string, changes: EditGroupInput) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/groups/${groupId}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify(changes)
      // });

      setGroups(prev => prev.map(g => 
        g.id === groupId 
          ? { 
              ...g, 
              ...changes,
              updatedAt: new Date().toISOString()
            } 
          : g
      ));

      console.log('Group updated successfully:', groupId, changes);
    } catch (err) {
      console.error('Error updating group:', err);
      alert('Failed to update group. Please try again.');
    }
  };

  const handleDeleteGroup = async (groupId: string, deleteReports: boolean = false) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/groups/${groupId}?deleteReports=${deleteReports}`, {
      //   method: 'DELETE'
      // });

      setGroups(prev => prev.filter(g => g.id !== groupId));

      if (deleteReports) {
        // Delete all reports in the group
        setReports(prev => prev.filter(r => r.groupId !== groupId));
      } else {
        // Ungroup the reports
        setReports(prev => prev.map(r => 
          r.groupId === groupId ? { ...r, groupId: null } : r
        ));
      }

      console.log('Group deleted:', groupId, 'deleteReports:', deleteReports);
    } catch (err) {
      console.error('Error deleting group:', err);
      alert('Failed to delete group. Please try again.');
    }
  };

  // Report actions
  const handleAddToGroup = async (groupId: string, reportId: string) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/groups/${groupId}/reports/${reportId}`, {
      //   method: 'POST'
      // });

      const report = reports.find(r => r.id === reportId);
      if (!report) return;

      // Update report's groupId
      setReports(prev => prev.map(r => 
        r.id === reportId ? { ...r, groupId } : r
      ));

      // Update group's reportIds and dates
      setGroups(prev => prev.map(g => {
        if (g.id !== groupId) return g;

        const updatedReportIds = [...g.reportIds, reportId];
        const groupReports = reports.filter(r => updatedReportIds.includes(r.id));
        const dates = groupReports.map(r => new Date(r.spottedDate).getTime());

        return {
          ...g,
          reportIds: updatedReportIds,
          reportCount: updatedReportIds.length,
          firstSightedDate: new Date(Math.min(...dates)).toISOString().split('T')[0],
          lastSightedDate: new Date(Math.max(...dates)).toISOString().split('T')[0],
          updatedAt: new Date().toISOString()
        };
      }));

      console.log('Report added to group:', reportId, '→', groupId);
    } catch (err) {
      console.error('Error adding report to group:', err);
      alert('Failed to add report to group. Please try again.');
    }
  };

  const handleRemoveFromGroup = async (reportId: string) => {
    try {
      const report = reports.find(r => r.id === reportId);
      if (!report || !report.groupId) return;

      const groupId = report.groupId;

      // TODO: Replace with actual API call
      // await fetch(`/api/groups/${groupId}/reports/${reportId}`, {
      //   method: 'DELETE'
      // });

      // Update report to remove groupId
      setReports(prev => prev.map(r => 
        r.id === reportId ? { ...r, groupId: null } : r
      ));

      // Update group's reportIds and dates
      setGroups(prev => prev.map(g => {
        if (g.id !== groupId) return g;

        const updatedReportIds = g.reportIds.filter(id => id !== reportId);
        if (updatedReportIds.length === 0) {
          // If no reports left, group should probably be deleted or handled
          return g;
        }

        const groupReports = reports.filter(r => updatedReportIds.includes(r.id));
        const dates = groupReports.map(r => new Date(r.spottedDate).getTime());

        return {
          ...g,
          reportIds: updatedReportIds,
          reportCount: updatedReportIds.length,
          firstSightedDate: new Date(Math.min(...dates)).toISOString().split('T')[0],
          lastSightedDate: new Date(Math.max(...dates)).toISOString().split('T')[0],
          updatedAt: new Date().toISOString()
        };
      }));

      console.log('Report removed from group:', reportId);
    } catch (err) {
      console.error('Error removing report from group:', err);
      alert('Failed to remove report from group. Please try again.');
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      const report = reports.find(r => r.id === reportId);
      if (!report) return;

      // TODO: Replace with actual API call
      // await fetch(`/api/reports/${reportId}`, {
      //   method: 'DELETE'
      // });

      // If report is in a group, update the group
      if (report.groupId) {
        setGroups(prev => prev.map(g => {
          if (g.id !== report.groupId) return g;

          const updatedReportIds = g.reportIds.filter(id => id !== reportId);
          if (updatedReportIds.length === 0) {
            return g; // Handle empty group
          }

          const groupReports = reports.filter(r => updatedReportIds.includes(r.id));
          const dates = groupReports.map(r => new Date(r.spottedDate).getTime());

          return {
            ...g,
            reportIds: updatedReportIds,
            reportCount: updatedReportIds.length,
            firstSightedDate: new Date(Math.min(...dates)).toISOString().split('T')[0],
            lastSightedDate: new Date(Math.max(...dates)).toISOString().split('T')[0],
            updatedAt: new Date().toISOString()
          };
        }));
      }

      // Delete the report
      setReports(prev => prev.filter(r => r.id !== reportId));

      console.log('Report deleted:', reportId);
    } catch (err) {
      console.error('Error deleting report:', err);
      alert('Failed to delete report. Please try again.');
    }
  };

  const handleViewReportDetails = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setReportDetailsModal({ isOpen: true, report });
    }
  };

  const closeReportDetailsModal = () => {
    setReportDetailsModal({ isOpen: false });
  };

  // Bulk operations
  const handleBulkGroup = async (reportIds: string[]) => {
    // Open the CreateGroup modal in manual mode and remember the selected IDs.
    setPendingGroupSelection(reportIds);
    openCreateGroupModal('manual');
  };

  // Modal handlers
  const openCreateGroupModal = (mode: CreateGroupMode, report?: AcceptedReport) => {
    setCreateGroupModal({ isOpen: true, mode, report });
  };

  const closeCreateGroupModal = () => {
    setCreateGroupModal({ isOpen: false, mode: 'manual' });
  };

  const openEditGroupModal = (group: AnimalGroup) => {
    setEditGroupModal({ isOpen: true, group });
  };

  const closeEditGroupModal = () => {
    setEditGroupModal({ isOpen: false });
  };

  const openGroupDetailsModal = (group: AnimalGroup) => {
    setGroupDetailsModal({ isOpen: true, group });
  };

  const closeGroupDetailsModal = () => {
    setGroupDetailsModal({ isOpen: false });
  };

  const openAddToGroupModal = (report: AcceptedReport) => {
    setAddToGroupModal({ isOpen: true, report });
  };

  const closeAddToGroupModal = () => {
    setAddToGroupModal({ isOpen: false });
  };

  // Get counts for each view
  // Determine ungrouped reports based on server's is_grouped flag when available,
  // otherwise fall back to groupId === null
  const ungroupedReports = (ungroupedIds && ungroupedIds.size > 0)
    ? reports.filter(r => ungroupedIds.has(r.id))
    : reports.filter(r => r.groupId === null);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[rgb(var(--color-primary))] mx-auto mb-4" />
          <p className="text-[rgb(var(--color-text-muted))]">Loading records...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-[rgb(var(--color-error))] mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="px-4 py-2 bg-[rgb(var(--color-primary))] text-white rounded-lg hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Selector */}
      <ViewSelector
        currentView={currentView}
        onViewChange={setCurrentView}
        counts={{
          grouped: groups.length,
          ungrouped: ungroupedReports.length,
          all: reports.length
        }}
      />

      {/* Current View */}
      {currentView === 'grouped' && (
        <GroupedView
          groups={groups}
          reports={reports}
          onViewGroup={(groupId) => {
            const group = groups.find(g => g.id === groupId);
            if (group) openGroupDetailsModal(group);
          }}
          onEditGroup={(groupId) => {
            const group = groups.find(g => g.id === groupId);
            if (group) openEditGroupModal(group);
          }}
          onDeleteGroup={(groupId) => {
            const group = groups.find(g => g.id === groupId);
            if (group) setDeleteGroupModal({ isOpen: true, group });
          }}
          onCreateGroup={() => openCreateGroupModal('manual')}
        />
      )}

      {currentView === 'ungrouped' && (
        <UngroupedView
          reports={ungroupedReports}
          selectedReportIds={selectedReportIds}
          onSelectReport={(reportId: string) => {
            setSelectedReportIds(prev => 
              prev.includes(reportId)
                ? prev.filter(id => id !== reportId)
                : [...prev, reportId]
            );
          }}
          onAddToGroup={(reportId: string) => {
            const report = reports.find(r => r.id === reportId);
            if (report) openAddToGroupModal(report);
          }}
          onCreateGroup={(reportId: string) => {
            const report = reports.find(r => r.id === reportId);
            if (report) openCreateGroupModal('from-report', report);
          }}
          onViewReport={handleViewReportDetails}
          onDeleteReport={(reportId: string) => {
            const report = reports.find(r => r.id === reportId);
            if (report) setDeleteReportModal({ isOpen: true, report });
          }}
          onBulkGroup={handleBulkGroup}
        />
      )}

      {currentView === 'all' && (
        <AllView
          groups={groups}
          reports={reports}
          onViewGroup={(groupId: string) => {
            const group = groups.find(g => g.id === groupId);
            if (group) openGroupDetailsModal(group);
          }}
          onViewReport={handleViewReportDetails}
        />
      )}

      {/* Modals */}
      {createGroupModal.isOpen && (
        <CreateGroupModal
          isOpen={createGroupModal.isOpen}
          onClose={closeCreateGroupModal}
          onSubmit={handleCreateGroup}
          mode={createGroupModal.mode}
          initialReport={createGroupModal.report}
        />
      )}

      {editGroupModal.isOpen && editGroupModal.group && (
        <EditGroupModal
          isOpen={editGroupModal.isOpen}
          onClose={closeEditGroupModal}
          onSubmit={handleEditGroup}
          group={editGroupModal.group}
        />
      )}

      {groupDetailsModal.isOpen && groupDetailsModal.group && (
        <GroupDetailsModal
          isOpen={groupDetailsModal.isOpen}
          onClose={closeGroupDetailsModal}
          group={groupDetailsModal.group}
          reports={reports.filter(r => groupDetailsModal.group?.reportIds.includes(r.id))}
          onEditGroup={() => {
            closeGroupDetailsModal();
            if (groupDetailsModal.group) {
              openEditGroupModal(groupDetailsModal.group);
            }
          }}
          onDeleteGroup={() => {
            if (groupDetailsModal.group) {
              closeGroupDetailsModal();
              setDeleteGroupModal({ isOpen: true, group: groupDetailsModal.group });
            }
          }}
          onRemoveReport={(reportId) => {
            const report = reports.find(r => r.id === reportId);
            if (report) setRemoveReportModal({ isOpen: true, report });
          }}
          onDeleteReport={(reportId) => {
            const report = reports.find(r => r.id === reportId);
            if (report) setDeleteReportModal({ isOpen: true, report });
          }}
          onViewReport={handleViewReportDetails}
        />
      )}

      {addToGroupModal.isOpen && addToGroupModal.report && (
        <AddToGroupModal
          isOpen={addToGroupModal.isOpen}
          onClose={closeAddToGroupModal}
          report={addToGroupModal.report}
          groups={groups}
          onSubmit={handleAddToGroup}
        />
      )}

      {reportDetailsModal.isOpen && reportDetailsModal.report && (
        <ReportDetailsModal
          isOpen={reportDetailsModal.isOpen}
          onClose={closeReportDetailsModal}
          report={reportDetailsModal.report}
        />
      )}

      {/* Delete Confirmations */}
      {deleteGroupModal.isOpen && deleteGroupModal.group && (
        <DeleteGroupConfirmation
          isOpen={deleteGroupModal.isOpen}
          onClose={() => setDeleteGroupModal({ isOpen: false })}
          onConfirm={(deleteReports) => {
            handleDeleteGroup(deleteGroupModal.group!.id, deleteReports);
          }}
          group={deleteGroupModal.group}
        />
      )}

      {deleteReportModal.isOpen && deleteReportModal.report && (
        <DeleteConfirmation
          isOpen={deleteReportModal.isOpen}
          onClose={() => setDeleteReportModal({ isOpen: false })}
          onConfirm={() => {
            handleDeleteReport(deleteReportModal.report!.id);
          }}
          title="Delete Report"
          message="Are you sure you want to delete this report?"
          itemName={`Report #${deleteReportModal.report.id} - ${deleteReportModal.report.animalType} spotted on ${deleteReportModal.report.spottedDate}`}
          confirmButtonText="Delete Report"
        />
      )}

      {removeReportModal.isOpen && removeReportModal.report && (
        <DeleteConfirmation
          isOpen={removeReportModal.isOpen}
          onClose={() => setRemoveReportModal({ isOpen: false })}
          onConfirm={() => {
            handleRemoveFromGroup(removeReportModal.report!.id);
          }}
          title="Remove from Group"
          message="Are you sure you want to remove this report from its group? The report will move to the ungrouped section."
          itemName={`Report #${removeReportModal.report.id}`}
          confirmButtonText="Remove from Group"
          isDangerous={false}
        />
      )}
    </div>
  );
}
