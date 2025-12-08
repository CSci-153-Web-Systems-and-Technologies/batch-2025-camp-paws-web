'use client';

// Single Responsibility: Display detailed report information in a modal
import { useState } from 'react';
import Image from 'next/image';
import { ReportDetailsModalProps } from '../types/VerifyTypes';
import { parsePhysicalProblems } from '../utils/PhysicalProblemsParser';

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
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Photo and Map */}
              <div className="space-y-4">
                {/* Photo */}
                <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={report.photoUrl}
                    alt={`${report.animalType} sighting`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Report ID */}
                <div className="text-sm text-gray-500">
                  Report ID: {report.id}
                </div>

                {/* Map */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Location</h3>
                  <div className="h-64 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-sm text-gray-600">
                        {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{report.locationDescription}</p>
                    </div>
                  </div>
                </div>

                {/* Date Reported & Reporter Info */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <div className="text-xs font-medium text-gray-500">Date Reported</div>
                    <div className="text-sm text-gray-900">{report.spottedDate}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500">Reported By</div>
                    <div className="text-sm text-gray-900">{report.reportedBy}</div>
                    <div className="text-xs text-gray-500">{report.reporterEmail}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500">Reports Submitted</div>
                    <div className="text-sm text-gray-900">{report.reportsSubmitted} reports</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500">Warnings</div>
                    <div className="text-sm text-gray-900 flex items-center gap-2">
                      {report.warnings} warnings
                      {report.warnings > 0 && (
                        <span className="text-yellow-600">⚠️</span>
                      )}
                    </div>
                  </div>

                  {/* User Actions */}
                  <div className="flex gap-2 pt-2 border-t border-gray-200">
                    <button
                      onClick={() => setShowWarnDialog(true)}
                      className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
                    >
                      Warn User
                    </button>
                    <button
                      onClick={() => setShowSuspendDialog(true)}
                      className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      Suspend
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Report Details */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Report Details</h2>

                {/* Identification Section */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">Identification</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-gray-500">Animal Type</div>
                      <div className="text-sm text-gray-900 capitalize">{report.animalType}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500">Sex</div>
                      <div className="text-sm text-gray-900 capitalize">{report.sex}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500">Collar</div>
                      <div className="text-sm text-gray-900 capitalize">{report.collar}</div>
                    </div>
                  </div>
                </div>

                {/* Physical Attributes */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">Physical Attributes</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-gray-500">Color Pattern</div>
                      <div className="text-sm text-gray-900 capitalize">{report.colorPattern}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500">Primary Color</div>
                      <div className="text-sm text-gray-900">{report.primaryColor}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs font-medium text-gray-500">Body Condition Score</div>
                      <div className="text-sm text-gray-900">{report.bodyConditionScore} - {report.bodyConditionScore <= 3 ? 'Thin' : report.bodyConditionScore <= 5 ? 'Ideal' : 'Overweight'}</div>
                    </div>
                  </div>
                </div>

                {/* Physical Assessment */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">Physical Assessment</h3>
                  {(() => {
                    const categorizedProblems = parsePhysicalProblems(report.physicalProblems);
                    const hasAnyProblems = categorizedProblems.skin.length > 0 || 
                                          categorizedProblems.eye.length > 0 || 
                                          categorizedProblems.gait.length > 0;

                    if (!hasAnyProblems) {
                      return (
                        <div className="text-sm text-gray-600 italic">
                          No physical problems reported
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        {/* Skin Problems */}
                        {categorizedProblems.skin.length > 0 && (
                          <div>
                            <div className="text-xs font-semibold text-gray-700 mb-1">Skin Problems:</div>
                            <ul className="list-disc list-inside space-y-0.5 ml-2">
                              {categorizedProblems.skin.map((problem, idx) => (
                                <li key={idx} className="text-sm text-gray-800">{problem}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Eye Problems */}
                        {categorizedProblems.eye.length > 0 && (
                          <div>
                            <div className="text-xs font-semibold text-gray-700 mb-1">Eye Problems:</div>
                            <ul className="list-disc list-inside space-y-0.5 ml-2">
                              {categorizedProblems.eye.map((problem, idx) => (
                                <li key={idx} className="text-sm text-gray-800">{problem}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Gait Problems */}
                        {categorizedProblems.gait.length > 0 && (
                          <div>
                            <div className="text-xs font-semibold text-gray-700 mb-1">Gait Problems:</div>
                            <ul className="list-disc list-inside space-y-0.5 ml-2">
                              {categorizedProblems.gait.map((problem, idx) => (
                                <li key={idx} className="text-sm text-gray-800">{problem}</li>
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
                    <h3 className="font-semibold text-gray-900 border-b pb-2">Additional Notes</h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{report.notes}</p>
                    </div>
                  </div>
                )}

                {/* Date and Time */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">Date and Time</h3>
                  <div className="text-sm text-gray-900">
                    {report.spottedDate} - {report.spottedTime}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowRejectDialog(true)}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={handleAccept}
                disabled={isProcessing}
                className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
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
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowRejectDialog(false)} />
          <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Report</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a reason for rejection..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none"
              rows={4}
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setShowRejectDialog(false); setReason(''); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
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
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowWarnDialog(false)} />
          <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Warn User</h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a reason for warning..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none"
              rows={4}
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setShowWarnDialog(false); setReason(''); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleWarn}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
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
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowSuspendDialog(false)} />
          <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Suspend User</h3>
            <p className="text-sm text-gray-600 mb-4">
              This will suspend {report.reportedBy} from submitting reports.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a reason for suspension..."
              className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none"
              rows={4}
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setShowSuspendDialog(false); setReason(''); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspend}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
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
