'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Calendar, Clock, MapPin, User, PawPrint, StickyNote, Info } from 'lucide-react';
import { fetchReportById, UserReport } from '../actions';
import { useRouter } from 'next/navigation';
import L from 'leaflet';

// Fix Leaflet marker icon issue in Next.js
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

// Dynamically import map component to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface ViewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  onDelete?: (reportId: string) => void;
  canEdit?: boolean;
}

export default function ViewReportModal({ isOpen, onClose, reportId, onDelete, canEdit = false }: ViewReportModalProps) {
  const router = useRouter();
  const [report, setReport] = useState<UserReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const loadReport = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await fetchReportById(reportId);

      if (fetchError || !data) {
        setError(fetchError || 'Failed to load report');
        return;
      }

      setReport(data);

      // Get user info from localStorage or auth
      const email = localStorage.getItem('userEmail') || 'student@example.jp';
      const name = localStorage.getItem('userName') || 'Student User';
      setUserEmail(email);
      setUserName(name);
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error loading report:', err);
    } finally {
      setIsLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    if (isOpen && reportId) {
      loadReport();
    }
  }, [isOpen, reportId, loadReport]);

  const handleEdit = () => {
    onClose();
    router.push(`/report/edit/${reportId}`);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(reportId);
      onClose();
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="warning">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Pending
            </span>
          </Badge>
        );
      case 'verified':
        return <Badge variant="success">Verified</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return <Badge variant="default">{capitalize(status)}</Badge>;
    }
  };

  const formatHealthProblems = (problems: string[] | undefined) => {
    if (!problems || problems.length === 0) return 'None';
    return problems
      .filter(p => !p.includes('-none'))
      .map(p => p.replace(/-/g, ' ').replace(/^(skin|eye|gait)\s/, ''))
      .map(capitalize)
      .join(', ') || 'None';
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Details">
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--color-primary))] mx-auto mb-4"></div>
            <p className="text-[rgb(var(--color-text-secondary))]">Loading report details...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button variant="secondary" onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
        ) : report ? (
          <>
            {/* Report Photo */}
            {report.photo_url && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={report.photo_url}
                  alt={`${capitalize(report.animal_type)} sighting`}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Animal Type and Status */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] capitalize">
                  {capitalize(report.animal_type)} • {capitalize(report.sex)}
                </h3>
                {getStatusBadge(report.status)}
              </div>
              <p className="text-xs text-[rgb(var(--color-text-secondary))] font-mono">
                Report ID: {report.id}
              </p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-[rgb(var(--color-text-secondary))]">
              <MapPin className="w-5 h-5" />
              <span>{report.location_description}</span>
            </div>

            {/* Description */}
            {report.additional_notes && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-semibold text-[rgb(var(--color-text-primary))]">Description</h4>
                </div>
                <p className="text-[rgb(var(--color-text-secondary))] leading-relaxed">
                  {report.additional_notes}
                </p>
              </div>
            )}

            {/* Animal Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PawPrint className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-semibold text-[rgb(var(--color-text-primary))]">
                  Animal Information
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">Color Pattern</p>
                  <p className="font-medium text-[rgb(var(--color-text-primary))]">
                    {report.color_pattern ? capitalize(report.color_pattern) : 'Not specified'}
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">Color</p>
                  <p className="font-medium text-[rgb(var(--color-text-primary))]">
                    {report.primary_color ? capitalize(report.primary_color) : 'Not specified'}
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">Size</p>
                  <p className="font-medium text-[rgb(var(--color-text-primary))]">
                    Body Condition Score: {report.body_condition_score}/9
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">Collar</p>
                  <p className="font-medium text-[rgb(var(--color-text-primary))]">
                    {report.collar_status === 'with' ? 'With Collar' : 'Without Collar'}
                  </p>
                </div>
              </div>

              {/* Physical Additional Notes */}
              {report.physical_additional_notes && (
                <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">Additional Physical Observations</p>
                  <p className="text-[rgb(var(--color-text-secondary))] leading-relaxed">
                    {report.physical_additional_notes}
                  </p>
                </div>
              )}
            </div>

            {/* Health Problems */}
            {(report.skin_problems && report.skin_problems.length > 0) || 
             (report.eye_problems && report.eye_problems.length > 0) || 
             (report.gait_problems && report.gait_problems.length > 0) ? (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <StickyNote className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="font-semibold text-[rgb(var(--color-text-primary))]">
                    Health Observations
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {report.skin_problems && report.skin_problems.length > 0 && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">Skin Conditions</p>
                      <p className="font-medium text-[rgb(var(--color-text-primary))]">
                        {formatHealthProblems(report.skin_problems)}
                      </p>
                    </div>
                  )}

                  {report.eye_problems && report.eye_problems.length > 0 && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">Eye Conditions</p>
                      <p className="font-medium text-[rgb(var(--color-text-primary))]">
                        {formatHealthProblems(report.eye_problems)}
                      </p>
                    </div>
                  )}

                  {report.gait_problems && report.gait_problems.length > 0 && (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">Gait Issues</p>
                      <p className="font-medium text-[rgb(var(--color-text-primary))]">
                        {formatHealthProblems(report.gait_problems)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Sighting Details */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-semibold text-[rgb(var(--color-text-primary))]">
                  Sighting Details
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[rgb(var(--color-text-secondary))] mb-2">
                    <Calendar className="w-4 h-4" />
                    <p className="text-sm">Date</p>
                  </div>
                  <p className="font-medium text-[rgb(var(--color-text-primary))]">
                    {formatDate(report.spotted_date)}
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[rgb(var(--color-text-secondary))] mb-2">
                    <Clock className="w-4 h-4" />
                    <p className="text-sm">Time</p>
                  </div>
                  <p className="font-medium text-[rgb(var(--color-text-primary))]">
                    {formatTime(report.spotted_time)}
                  </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[rgb(var(--color-text-secondary))] mb-2">
                    <MapPin className="w-4 h-4" />
                    <p className="text-sm">Location</p>
                  </div>
                  <p className="font-medium text-[rgb(var(--color-text-primary))]">
                    {report.location_description}
                  </p>
                </div>
              </div>

              {/* Map */}
              {report.latitude && report.longitude && (
                <div className="h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <MapContainer
                    center={[Number(report.latitude), Number(report.longitude)]}
                    zoom={16}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[Number(report.latitude), Number(report.longitude)]}>
                      <Popup>
                        <div className="text-sm">
                          <p className="font-semibold">{capitalize(report.animal_type)} sighting</p>
                          <p>{report.location_description}</p>
                        </div>
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </div>

            {/* Reporter Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h4 className="font-semibold text-[rgb(var(--color-text-primary))]">
                  Reporter Information
                </h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">Name</p>
                  <p className="font-medium text-[rgb(var(--color-text-primary))]">{userName}</p>
                </div>

                <div>
                  <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">Email</p>
                  <p className="font-medium text-[rgb(var(--color-text-primary))]">{userEmail}</p>
                </div>

                <div>
                  <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">Submitted On</p>
                  <p className="font-medium text-[rgb(var(--color-text-primary))]">
                    {formatDate(report.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-[rgb(var(--color-border))]">
              <Button
                variant="primary"
                onClick={onClose}
                fullWidth
              >
                Close
              </Button>
              
              {canEdit && (
                <Button
                  variant="secondary"
                  onClick={handleEdit}
                >
                  Edit Report
                </Button>
              )}

              {canEdit && onDelete && (
                <Button
                  variant="danger"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              )}
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
}
