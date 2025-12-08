// Dependency Inversion: Abstract interface for report operations
import { Report } from '../types/VerifyTypes';

export interface ReportService {
  fetchPendingReports(): Promise<Report[]>;
  acceptReport(reportId: string): Promise<void>;
  rejectReport(reportId: string, reason: string): Promise<void>;
  updateReport(reportId: string, data: Partial<Report>): Promise<void>;
  warnUser(userId: string, reason: string): Promise<void>;
  suspendUser(userId: string, reason: string): Promise<void>;
}

// Mock implementation for development
export class MockReportService implements ReportService {
  async fetchPendingReports(): Promise<Report[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return generateMockReports();
  }

  async acceptReport(reportId: string): Promise<void> {
    console.log('✅ Accepting report:', reportId);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async rejectReport(reportId: string, reason: string): Promise<void> {
    console.log('❌ Rejecting report:', reportId, 'Reason:', reason);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async updateReport(reportId: string, data: Partial<Report>): Promise<void> {
    console.log('✏️ Updating report:', reportId, data);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async warnUser(userId: string, reason: string): Promise<void> {
    console.log('⚠️ Warning user:', userId, 'Reason:', reason);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async suspendUser(userId: string, reason: string): Promise<void> {
    console.log('🚫 Suspending user:', userId, 'Reason:', reason);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Future Supabase implementation
export class SupabaseReportService implements ReportService {
  async fetchPendingReports(): Promise<Report[]> {
    try {
      // TODO: Uncomment when Supabase is ready
      // const { createClient } = await import('@/lib/supabase/client');
      // const supabase = createClient();
      // 
      // const { data, error } = await supabase
      //   .from('stray_animal_reports')
      //   .select(`
      //     *,
      //     users!user_id (
      //       full_name,
      //       email
      //     )
      //   `)
      //   .eq('status', 'pending')
      //   .order('created_at', { ascending: false });
      //
      // if (error) throw error;
      //
      // return data.map(transformToReport);

      return generateMockReports();
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  }

  async acceptReport(reportId: string): Promise<void> {
    // const supabase = createClient();
    // await supabase
    //   .from('stray_animal_reports')
    //   .update({ status: 'verified', verified_at: new Date().toISOString() })
    //   .eq('id', reportId);
    
    console.log('Accepting report:', reportId);
  }

  async rejectReport(reportId: string, reason: string): Promise<void> {
    // const supabase = createClient();
    // Delete rejected reports to save space
    // await supabase
    //   .from('stray_animal_reports')
    //   .delete()
    //   .eq('id', reportId);
    
    console.log('Rejecting report:', reportId, reason);
  }

  async updateReport(reportId: string, data: Partial<Report>): Promise<void> {
    // const supabase = createClient();
    // Transform camelCase to snake_case and update
    // await supabase
    //   .from('stray_animal_reports')
    //   .update(transformToDatabase(data))
    //   .eq('id', reportId);
    
    console.log('Updating report:', reportId, data);
  }

  async warnUser(userId: string, reason: string): Promise<void> {
    // const supabase = createClient();
    // Increment warning count
    // await supabase.rpc('increment_user_warnings', { user_id: userId });
    // Create warning record
    // await supabase.from('user_warnings').insert({ user_id: userId, reason });
    
    console.log('Warning user:', userId, reason);
  }

  async suspendUser(userId: string, reason: string): Promise<void> {
    // const supabase = createClient();
    // await supabase
    //   .from('users')
    //   .update({ is_suspended: true, suspension_reason: reason })
    //   .eq('id', userId);
    
    console.log('Suspending user:', userId, reason);
  }
}

// Mock data generator
function generateMockReports(): Report[] {
  const reports: Report[] = [];
  const now = new Date();

  const mockData = [
    {
      animalType: 'dog' as const,
      sex: 'male' as const,
      color: 'Brown',
      location: 'Near main gate',
      reporter: 'Xyryil Jay Taneo',
      email: 'xyryjay@gmail.com',
      submitted: 300,
      warnings: 3
    },
    {
      animalType: 'cat' as const,
      sex: 'female' as const,
      color: 'Black',
      location: 'Behind cafeteria',
      reporter: 'Maria Santos',
      email: 'maria.santos@vsu.edu.ph',
      submitted: 25,
      warnings: 0
    },
    {
      animalType: 'dog' as const,
      sex: 'unknown' as const,
      color: 'White',
      location: 'Library area',
      reporter: 'Juan Dela Cruz',
      email: 'juan.cruz@vsu.edu.ph',
      submitted: 10,
      warnings: 1
    },
  ];

  mockData.forEach((data, index) => {
    const date = new Date(now);
    date.setHours(date.getHours() - index * 2);
    
    reports.push({
      id: `13409284-${index}`,
      animalType: data.animalType,
      sex: data.sex,
      color: data.color,
      bodyConditionScore: Math.floor(Math.random() * 4) + 3, // 3-6
      eyeProblems: Math.random() > 0.7,
      skinProblems: Math.random() > 0.6,
      photoUrl: '/dog-placeholder.jpg',
      latitude: 10.746183 + (Math.random() - 0.5) * 0.01,
      longitude: 124.795011 + (Math.random() - 0.5) * 0.01,
      locationDescription: data.location,
      spottedDate: date.toISOString().split('T')[0],
      spottedTime: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
      reportedBy: data.reporter,
      reporterEmail: data.email,
      reportsSubmitted: data.submitted,
      warnings: data.warnings,
      additionalNotes: index === 0 ? 'Looks hungry and friendly' : undefined,
      status: 'pending',
      createdAt: date.toISOString(),
    });
  });

  return reports;
}

// Factory function
export function getReportService(): ReportService {
  const USE_SUPABASE = false; // Toggle when backend is ready
  return USE_SUPABASE ? new SupabaseReportService() : new MockReportService();
}
