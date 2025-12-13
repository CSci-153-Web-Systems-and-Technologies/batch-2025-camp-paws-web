# Admin Map - Backend Integration Guide

## Current State
The map currently uses **mock data** for development. Backend integration is prepared and ready to activate.

## Quick Switch to Supabase

### Step 1: Toggle the Service
In `services/ReportService.ts`, change:
```typescript
const USE_SUPABASE = false; // Change to true
```

### Step 2: Ensure Supabase Client Exists
Make sure you have a Supabase client at:
```
/lib/supabase/client.ts
```

### Step 3: Database Schema Required
The code expects a `stray_animal_reports` table with these columns:
- `id` (UUID)
- `latitude` (NUMERIC)
- `longitude` (NUMERIC)
- `animal_type` (TEXT: 'dog' | 'cat')
- `spotted_date` (DATE)
- `spotted_time` (TIME)
- `status` (TEXT: 'pending' | 'verified')
- `location_description` (TEXT)
- `photo_url` (TEXT, nullable)
- `user_id` (UUID, foreign key to users)

### Step 4: User Join (Optional)
To get reporter names, ensure you have a `users` table with:
- `id` (UUID)
- `full_name` (TEXT)

## Architecture

### Service Layer Pattern
```
AdminMapRefactored (UI)
    ↓
getReportService() (Factory)
    ↓
MockReportService OR SupabaseReportService
    ↓
Return AnimalReport[]
```

### Benefits
✅ **Easy Testing**: Mock data without backend  
✅ **Clean Separation**: UI doesn't know where data comes from  
✅ **Type Safety**: Consistent AnimalReport interface  
✅ **Error Handling**: Built-in loading/error states  
✅ **Future Proof**: Easy to add caching, pagination, etc.

## Data Flow

### Current (Mock)
1. Component mounts
2. `getReportService()` returns `MockReportService`
3. Generates ~31 fake reports
4. Displays on map

### Future (Supabase)
1. Component mounts
2. `getReportService()` returns `SupabaseReportService`
3. Fetches from `stray_animal_reports` table
4. Transforms snake_case → camelCase
5. Displays on map

## Filtering

Reports are filtered **client-side** using `ReportDateFilter`:
- **Today**: Reports from today's date
- **Yesterday**: Reports from yesterday only
- **This Week**: Last 7 days
- **This Month**: Last 30 days

All filtering happens in browser for instant response.

## Notes

- Rejected reports are **excluded** from queries (they should be deleted)
- Photos are loaded from `photo_url` using Next.js Image
- Map uses same VSU boundary as user report component
- All dates are in ISO format (YYYY-MM-DD)
- Times are in 24-hour format (HH:MM)

## Testing Backend Integration

1. Set `USE_SUPABASE = true`
2. Add console.log in SupabaseReportService
3. Check browser console for query results
4. Verify data transformation
5. Test loading/error states

## Future Enhancements

Possible additions when backend is ready:
- Real-time subscriptions for live updates
- Report status updates from map
- Filter by animal type
- Export filtered data
- Report clustering for dense areas
