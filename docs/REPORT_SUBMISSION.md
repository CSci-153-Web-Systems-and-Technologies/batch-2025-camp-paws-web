# Report Submission Feature

## Overview
Users can now submit stray animal reports with photos, physical details, and location information directly to the Supabase database.

## Setup Requirements

### 1. Supabase Storage Bucket
Create a storage bucket named `report-photos`:

```sql
-- In Supabase Storage, create bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('report-photos', 'report-photos', true);

-- Set up RLS policies
CREATE POLICY "Users can upload their own photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'report-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Photos are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'report-photos');
```

### 2. Database Policies (Required - Add if missing)
Based on your current policies, you may need to add INSERT policies for health condition junction tables:

```sql
-- Allow authenticated users to insert eye conditions for their reports
CREATE POLICY "Users can add eye conditions to their reports"
ON report_eye_conditions FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM stray_animal_reports 
    WHERE id = report_id AND user_id = auth.uid()
  )
);

-- Allow authenticated users to insert skin conditions for their reports
CREATE POLICY "Users can add skin conditions to their reports"
ON report_skin_conditions FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM stray_animal_reports 
    WHERE id = report_id AND user_id = auth.uid()
  )
);

-- Allow authenticated users to insert gait conditions for their reports
CREATE POLICY "Users can add gait conditions to their reports"
ON report_gait_conditions FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM stray_animal_reports 
    WHERE id = report_id AND user_id = auth.uid()
  )
);
```

### 3. Database Function (Optional - for report count)
Add this function to increment user report counts:

