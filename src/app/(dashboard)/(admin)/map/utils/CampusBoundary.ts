// Single Responsibility: Campus boundary configuration and validation
import { CampusBoundary } from '../types/MapTypes';

// Visayas State University exact campus boundary points
export const VSU_CAMPUS_BOUNDARY: CampusBoundary = {
  boundaryPoints: [
    [10.739297109417734, 124.78954418752326],
    [10.745093765187544, 124.78655704607576],
    [10.748908580850467, 124.79208701275739],
    [10.74982855084182, 124.7944559685733],
    [10.751032694776626, 124.79582456702671],
    [10.750142115575805, 124.79799860535354],
    [10.749993039272425, 124.79826472281272],
    [10.744037371313935, 124.80597500444362],
    [10.741857649512134, 124.80194507540114],
  ],
  center: { lat: 10.746183403128184, lng: 124.79501145000867 }
};

export class CampusBoundaryValidator {
  // Point-in-polygon algorithm (ray casting)
  static isWithinBounds(lat: number, lng: number, boundary: CampusBoundary): boolean {
    let inside = false;
    const polygon = boundary.boundaryPoints;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [yi, xi] = polygon[i];
      const [yj, xj] = polygon[j];
      
      if (((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    
    return inside;
  }
}
