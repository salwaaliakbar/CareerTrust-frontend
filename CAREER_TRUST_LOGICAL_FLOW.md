# CareerTrust Logical Architecture & Flow

## 1. JOB RECOMMENDATION STRUCTURE

### Current State vs. Proposed State

**PROPOSED ARCHITECTURE:**

```
Job Matching System
├── All Jobs (Database)
│   ├── Jobs with match% calculated (0-100%)
│   └── Available to all users
│
├── **Recommended Jobs (Filtered Subset)**
│   ├── ONLY jobs with match% > 50%
│   ├── Separate component: `<RecommendedJobsSection />`
│   └── Shown in Dashboard ONLY (not in /jobs page)
│
└── Regular Jobs List (/jobs page)
    └── All jobs shown BUT sorted by relevance if user logged in
```

---

## 2. JOB RECOMMENDATION FLOW

### Data Flow Diagram:

```
Jobseeker Profile + Resume
        ↓
   [Match Algorithm]
        ↓
   Calculate Match % (0-100)
        ↓
    ├─ Match > 50% → Recommended Jobs (Dashboard only)
    └─ Match ≤ 50% → Search in /jobs with match% visible
```

---

## 3. COMPONENT STRUCTURE

### New Component - RecommendedJobsSection

Create: `components/jobseekerDashboard/RecommendedJobsSection.tsx`

```typescript
// Shows:
// - Top 5-10 recommended jobs (>50% match)
// - Match percentage badge on each job
// - "View All Recommendations" button → redirects to /jobs with filter
// - Empty state if no recommendations yet
```

### Modified Components:

1. **Dashboard.tsx** 
   - Add stat card for "Job Recommendations" count
   - Include `<RecommendedJobsSection />` component
   - Show only recommended jobs, NOT all jobs

2. **JobsClient.tsx** (/jobs page)
   - Show ALL jobs with match% badges
   - Filter option to show "Recommended Only" (match > 50%)
   - Keep search/filter functionality

---

## 4. APPLICATION STATUS DEFINITIONS

### Current Statuses (CORRECT):

```typescript
export type ApplicationStatus =
  | "pending"        // Just applied, awaiting company response
  | "reviewing"      // Company is reviewing your application
  | "shortlisted"    // You passed initial screening
  | "interviewed"    // You've had an interview with the company
  | "rejected"       // Company rejected your application
  | "hired"          // 🎯 OFFER ACCEPTED - Job is yours!
```

### NOT USED:
- "accepted offer" - Use `"hired"` instead
- "pending application" - Use `"pending"` instead

---

## 5. DASHBOARD STATISTICS (LOGICAL MAPPING)

### Current Mock Data Issues → Corrections:

```typescript
interface DashboardStats {
  // ✅ CORRECT
  totalApplications: number;        // All applications submitted
  acceptedApplications: number;     // Count of "hired" status
  pendingApplications: number;      // Count of "pending" + "reviewing" status
  profileViews: number;             // Times profile viewed by employers
  verifiedRecords: number;          // Employment passport verified records
  
  // ❌ REMOVE/RENAME
  jobsRecommended: number;          // ✅ KEEP - recommended jobs count
}
```

### Dashboard Status Breakdown:

```
Statistics Section:
├── Applications Submitted (24) → totalApplications
├── Accepted Offers (3) → applications with status === "hired"
├── Pending Applications (8) → applications with status === "pending" OR "reviewing"
├── Profile Views (156) → profileViews from backend
├── Recommended Jobs (47) → jobs with match > 50%
└── Verified Records (5) → verifiedRecords

Recent Applications Section:
├── Shows all applications regardless of status
└── Color-coded by status:
    - pending → amber/yellow
    - reviewing → blue
    - shortlisted → purple
    - interviewed → violet
    - hired → emerald/green ✅
    - rejected → red ❌
```

---

## 6. JOBS PAGE VS. DASHBOARD

### /jobs Page (All Users Can Access)
- Shows: **ALL jobs** from database
- Displays: Match% if user logged in
- Filters: Search, location, salary, date, rating
- Sort options: Relevance (if logged in), newest
- INCLUDES: Recommended jobs (all jobs that match criteria)

### Dashboard (Logged In Users Only)
- Shows: **Recommended Jobs ONLY** (>50% match)
- Displays: Top recommended with match% and brief details
- "View All" button → Goes to /jobs with filter
- NEW COMPONENT: `<RecommendedJobsSection />`
- Statistics: Shows recommendation count

---

## 7. RECOMMENDED JOBS SHOULD APPEAR...

### YES - In Dashboard
- Primary recommendation section
- Quick action card to explore more

### YES - In /jobs Page
- But as part of "ALL jobs" list
- Marked with "Recommended" badge when user logged in
- Can be filtered by match% threshold

### NOT - As separate new jobs
- They are existing jobs in database
- Just filtered by match score

---

## 8. UPDATED DASHBOARD LOGIC

### Before User Profile is Complete:
```
- No recommended jobs (can't calculate match)
- Show empty state: "Complete your profile to see recommendations"
- Stats show 0 for recommended jobs
```

### After Profile + Resume Added:
```
- Calculate match for all jobs
- Show recommended jobs (>50%)
- Update stats with real numbers
- Show recent applications (if any)
```

---

## 9. IMPLEMENTATION CHECKLIST

- [ ] **Types**: Ensure ApplicationStatus only uses correct values
- [ ] **Query**: Create Redux slice for recommended jobs
- [ ] **Component**: Create RecommendedJobsSection.tsx
- [ ] **Dashboard**: Update with real stats from backend
- [ ] **Jobs Page**: Add match% display & filter by threshold
- [ ] **Status Colors**: Implement consistent color mapping
- [ ] **API**: Ensure recommendations endpoint returns match%
- [ ] **Redux**: Store recommended jobs separately from all jobs

---

## 10. SAMPLE STATUS FLOW

```
Jobseeker applies for job
    ↓
Status: "pending" (awaiting company)
    ↓
Company views their profile
    ↓
Status: "reviewing" (company reviewing application)
    ↓
Company shortlists candidates
    ↓
Status: "shortlisted" (congrats!)
    ↓
Company schedules interview
    ↓
Status: "interviewed" (you met the team)
    ↓
├─ Company rejects → Status: "rejected"
└─ Company offers job → Status: "hired" 🎯

NOTE: "hired" means offer is ACCEPTED, not just offered
```

---

## Summary: What Gets Shown Where?

| Where | What | Why |
|-------|------|-----|
| Dashboard | Recommended jobs (>50%) | Quick access to best matches |
| Dashboard Stats | Job recommendations count | Shows system is working |
| /jobs | ALL jobs with match% | Users can explore everything |
| Recent Applications | All applications (any status) | Track application progress |
| Status Badges | pending, reviewing, shortlisted, interviewed, hired, rejected | User understands where they are |
| Offer Acceptance | Show jobs where status = "hired" | Clear offer acceptance indicator |

