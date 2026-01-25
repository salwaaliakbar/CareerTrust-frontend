# Debugging Guide for Employer Dashboard Jobs Issue

## Problem

Posted jobs are not appearing in the employer dashboard.

## Root Cause

The dashboard was using `user.id` (Clerk ID - a string) instead of `employerId` (database integer) to fetch jobs.

## Fix Applied

Updated dashboard to:

1. Get `employerId` from `user.unsafeMetadata.employerId` or default to `1`
2. Pass `employerId` to `fetchEmployerJobs()` instead of `user.id`

## How to Debug

### Step 1: Check Browser Console

Open browser DevTools and look for these logs:

```
[Dashboard] Using employerId: 1
[Dashboard] Company status: { hasCompany: true, companyName: "...", needsSetup: false }
[Dashboard] Fetching jobs for employerId: 1
[Employer Service] Fetching employer jobs: http://localhost:4000/api/employer/jobs?employerId=1
[Employer Service] Response status: 200
[Employer Service] Successfully fetched jobs: X
[Dashboard] Fetched jobs: [...]
```

### Step 2: Check Backend Logs

In your backend terminal, look for:

```
[INFO] Fetching employer jobs {"employerId":"1"}
[INFO] Employer jobs fetched successfully
```

### Step 3: Verify Database

Check if jobs exist in database:

```sql
-- Check employer profile
SELECT * FROM employer_profiles WHERE "employerId" = 1;

-- Check company
SELECT * FROM companies WHERE "employerId" = 1;

-- Check jobs
SELECT * FROM jobs WHERE "employerId" = 1;
```

### Step 4: Test Job Creation

1. Go to `/employer/post-job`
2. Fill out the form
3. Check console for: `employerId: 1` in the request
4. Backend should return created job with `employerId: 1`

### Step 5: Verify Job Appears

1. Refresh dashboard
2. Check console logs
3. Jobs with matching `employerId` should appear

## Common Issues

### Issue: employerId is undefined or null

**Solution:**

- Currently hardcoded to `1` as fallback
- In production, set `user.unsafeMetadata.employerId` during signup
- Update in Clerk dashboard or during user creation

### Issue: Jobs exist but don't appear

**Possible causes:**

1. Wrong employerId being used
2. Jobs created with different employerId
3. Company profile not linked correctly

**Check:**

```typescript
// In browser console:
console.log("User:", user);
console.log("EmployerId:", user.unsafeMetadata?.employerId);
```

### Issue: "Employer profile not found"

**Solution:**

- Create employer profile in database:

```sql
INSERT INTO employer_profiles ("userId", "companyName", "hasCompany")
VALUES (1, NULL, false);
```

## Quick Fix for Testing

If you need to test immediately and employerId is not set:

1. **Option A: Use hardcoded ID (current setup)**
   - All jobs will use `employerId = 1`
   - Works for single employer testing

2. **Option B: Set in Clerk metadata**
   - Go to Clerk Dashboard
   - Find your user
   - Add unsafe metadata: `{ "employerId": 1, "role": "employer" }`

3. **Option C: Create during signup**
   - Update signup flow to create employer profile
   - Set employerId in user metadata

## Expected Flow

```
1. Employer logs in
2. Dashboard loads
3. Get employerId from user.unsafeMetadata (or default to 1)
4. Call GET /api/employer/jobs?employerId=1
5. Backend queries: SELECT * FROM jobs WHERE employerId = 1
6. Return jobs array
7. Display in dashboard
```

## Testing Checklist

- [ ] Check browser console for employerId value
- [ ] Verify API call uses correct employerId
- [ ] Check backend receives correct employerId
- [ ] Verify database has jobs with matching employerId
- [ ] Confirm jobs array is returned from API
- [ ] Check jobs are set in React state
- [ ] Verify jobs render in UI

## Need More Help?

If jobs still don't appear:

1. Share browser console logs
2. Share backend terminal logs
3. Share SQL query result from jobs table
4. Check Network tab in DevTools for API response
