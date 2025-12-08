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
      // TODO: Uncomment when Supabase is ready
      // const { createClient } = await import('@/lib/supabase/client');
      // const supabase = createClient();
      // 
      // const { data, error } = await supabase
      //   .from('stray_animal_reports')
      //   .select(`
      //     id,
      //     latitude,
      //     longitude,
      //     animal_type,
      //     spotted_date,
      //     spotted_time,
      //     status,
      //     location_description,
      //     photo_url,
      //     users!user_id (
      //       full_name
      //     )
      //   `)
      //   .neq('status', 'rejected') // Exclude rejected reports
      //   .order('spotted_date', { ascending: false });
      //
      // if (error) throw error;
      //
      // // Transform snake_case to camelCase
      // return data.map(report => ({
      //   id: report.id,
      //   latitude: report.latitude,
      //   longitude: report.longitude,
      //   animalType: report.animal_type as 'dog' | 'cat',
      //   spottedDate: report.spotted_date,
      //   spottedTime: report.spotted_time,
      //   status: report.status as 'pending' | 'verified' | 'rejected',
      //   locationDescription: report.location_description,
      //   photoUrl: report.photo_url,
      //   reporterName: report.users?.full_name || 'Anonymous'
      // }));

      // For now, return mock data
      return generateMockReports();
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
  // TODO: Change this to SupabaseReportService when backend is ready
  const USE_SUPABASE = false; // Toggle this when ready
  
  return USE_SUPABASE ? new SupabaseReportService() : new MockReportService();
}