```sql
CREATE OR REPLACE FUNCTION increment(
  table_name text,
  row_id uuid,
  column_name text
)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE %I SET %I = %I + 1 WHERE id = $1', table_name, column_name, column_name)
  USING row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## How It Works

### Step 1: Photo Upload
- User selects a photo
- Photo is validated (max 5MB, jpg/png only)
- Preview is shown

### Step 2: Physical Details
- Animal type (cat/dog)
- Sex, collar status
- Color pattern and primary color
- Body condition score
- Health problems (skin, eye, gait)
- Additional notes

### Step 3: Location & Time
- Date and time of sighting
- Location on map (click to select)
- Location description
- Submits the report

### Backend Flow
1. Photo is uploaded to Supabase Storage (`report-photos` bucket)
2. Public URL is generated
3. Main report is inserted into `stray_animal_reports` table
4. Health conditions are inserted into junction tables:
   - `report_skin_conditions`
   - `report_eye_conditions`
   - `report_gait_conditions`
5. User's `reports_submitted` count is incremented
6. User is redirected to dashboard

## Files Modified

### New Files
- `/src/app/(dashboard)/(user)/report/actions/submitReport.ts` - Server actions for submission
  - `submitReport()` - Main submission function
  - `uploadReportPhoto()` - Photo upload to Supabase Storage

### Modified Files
- `/src/app/(dashboard)/(user)/report/page.tsx` - Added submission logic
- `/src/app/(dashboard)/(user)/report/components/LocationTime/LocationTimeRefactored.tsx` - Added loading state
- `/src/app/(dashboard)/(user)/report/components/LocationTime/types/LocationTimeTypes.ts` - Added `isSubmitting` prop

## Data Mapping

### Frontend → Database Field Mapping
- `animalType` → `animal_type_id` (cat/dog)
- `sex` → `sex_id` (male/female)
- `collar` → `collar_status_id` (with-collar/without-collar)
- `colorPattern` → `color_pattern_id`
- `primaryColor` → `primary_color_id`
- `bodyConditionScore` → `body_condition_score`
- `notes` → `additional_notes`
- `date` → `spotted_date`
- `time` → `spotted_time`
- `location.lat` → `latitude`
- `location.lng` → `longitude`
- `locationDescription` → `location_description`

### Health Conditions
Physical problems are categorized and stored in separate junction tables:
- Problems starting with `skin-` → `report_skin_conditions`
- Problems starting with `eye-` → `report_eye_conditions`
- Problems starting with `gait-` → `report_gait_conditions`

## Usage

```tsx
// The form handles everything automatically
// User fills out 3 steps and clicks "Submit Report"
// On success, redirects to /user-dashboard
// On error, shows toast notification
```

## Error Handling
- Photo upload failures
- Network errors
- Database constraint violations
- Invalid data
- All errors show user-friendly toast messages

## Toast Notifications
- Success: "Report submitted successfully!"
- Error: Specific error message from server
- Redirects to dashboard after 1.5 seconds on success

## Security
- User must be authenticated (enforced by middleware)
- Photos are uploaded to user-specific folders (`{user_id}/{timestamp}.ext`)
- Rate limiting: 20 reports per hour per user (middleware)
- CSRF protection enabled (middleware)

## Current Database Policies

The following policies are already in place and support report submission:

### Reports Table (`stray_animal_reports`)
✅ **Authenticated users can create a report** - `INSERT` with `auth.uid() = user_id`  
✅ **Authenticated users can read reports** - `SELECT` for all authenticated users  
✅ **Users can update their own reports** - `UPDATE` where `auth.uid() = user_id`  
✅ **Admins can update and verify all reports** - `UPDATE` for admin role

### Health Condition Tables
✅ **Enable read access** - `SELECT` for public on:
  - `report_eye_conditions`
  - `report_skin_conditions`
  - `report_gait_conditions`

⚠️ **Missing INSERT policies** - Need to add INSERT policies for health condition tables (see Setup Requirements above)

### Reference Tables (Read-only)
✅ All reference tables have public `SELECT` access:
  - `animal_types`, `sexes`, `collar_statuses`
  - `color_patterns`, `primary_colors`
  - `cat_body_condition_scores`, `dog_body_condition_scores`
  - `skin_condition_types`, `eye_condition_types`, `gait_condition_types`

### Users Table
✅ **Users can view their own profile** - `SELECT` where `auth.uid() = id`  
✅ **Users can update their own profile** - `UPDATE` where `auth.uid() = id`  
✅ **Service role can insert users** - For auth trigger  
✅ **Admins can view and update all users** - For user management

## Troubleshooting

### Issue: "Failed to insert health conditions"
**Solution**: Add the missing INSERT policies for junction tables (see Setup Requirements section 2)

### Issue: "Photo upload failed"  
**Solution**: Ensure `report-photos` bucket exists and has correct RLS policies (see Setup Requirements section 1)

### Issue: "Report count not updating"
**Solution**: Add the `increment()` function (see Setup Requirements section 3)

### Issue: "Permission denied"
**Solution**: Check that user is authenticated and RLS policies are properly configured

## POLICIES
| policy_name                                       | tablename                 | schema_name | permissive | command | roles           | using_condition                                                                                                           | with_check                                                                                                                 |
| ------------------------------------------------- | ------------------------- | ----------- | ---------- | ------- | --------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| All authenticated users can view animal groups    | animal_groups             | public      | PERMISSIVE | SELECT  | {authenticated} | true                                                                                                                      | null                                                                                                                       |
| Group creator can manage their own group          | animal_groups             | public      | PERMISSIVE | ALL     | {authenticated} | (auth.uid() = created_by)                                                                                                 | (auth.uid() = created_by)                                                                                                  |
| Enable read access for authenticated users        | animal_types              | public      | PERMISSIVE | SELECT  | {public}        | true                                                                                                                      | null                                                                                                                       |
| Enable read access for authenticated users        | cat_body_condition_scores | public      | PERMISSIVE | SELECT  | {public}        | true                                                                                                                      | null                                                                                                                       |
| Enable read access for authenticated users        | collar_statuses           | public      | PERMISSIVE | SELECT  | {public}        | true                                                                                                                      | null                                                                                                                       |
| Enable read access for authenticated users        | color_patterns            | public      | PERMISSIVE | SELECT  | {public}        | true                                                                                                                      | null                                                                                                                       |
| Enable read access for authenticated users        | dog_body_condition_scores | public      | PERMISSIVE | SELECT  | {public}        | true                                                                                                                      | null                                                                                                                       |
| Enable read access for authenticated users        | eye_condition_types       | public      | PERMISSIVE | SELECT  | {public}        | true                                                                                                                      | null                                                                                                                       |
| Enable read access for authenticated users        | gait_condition_types      | public      | PERMISSIVE | SELECT  | {public}        | true                                                                                                                      | null                                                                                                                       |
| All authenticated users can view report groupings | group_reports             | public      | PERMISSIVE | SELECT  | {authenticated} | true                                                                                                                      | null                                                                                                                       |
| Enable read access for authenticated users        | primary_colors            | public      | PERMISSIVE | SELECT  | {public}        | true                                                                                                                      | null                                                                                                                       |
| Enable read access for authenticated users        | report_eye_conditions     | public      | PERMISSIVE | SELECT  | {public}        | true                                                                                                                      | null                                                                                                                       |
| Enable read access for authenticated users        | report_gait_conditions    | public      | PERMISSIVE | SELECT  | {public}        | true                                                                                                                      | null                                                                                                                       |
| Enable read access for authenticated users        | report_skin_conditions    | public      | PERMISSIVE | SELECT  | {public}        | true                                                                                                                      | null                                                                                                                       |
| Enable read access for authenticated users        | sexes                     | public      | PERMISSIVE | SELECT  | {public}        | true                                                                                                                      | null                                                                                                                       |
| Enable read access for authenticated users        | skin_condition_types      | public      | PERMISSIVE | SELECT  | {public}        | true                                                                                                                      | null                                                                                                                       |
| Admins can update and verify all reports          | stray_animal_reports      | public      | PERMISSIVE | UPDATE  | {authenticated} | ((( SELECT users.role
   FROM users
  WHERE (users.id = auth.uid())))::text = 'admin'::text)                              | null                                                                                                                       |
| Authenticated users can create a report           | stray_animal_reports      | public      | PERMISSIVE | INSERT  | {authenticated} | null                                                                                                                      | (auth.uid() = user_id)                                                                                                     |
| Authenticated users can read reports              | stray_animal_reports      | public      | PERMISSIVE | SELECT  | {authenticated} | true                                                                                                                      | null                                                                                                                       |
| Users can update their own reports                | stray_animal_reports      | public      | PERMISSIVE | UPDATE  | {authenticated} | (auth.uid() = user_id)                                                                                                    | (auth.uid() = user_id)                                                                                                     |
| Admins can create user actions                    | user_actions              | public      | PERMISSIVE | INSERT  | {authenticated} | null                                                                                                                      | (((( SELECT users.role
   FROM users
  WHERE (users.id = auth.uid())))::text = 'admin'::text) AND (admin_id = auth.uid())) |
| Admins can view all user actions                  | user_actions              | public      | PERMISSIVE | SELECT  | {authenticated} | ((( SELECT users.role
   FROM users
  WHERE (users.id = auth.uid())))::text = 'admin'::text)                              | null                                                                                                                       |
| Admins can update any user profile (moderation)   | users                     | public      | PERMISSIVE | UPDATE  | {authenticated} | ((( SELECT users_1.role
   FROM users users_1
  WHERE (users_1.id = auth.uid())))::text = 'admin'::text)                  | ((( SELECT users_1.role
   FROM users users_1
  WHERE (users_1.id = auth.uid())))::text = 'admin'::text)                   |
| Admins can update users                           | users                     | public      | PERMISSIVE | UPDATE  | {public}        | (EXISTS ( SELECT 1
   FROM users users_1
  WHERE ((users_1.id = auth.uid()) AND ((users_1.role)::text = 'admin'::text)))) | null                                                                                                                       |
| Admins can view all user profiles                 | users                     | public      | PERMISSIVE | SELECT  | {authenticated} | ((( SELECT users_1.role
   FROM users users_1
  WHERE (users_1.id = auth.uid())))::text = 'admin'::text)                  | null                                                                                                                       |
| Admins can view all users                         | users                     | public      | PERMISSIVE | SELECT  | {public}        | (EXISTS ( SELECT 1
   FROM users users_1
  WHERE ((users_1.id = auth.uid()) AND ((users_1.role)::text = 'admin'::text)))) | null                                                                                                                       |
| Service role can insert users                     | users                     | public      | PERMISSIVE | INSERT  | {public}        | null                                                                                                                      | true                                                                                                                       |
| Users can update their own profile                | users                     | public      | PERMISSIVE | UPDATE  | {authenticated} | (auth.uid() = id)                                                                                                         | (auth.uid() = id)                                                                                                          |
| Users can view their own data                     | users                     | public      | PERMISSIVE | SELECT  | {public}        | (auth.uid() = id)                                                                                                         | null                                                                                                                       |
| Users can view their own profile                  | users                     | public      | PERMISSIVE | SELECT  | {authenticated} | (auth.uid() = id)                                                                                                         | null                                                                                                                       |