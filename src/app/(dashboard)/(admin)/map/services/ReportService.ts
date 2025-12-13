// Dependency Inversion: Abstract interface for data fetching
import { AnimalReport } from '../types/MapTypes';

export interface ReportDataService {
  fetchReports(): Promise<AnimalReport[]>;
}

// Mock implementation for development
export class MockReportService implements ReportDataService {
  async fetchReports(): Promise<AnimalReport[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return generateMockReports();
  }
}

// Future Supabase implementation
export class SupabaseReportService implements ReportDataService {
  async fetchReports(): Promise<AnimalReport[]> {
    try {
      // Call the server-side map reports endpoint which joins lookup tables
      const res = await fetch('/api/admin/map/reports');
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.error || 'Failed to fetch reports');
      }
      const rows = payload.data as Array<Record<string, unknown>>;

      return rows.map(r => ({
        id: String(r.id),
        latitude: Number(r.latitude),
        longitude: Number(r.longitude),
        animalType: (String(r.animal_type) as 'dog' | 'cat'),
        spottedDate: String(r.spotted_date),
        spottedTime: String(r.spotted_time),
        status: (String(r.status) as 'pending' | 'verified' | 'rejected'),
        locationDescription: r.location_description ? String(r.location_description) : undefined,
        photoUrl: r.photo_url ? String(r.photo_url) : undefined,
        reporterName: r.user_name ? String(r.user_name) : undefined,
      }));
    } catch (error) {
      console.error('Error fetching reports from Supabase:', error);
      throw error;
    }
  }
}

// Mock data generator (same as before, extracted here)
function generateMockReports(): AnimalReport[] {
  const mockReports: AnimalReport[] = [];
  const now = new Date();
  
  const getDaysAgo = (days: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  };

  const campusLocations: [number, number][] = [
    [10.746183, 124.795011], // Center
    [10.745500, 124.793500], // West side
    [10.747500, 124.796500], // East side
    [10.744800, 124.794800], // South
    [10.747800, 124.793800], // North
    [10.746000, 124.795500], // Near center
    [10.745200, 124.794200], // Southwest
    [10.747200, 124.795800], // Northeast
  ];

  const reportData = [
    { days: 0, count: 5 },   // Today
    { days: 1, count: 3 },   // Yesterday
    { days: 3, count: 4 },   // This week
    { days: 5, count: 4 },
    { days: 10, count: 3 },  // This month
    { days: 15, count: 4 },
    { days: 20, count: 3 },
  ];

  let idCounter = 1;
  reportData.forEach(({ days, count }) => {
    for (let i = 0; i < count; i++) {
      const location = campusLocations[Math.floor(Math.random() * campusLocations.length)];
      const animalType = Math.random() > 0.5 ? 'dog' : 'cat';
      // Only generate pending and verified (no rejected since they'll be deleted)
      const statuses: ('pending' | 'verified')[] = ['pending', 'verified'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      mockReports.push({
        id: `report-${idCounter++}`,
        latitude: location[0] + (Math.random() - 0.5) * 0.002,
        longitude: location[1] + (Math.random() - 0.5) * 0.002,
        animalType,
        spottedDate: getDaysAgo(days),
        spottedTime: `${String(Math.floor(Math.random() * 12) + 8).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        status,
        reporterName: `Student ${idCounter}`,
        locationDescription: [
          'Near main gate',
          'Behind cafeteria',
          'Library area',
          'Near College of Engineering',
          'Beside gymnasium',
          'Near parking lot'
        ][Math.floor(Math.random() * 6)],
      });
    }
  });

  return mockReports;
}

// Factory function to get the appropriate service
export function getReportService(): ReportDataService {
  // Use the Supabase-backed service for admin map by default
  const USE_SUPABASE = true;

  return USE_SUPABASE ? new SupabaseReportService() : new MockReportService();
}
