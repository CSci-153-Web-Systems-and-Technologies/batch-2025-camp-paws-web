/**
 * ReportDetailsModal - Reusable modal for displaying detailed report information
 * Single Responsibility: Display comprehensive report details in a modal
 */
'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Modal from './Modal';

const ReportLocationMap = dynamic(
  () => import('@/app/(dashboard)/(admin)/verify/components/ReportLocationMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[rgb(var(--color-background))] flex items-center justify-center">
        <div className="text-[rgb(var(--color-text-muted))] text-sm">Loading map...</div>
      </div>
    ),
  }
);

export interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: {
    id: string;
    photoUrl: string;
    animalType: 'dog' | 'cat';
    sex: 'male' | 'female' | 'unknown';
    collar: 'yes' | 'no' | 'unknown';
    colorPattern: string;
    primaryColor: string;
    bodyConditionScore: number;
    // UPDATED: Match Supabase schema - separate arrays for each problem type
    skinProblems: string[];
    eyeProblems: string[];
    gaitProblems: string[];
    notes?: string;
    latitude: number;
    longitude: number;
    locationDescription: string;
    spottedDate: string;
    spottedTime: string;
    reportedBy: string;
    reporterEmail: string;
  };
  // Optional additional info section (for different contexts)
  additionalInfo?: ReactNode;
  // Optional action buttons at the bottom
  actions?: ReactNode;
}

export default function ReportDetailsModal({
  isOpen,
  onClose,
  report,
  additionalInfo,
  actions,
}: ReportDetailsModalProps) {
  const animalEmoji = report.animalType === 'dog' ? '🐕' : '🐈';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title={`${animalEmoji} Report Details`}>
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
          <div className="text-sm text-[rgb(var(--color-text-muted))]">Report ID: {report.id}</div>

          {/* Map */}
          <div className="space-y-2">
            <h3 className="font-semibold text-[rgb(var(--color-text))]">Location</h3>
            <div className="h-64 rounded-lg overflow-hidden border border-[rgb(var(--color-border))]">
              <ReportLocationMap latitude={report.latitude} longitude={report.longitude} />
            </div>
            <p className="text-xs text-[rgb(var(--color-text-muted))]">
              {report.locationDescription}
            </p>
          </div>
        </div>

        {/* Right Column - Report Details */}
        <div className="space-y-6 order-2 lg:order-2">
          <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">Report Details</h2>

          {/* Identification Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[rgb(var(--color-text))] border-b border-[rgb(var(--color-border))] pb-2">
              Identification
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
                  Animal Type
                </div>
                <div className="text-sm text-[rgb(var(--color-text))] capitalize">
                  {report.animalType}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-[rgb(var(--color-text-muted))]">Sex</div>
                <div className="text-sm text-[rgb(var(--color-text))] capitalize">
                  {report.sex}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
                  Collar
                </div>
                <div className="text-sm text-[rgb(var(--color-text))] capitalize">
                  {report.collar}
                </div>
              </div>
            </div>
          </div>

          {/* Physical Attributes */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[rgb(var(--color-text))] border-b border-[rgb(var(--color-border))] pb-2">
              Physical Attributes
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
                  Color Pattern
                </div>
                <div className="text-sm text-[rgb(var(--color-text))] capitalize">
                  {report.colorPattern}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
                  Primary Color
                </div>
                <div className="text-sm text-[rgb(var(--color-text))}">{report.primaryColor}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs font-medium text-[rgb(var(--color-text-muted))]">
                  Body Condition Score
                </div>
                <div className="text-sm text-[rgb(var(--color-text))]">
                  {report.bodyConditionScore} -{' '}
                  {report.bodyConditionScore <= 3
                    ? 'Thin'
                    : report.bodyConditionScore <= 5
                      ? 'Ideal'
                      : 'Overweight'}
                </div>
              </div>
            </div>
          </div>

          {/* Physical Assessment */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[rgb(var(--color-text))] border-b border-[rgb(var(--color-border))] pb-2">
              Physical Assessment
            </h3>
            {(() => {
              // UPDATED: Use arrays directly from database (no parsing needed)
              const hasAnyProblems =
                report.skinProblems.length > 0 ||
                report.eyeProblems.length > 0 ||
                report.gaitProblems.length > 0;

              if (!hasAnyProblems) {
                return (
                  <div className="text-sm text-[rgb(var(--color-text-muted))] italic">
                    No physical problems reported
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {/* Skin Problems */}
                  {report.skinProblems.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-[rgb(var(--color-text))] mb-1">
                        Skin Problems:
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 ml-2">
                        {report.skinProblems.map((problem: string, idx: number) => (
                          <li key={idx} className="text-sm text-[rgb(var(--color-text))]">
                            {problem}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Eye Problems */}
                  {report.eyeProblems.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-[rgb(var(--color-text))] mb-1">
                        Eye Problems:
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 ml-2">
                        {report.eyeProblems.map((problem: string, idx: number) => (
                          <li key={idx} className="text-sm text-[rgb(var(--color-text))]">
                            {problem}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Gait Problems */}
                  {report.gaitProblems.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-[rgb(var(--color-text))] mb-1">
                        Gait Problems:
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 ml-2">
                        {report.gaitProblems.map((problem: string, idx: number) => (
                          <li key={idx} className="text-sm text-[rgb(var(--color-text))]">
                            {problem}
                          </li>
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
              <h3 className="font-semibold text-[rgb(var(--color-text))] border-b border-[rgb(var(--color-border))] pb-2">
                Additional Notes
              </h3>
              <div className="bg-[rgb(var(--color-background))] rounded-lg p-3">
                <p className="text-sm text-[rgb(var(--color-text))]">{report.notes}</p>
              </div>
            </div>
          )}

          {/* Date and Time */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[rgb(var(--color-text))] border-b border-[rgb(var(--color-border))] pb-2">
              Date and Time
            </h3>
            <div className="text-sm text-[rgb(var(--color-text))]">
              {report.spottedDate} - {report.spottedTime}
            </div>
          </div>
        </div>

        {/* Additional Info Section (if provided) */}
        {additionalInfo && (
          <div className="order-3 lg:order-3 col-span-1 lg:col-span-2">{additionalInfo}</div>
        )}
      </div>

      {/* Action Buttons (if provided) */}
      {actions && (
        <div className="flex gap-3 mt-6 pt-6 border-t border-[rgb(var(--color-border))]">
          {actions}
        </div>
      )}
    </Modal>
  );
}
