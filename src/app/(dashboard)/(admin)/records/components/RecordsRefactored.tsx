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
      // TODO: Replace with actual API calls
      // const [reportsData, groupsData] = await Promise.all([
      //   fetch('/api/reports/accepted').then(res => res.json()),
      //   fetch('/api/groups').then(res => res.json())
      // ]);
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReports: AcceptedReport[] = [
        {
          id: 'report-1',
          groupId: null,
          photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800',
          animalType: 'dog',
          sex: 'male',
          collar: 'yes',
          colorPattern: 'solid',
          primaryColor: 'brown',
          bodyConditionScore: 3,
          skinProblems: [],
          eyeProblems: [],
          gaitProblems: ['limping', 'difficulty_walking'],
          notes: 'Friendly dog seen near library',
          latitude: 14.5995,
          longitude: 120.9842,
          locationDescription: 'University Library',
          spottedDate: '2025-12-08',
          spottedTime: '14:30',
          reportedBy: 'user-1',
          reporterEmail: 'john@example.com',
          status: 'verified',
          verifiedBy: 'admin-1',
          verifiedAt: '2025-12-08T15:00:00Z',
          acceptedAt: '2025-12-08T15:00:00Z',
          createdAt: '2025-12-08T14:35:00Z',
          updatedAt: '2025-12-08T15:00:00Z'
        },
        {
          id: 'report-2',
          groupId: 'group-1',
          photoUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
          animalType: 'cat',
          sex: 'female',
          collar: 'no',
          colorPattern: 'tabby',
          primaryColor: 'orange',
          bodyConditionScore: 4,
          skinProblems: [],
          eyeProblems: [],
          gaitProblems: [],
          notes: 'Well-fed cat, appears to be owned',
          latitude: 14.5995,
          longitude: 120.9842,
          locationDescription: 'Student Center',
          spottedDate: '2025-12-07',
          spottedTime: '10:15',
          reportedBy: 'user-2',
          reporterEmail: 'jane@example.com',
          status: 'verified',
          verifiedBy: 'admin-1',
          verifiedAt: '2025-12-07T11:00:00Z',
          acceptedAt: '2025-12-07T11:00:00Z',
          createdAt: '2025-12-07T10:20:00Z',
          updatedAt: '2025-12-07T11:00:00Z'
        },
        {
          id: 'report-3',
          groupId: 'group-1',
          photoUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800',
          animalType: 'cat',
          sex: 'female',
          collar: 'no',
          colorPattern: 'tabby',
          primaryColor: 'orange',
          bodyConditionScore: 4,
          skinProblems: ['hair_loss', 'redness'],
          eyeProblems: ['discharge', 'cloudiness'],
          gaitProblems: [],
          notes: 'Same cat as before, near cafeteria. Noticed some eye discharge.',
          latitude: 14.5995,
          longitude: 120.9842,
          locationDescription: 'Main Cafeteria',
          spottedDate: '2025-12-09',
          spottedTime: '12:00',
          reportedBy: 'user-3',
          reporterEmail: 'mike@example.com',
          status: 'verified',
          verifiedBy: 'admin-1',
          verifiedAt: '2025-12-09T12:30:00Z',
          acceptedAt: '2025-12-09T12:30:00Z',
          createdAt: '2025-12-09T12:05:00Z',
          updatedAt: '2025-12-09T12:30:00Z'
        }
      ];

      const mockGroups: AnimalGroup[] = [
        {
          id: 'group-1',
          name: 'Orange Tabby - Campus Center Area',
          description: 'Well-fed orange tabby cat frequently seen around student center and cafeteria',
          animalType: 'cat',
          sex: 'female',
          colorPattern: 'tabby',
          primaryColor: 'orange',
          reportCount: 2,
          firstSightedDate: '2025-12-07',
          lastSightedDate: '2025-12-09',
          createdAt: '2025-12-07T11:30:00Z',
          createdBy: 'admin-1',
          updatedAt: '2025-12-09T12:35:00Z',
          reportIds: ['report-2', 'report-3']
        }
      ];

      setReports(mockReports);
      setGroups(mockGroups);
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
      // TODO: Replace with actual API call
      // const newGroup = await fetch('/api/groups', {
      //   method: 'POST',
      //   body: JSON.stringify(input)
      // }).then(res => res.json());

      // Mock implementation
      const newGroup: AnimalGroup = {
        id: `group-${Date.now()}`,
        name: input.name,
        description: input.description,
        animalType: input.animalType,
        sex: input.sex || 'unknown',
        primaryColor: input.primaryColor,
        colorPattern: input.colorPattern,
        reportCount: input.initialReportId ? 1 : 0,
        firstSightedDate: input.initialReportId 
          ? reports.find(r => r.id === input.initialReportId)?.spottedDate || new Date().toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        lastSightedDate: input.initialReportId
          ? reports.find(r => r.id === input.initialReportId)?.spottedDate || new Date().toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        createdBy: 'current-admin',
        updatedAt: new Date().toISOString(),
        reportIds: input.initialReportId ? [input.initialReportId] : []
      };

      setGroups(prev => [...prev, newGroup]);

      // If creating from report, update the report's groupId
      if (input.initialReportId) {
        setReports(prev => prev.map(r => 
          r.id === input.initialReportId ? { ...r, groupId: newGroup.id } : r
        ));
      }

      console.log('Group created successfully:', newGroup);
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
    // TODO: Open a modal to select which group to add these reports to
    // For now, just log
    console.log('Bulk group reports:', reportIds);
    alert(`TODO: Select a group for ${reportIds.length} reports`);
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
  const ungroupedReports = reports.filter(r => r.groupId === null);

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
