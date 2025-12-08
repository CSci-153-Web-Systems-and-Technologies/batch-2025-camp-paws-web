// Single Responsibility: Filter reports by time period
import { AnimalReport, TimeFilter } from '../types/MapTypes';

export class ReportDateFilter {
  static filterByTimeRange(reports: AnimalReport[], filter: TimeFilter): AnimalReport[] {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filter) {
      case 'today':
        return reports.filter(report => {
          const reportDate = new Date(report.spottedDate);
          return reportDate >= startOfToday;
        });
      
      case 'yesterday':
        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        return reports.filter(report => {
          const reportDate = new Date(report.spottedDate);
          return reportDate >= startOfYesterday && reportDate < startOfToday;
        });
      
      case 'week':
        const oneWeekAgo = new Date(startOfToday);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return reports.filter(report => {
          const reportDate = new Date(report.spottedDate);
          return reportDate >= oneWeekAgo;
        });
      
      case 'month':
        const oneMonthAgo = new Date(startOfToday);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return reports.filter(report => {
          const reportDate = new Date(report.spottedDate);
          return reportDate >= oneMonthAgo;
        });
      
      default:
        return reports;
    }
  }

  static getReportCounts(reports: AnimalReport[]): Record<TimeFilter, number> {
    return {
      today: this.filterByTimeRange(reports, 'today').length,
      yesterday: this.filterByTimeRange(reports, 'yesterday').length,
      week: this.filterByTimeRange(reports, 'week').length,
      month: this.filterByTimeRange(reports, 'month').length,
    };
  }
}
