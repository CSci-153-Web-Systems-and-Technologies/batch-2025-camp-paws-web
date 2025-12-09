'use client';

// Single Responsibility: Display detailed report information in a modal
import { useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ReportDetailsModalProps } from '../types/VerifyTypes';
import { parsePhysicalProblems } from '../utils/PhysicalProblemsParser';

const ReportLocationMap = dynamic(() => import('./ReportLocationMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[rgb(var(--color-background))] flex items-center justify-center">
      <div className="text-[rgb(var(--color-text-secondary))] text-sm">Loading map...</div>
    </div>
  ),
});

export default function ReportDetailsModal({
  report,
  isOpen,
  onClose,
  onAccept,
  onReject,
  onWarnUser,
  onSuspendUser,
}: ReportDetailsModalProps) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showWarnDialog, setShowWarnDialog] = useState(false);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !report) return null;

  const handleAccept = async () => {
    setIsProcessing(true);
    await onAccept(report.id);
    setIsProcessing(false);
    onClose();
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    setIsProcessing(true);
    await onReject(report.id, reason);
    setIsProcessing(false);
    setShowRejectDialog(false);
    setReason('');
    onClose();
  };

  const handleWarn = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason for warning');
      return;
    }
    setIsProcessing(true);
    await onWarnUser(report.reporterEmail, reason);
    setIsProcessing(false);
    setShowWarnDialog(false);
    setReason('');
  };

  const handleSuspend = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason for suspension');
      return;
    }
    setIsProcessing(true);
    await onSuspendUser(report.reporterEmail, reason);
    setIsProcessing(false);
    setShowSuspendDialog(false);
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-[rgb(var(--color-surface))] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[rgb(var(--color-text-tertiary))] hover:text-[rgb(var(--color-text-secondary))] z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Photo and Map */}
              <div className="space-y-4 order-1">
                {/* Photo */}
                <div className="relative w-full h-64 bg-[rgb(var(--color-background))] rounded-lg overflow-hidden">
                  <Image
                    src={report.photoUrl}
                    alt={`${report.animalType} sighting`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Report ID */}
                <div className="text-sm text-[rgb(var(--color-text-secondary))]">
                  Report ID: {report.id}
                </div>

                {/* Map */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">Location</h3>
                  <div className="h-64 rounded-lg overflow-hidden border border-[rgb(var(--color-border))]">
                    <ReportLocationMap latitude={report.latitude} longitude={report.longitude} />
                  </div>
                  <p className="text-xs text-[rgb(var(--color-text-secondary))]">{report.locationDescription}</p>
                </div>
              </div>

              {/* Right Column - Report Details */}
              <div className="space-y-6 order-2 lg:order-2">
                <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">Report Details</h2>

                {/* Identification Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-[rgb(var(--color-text-primary))] border-b border-[rgb(var(--color-border))] pb-2">Identification</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">Animal Type</div>
                      <div className="text-sm text-[rgb(var(--color-text-primary))] capitalize">{report.animalType}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">Sex</div>
                      <div className="text-sm text-[rgb(var(--color-text-primary))] capitalize">{report.sex}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">Collar</div>
                      <div className="text-sm text-[rgb(var(--color-text-primary))] capitalize">{report.collar}</div>
                    </div>
                  </div>
                </div>

                {/* Physical Attributes */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-[rgb(var(--color-text-primary))] border-b border-[rgb(var(--color-border))] pb-2">Physical Attributes</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">Color Pattern</div>
                      <div className="text-sm text-[rgb(var(--color-text-primary))] capitalize">{report.colorPattern}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">Primary Color</div>
                      <div className="text-sm text-[rgb(var(--color-text-primary))]">{report.primaryColor}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">Body Condition Score</div>
                      <div className="text-sm text-[rgb(var(--color-text-primary))]">{report.bodyConditionScore} - {report.bodyConditionScore <= 3 ? 'Thin' : report.bodyConditionScore <= 5 ? 'Ideal' : 'Overweight'}</div>
                    </div>
                  </div>
                </div>

                {/* Physical Assessment */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-[rgb(var(--color-text-primary))] border-b border-[rgb(var(--color-border))] pb-2">Physical Assessment</h3>
                  {(() => {
                    const categorizedProblems = parsePhysicalProblems(report.physicalProblems);
                    const hasAnyProblems = categorizedProblems.skin.length > 0 || 
                                          categorizedProblems.eye.length > 0 || 
                                          categorizedProblems.gait.length > 0;

                    if (!hasAnyProblems) {
                      return (
                        <div className="text-sm text-[rgb(var(--color-text-secondary))] italic">
                          No physical problems reported
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        {/* Skin Problems */}
                        {categorizedProblems.skin.length > 0 && (
                          <div>
                            <div className="text-xs font-semibold text-[rgb(var(--color-text-primary))] mb-1">Skin Problems:</div>
                            <ul className="list-disc list-inside space-y-0.5 ml-2">
                              {categorizedProblems.skin.map((problem, idx) => (
                                <li key={idx} className="text-sm text-[rgb(var(--color-text-primary))]">{problem}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Eye Problems */}
                        {categorizedProblems.eye.length > 0 && (
                          <div>
                            <div className="text-xs font-semibold text-[rgb(var(--color-text-primary))] mb-1">Eye Problems:</div>
                            <ul className="list-disc list-inside space-y-0.5 ml-2">
                              {categorizedProblems.eye.map((problem, idx) => (
                                <li key={idx} className="text-sm text-[rgb(var(--color-text-primary))]">{problem}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Gait Problems */}
                        {categorizedProblems.gait.length > 0 && (
                          <div>
                            <div className="text-xs font-semibold text-[rgb(var(--color-text-primary))] mb-1">Gait Problems:</div>
                            <ul className="list-disc list-inside space-y-0.5 ml-2">
                              {categorizedProblems.gait.map((problem, idx) => (
                                <li key={idx} className="text-sm text-[rgb(var(--color-text-primary))]">{problem}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Additional Notes */}
                {report.notes && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-[rgb(var(--color-text-primary))] border-b border-[rgb(var(--color-border))] pb-2">Additional Notes</h3>
                    <div className="bg-[rgb(var(--color-background))] rounded-lg p-3">
                      <p className="text-sm text-[rgb(var(--color-text-primary))]">{report.notes}</p>
                    </div>
                  </div>
                )}

                {/* Date and Time */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-[rgb(var(--color-text-primary))] border-b border-[rgb(var(--color-border))] pb-2">Date and Time</h3>
                  <div className="text-sm text-[rgb(var(--color-text-primary))]">
                    {report.spottedDate} - {report.spottedTime}
                  </div>
                </div>
              </div>

              {/* Reporter Info - Appears at the end on mobile */}
              <div className="bg-[rgb(var(--color-background))] rounded-lg p-4 space-y-3 order-3 lg:order-3 col-span-1 lg:col-span-2">
                <h3 className="font-semibold text-[rgb(var(--color-text-primary))] border-b border-[rgb(var(--color-border))] pb-2">Reporter Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">Reported By</div>
                    <div className="text-sm text-[rgb(var(--color-text-primary))]">{report.reportedBy}</div>
                    <div className="text-xs text-[rgb(var(--color-text-secondary))]">{report.reporterEmail}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">Date Reported</div>
                    <div className="text-sm text-[rgb(var(--color-text-primary))]">{report.spottedDate}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">Reports Submitted</div>
                    <div className="text-sm text-[rgb(var(--color-text-primary))]">{report.reportsSubmitted} reports</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">Warnings</div>
                    <div className="text-sm text-[rgb(var(--color-text-primary))] flex items-center gap-2">
                      {report.warnings} warnings
                      {report.warnings > 0 && (
                        <span className="text-[rgb(var(--color-warning))]">⚠️</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* User Actions */}
                <div className="flex gap-2 pt-2 border-t border-[rgb(var(--color-border))]">
                  <button
                    onClick={() => setShowWarnDialog(true)}
                    className="flex-1 px-3 py-2 bg-[rgb(var(--color-warning-bg))] text-[rgb(var(--color-warning))] rounded-lg hover:opacity-90 transition-colors text-sm font-medium"
                  >
                    Warn User
                  </button>
                  <button
                    onClick={() => setShowSuspendDialog(true)}
                    className="flex-1 px-3 py-2 bg-[rgb(var(--color-error-bg))] text-[rgb(var(--color-error))] rounded-lg hover:opacity-90 transition-colors text-sm font-medium"
                  >
                    Suspend User
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-[rgb(var(--color-border))]">
              <button
                onClick={() => setShowRejectDialog(true)}
                disabled={isProcessing}
                className="px-4 py-2 bg-[rgb(var(--color-error))] text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={() => alert('Edit functionality coming soon')}
                disabled={isProcessing}
                className="px-4 py-2 bg-[rgb(var(--color-info))] text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
              >
                Edit
              </button>
              <button
                onClick={handleAccept}
                disabled={isProcessing}
                className="ml-auto px-6 py-2 bg-[rgb(var(--color-success))] text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Accept'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowRejectDialog(false)} />
          <div className="relative bg-[rgb(var(--color-surface))] rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-4">Reject Report</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a reason for rejection..."
              className="w-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] rounded-lg p-3 text-sm resize-none"
              rows={4}
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setShowRejectDialog(false); setReason(''); }}
                className="flex-1 px-4 py-2 border border-[rgb(var(--color-border))] rounded-lg hover:bg-[rgb(var(--color-background))]"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-[rgb(var(--color-error))] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warn Dialog */}
      {showWarnDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowWarnDialog(false)} />
          <div className="relative bg-[rgb(var(--color-surface))] rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-4">Warn User</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a reason for warning..."
              className="w-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] rounded-lg p-3 text-sm resize-none"
              rows={4}
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setShowWarnDialog(false); setReason(''); }}
                className="flex-1 px-4 py-2 border border-[rgb(var(--color-border))] rounded-lg hover:bg-[rgb(var(--color-background))]"
              >
                Cancel
              </button>
              <button
                onClick={handleWarn}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-[rgb(var(--color-warning))] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Send Warning'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Dialog */}
      {showSuspendDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowSuspendDialog(false)} />
          <div className="relative bg-[rgb(var(--color-surface))] rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-4">Suspend User</h3>
            <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-4">
              This will suspend {report.reportedBy} from submitting reports.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a reason for suspension..."
              className="w-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-primary))] placeholder:text-[rgb(var(--color-text-tertiary))] rounded-lg p-3 text-sm resize-none"
              rows={4}
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setShowSuspendDialog(false); setReason(''); }}
                className="flex-1 px-4 py-2 border border-[rgb(var(--color-border))] rounded-lg hover:bg-[rgb(var(--color-background))]"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspend}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-[rgb(var(--color-error))] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Confirm Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
