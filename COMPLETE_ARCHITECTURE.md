# CareerTrust Complete Logical Architecture

## System Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         JOBSEEKER JOURNEY                            │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│ 1. Create Profile│
│ + Add Resume     │  ──→  Algorithm calculates match % for ALL jobs
└──────────────────┘        (0-100%)
        ↓
┌──────────────────────────────────────────┐
│         2. Dashboard (Home)              │  ← Personalized view
├──────────────────────────────────────────┤
│ • Stats: Total apps, Offers, Under Review│
│ • Recommended Jobs (>50% match) ← NEW    │
│ • Recent Applications (all statuses)     │
│ • Quick Actions (Browse, Profile, etc)  │
└──────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────┐
│    3. Browse Jobs Page (/jobs)           │  ← All jobs available
├──────────────────────────────────────────┤
│ • Search & Filters                       │
│ • All jobs with match% (if logged in)    │
│ • Filter: Recommended Only (>50%)        │
│ • Sort: By Relevance (highest match)     │
│ • Apply to Job                           │
└──────────────────────────────────────────┘
        ↓
┌──────────────────────────────────────────┐
│    4. Track Application Status           │
├──────────────────────────────────────────┤
│ pending → reviewing → shortlisted →      │
│ interviewed → hired/rejected             │
└──────────────────────────────────────────┘
```

---

## Data Flow Architecture

```
BACKEND DATABASE
├─ Users (Profile + Skills + Experience)
├─ Jobs (All available positions)
├─ Applications (Tracking user applications)
├─ Job Recommendations (Match scores)
├─ Employment Passport (Verified records)
└─ Employer Portal (For company actions)

                 ↓ API Calls ↓

FRONTEND (Redux Store)
├─ jobs (all jobs + match%)
├─ applications (user's applications + status)
├─ profile (user's profile data)
├─ recommendations (recommended jobs list)
└─ stats (dashboard statistics)

                 ↓ Components ↓

UI LAYER
├─ Dashboard (Shows personalized view)
├─ RecommendedJobsSection (>50% match only)
├─ JobsClient (All jobs, filterable)
├─ ApplicationStatus (Track applications)
└─ Recent Applications (List with status)
```

---

## Component Dependency Tree

```
Dashboard (Main landing page)
├─ StatCards (Stats display)
│  ├─ Total Applications
│  ├─ Accepted Offers (hired status)
│  ├─ Under Review (pending + reviewing)
│  ├─ Profile Views
│  ├─ Recommended Jobs (>50%)
│  └─ Verified Records
├─ RecommendedJobsSection ← NEW COMPONENT
│  ├─ Filters: match > 50%
│  ├─ Sorts: highest match first
│  ├─ Shows: Top 6 jobs
│  └─ Action: View All → /jobs?filter=recommended
├─ RecentApplications
│  ├─ Lists: Recent apps (all statuses)
│  ├─ StatusBadge (color-coded)
│  └─ Link: View All

/jobs (Browse all jobs)
├─ SearchBar
├─ FilterPanel
│  ├─ Location, Salary, Rating, Date
│  ├─ Recommended Only Toggle ← NEW
│  └─ Sort Options (Relevance, Date, etc)
├─ JobsList
│  └─ JobCard (each job)
│     ├─ Title, Company, Location
│     ├─ Match% Badge (if logged in + >50%)
│     ├─ "Recommended" Label (if >50%)
│     └─ Apply Button

/jobseeker/profile (Profile management)
├─ Profile Update
├─ Upload Resume
└─ Triggers Recommendation Calculation
   └─ Updates match% in Redux
```

---

## State Management (Redux)

```typescript
redux/
├─ jobsSlice
│  ├─ items: Job[]
│  │  └─ Each job includes "match" (0-100)
│  └─ loading: boolean
│
├─ applicationsSlice (jobseeker)
│  ├─ items: JobApplication[]
│  │  └─ Each app has status: "pending" | "reviewing" | ... | "hired"
│  └─ count: number
│
└─ profileSlice
   ├─ data: ProfileData
   ├─ skills: string[]
   └─ resume: string (URL)
```

---

## Statistics Logic (Dashboard)

```typescript
const calculateStats = (applications[], jobs[]) => {
  return {
    // Total count of all applications submitted
    totalApplications: applications.length
    
    // Only applications with status === "hired"
    acceptedApplications: applications
      .filter(app => app.status === "hired")
      .length
    
    // Applications waiting for company response
    // Includes "pending" (just sent) and "reviewing" (under review)
    pendingApplications: applications
      .filter(app => 
        app.status === "pending" || 
        app.status === "reviewing"
      )
      .length
    
    // From backend user profile
    profileViews: userProfile.viewsCount
    
    // ONLY jobs with match > 50%
    jobsRecommended: jobs
      .filter(job => job.match > 50)
      .length
    
    // From employment passport API
    verifiedRecords: employmentPassport.count
  }
}
```

---

## Status Color Mapping

```
Status        | Color      | Hex Code | Badge Style
──────────────┼───────────┼──────────┼─────────────
pending       | Amber     | #FCD34D  | Soft amber
reviewing     | Blue      | #93C5FD  | Soft blue
shortlisted   | Purple    | #D8B4FE  | Soft purple
interviewed   | Violet    | #DDD6FE  | Soft violet
hired         | Emerald   | #86EFAC  | Soft emerald ✅
rejected      | Red       | #FCA5A5  | Soft red ❌
```

---

## Recommendation Algorithm Flow

```
┌─────────────────────────────────┐
│ User Profile Data               │
├─────────────────────────────────┤
│ • Skills                        │
│ • Experience (years)            │
│ • Education                     │
│ • Preferred Roles/Locations     │
│ • Resume Keywords               │
└────────────┬────────────────────┘
             │
             ↓ MATCH CALCULATION
             
┌────────────────────────────────────┐
│ For EACH Job in Database           │
├────────────────────────────────────┤
│ • Match job skills ← user skills   │
│ • Match experience level           │
│ • Match location preferences       │
│ • Match job type                   │
│ • Match salary expectations        │
│                                    │
│ Calculate Overall Match %          │
│ (0-100% based on criteria)         │
└────────────┬───────────────────────┘
             │
             ↓
        ┌────────────┐
        │ Match > 50%│
        └────┬───────┘
             │
    ╔════════╩════════╗
    ↓ YES            ↓ NO
 Show in          Show in
Dashboard       /jobs with
Recommended      lower %
Section

```

---

## Key Decision Points

### ❓ Should recommended jobs appear in /jobs?
✅ **YES** - They are part of "all jobs"
- They're filtered from the same pool
- Users can browse all jobs
- "Recommended" is just a tag/badge

### ❓ Should I create a separate component for recommendations?
✅ **YES - RecommendedJobsSection**
- Specific to Dashboard
- Shows only >50% match
- Limited to top 6-8 jobs
- "View All" redirects to /jobs

### ❓ What does "accepted offer" mean?
✅ **Use "hired" status**
- When user accepts job offer
- Final positive status
- Shows in "Accepted Offers" count
- Congratulations message shown

### ❓ What does "pending application" mean?
✅ **Use "pending" + "reviewing" statuses**
- "pending" = just submitted, company hasn't looked yet
- "reviewing" = company is actively reviewing
- Both count as "Under Review" for dashboard
- Different states for backend logic

### ❓ Should match % be visible to all users?
✅ **Only to logged-in users**
- Not logged in = no match display
- Logged in = match % on every job
- "Recommended" badge only if >50%

---

## Implementation Phases

### Phase 1: Foundation ✅ (Current)
- [x] Create ApplicationStatus enum (6 statuses)
- [x] Create RecommendedJobsSection component
- [x] Update Dashboard stats logic
- [x] Update status styling

### Phase 2: Data Integration (Next)
- [ ] Fetch real applications data
- [ ] Fetch real profile stats
- [ ] Fetch real verified records count
- [ ] Connect recommendation API

### Phase 3: Jobs Page Enhancements (Next)
- [ ] Add "Recommended Only" filter toggle
- [ ] Display match % badges
- [ ] Update sort options
- [ ] Handle URL filters (?filter=recommended)

### Phase 4: Employer Portal (Later)
- [ ] Allow employers to update application status
- [ ] Add notes/feedback to applications
- [ ] Send notifications on status changes
- [ ] Track interview schedules

### Phase 5: Advanced Features (Future)
- [ ] Detailed match reason (which skills matched)
- [ ] Save/wishlist jobs
- [ ] Timeline view of application journey
- [ ] Email digests of new recommendations
- [ ] Match score explanations

---

## Summary

```
LOGICAL FLOW:

User creates profile
    ↓
System calculates match % for all jobs (0-100%)
    ↓
┌─ Recommended (>50%) → Dashboard + /jobs badge
│
└─ Regular (≤50%)     → /jobs only

Dashboard shows:
• Personalized recommendations (>50%)
• Statistics (real counts from applications/jobs)
• Recent applications with status tracking

/jobs shows:
• ALL jobs with match% (logged in users)
• Filter for recommended only
• Sort by relevance
• Apply functionality

Application Lifecycle:
pending → reviewing → shortlisted → interviewed → hired/rejected

Status=hired counts as "Accepted Offer" in dashboard
```

---

## Files Reference

| File | Purpose |
|------|---------|
| CAREER_TRUST_LOGICAL_FLOW.md | Architecture overview |
| APPLICATION_STATUS_GUIDE.md | Status definitions & lifecycle |
| JOBS_PAGE_RECOMMENDATIONS.md | Jobs page implementation |
| DASHBOARD_STATS_INTEGRATION.md | Stats calculation & fetching |
| RecommendedJobsSection.tsx | Component for dashboard |
| Dashboard.tsx | Updated with stats logic |

---

## Next Steps

1. ✅ Read CAREER_TRUST_LOGICAL_FLOW.md (Architecture)
2. ✅ Read APPLICATION_STATUS_GUIDE.md (Status meanings)
3. 📋 Read DASHBOARD_STATS_INTEGRATION.md (Stats fetching)
4. 📋 Read JOBS_PAGE_RECOMMENDATIONS.md (Filter implementation)
5. 🔧 Update Dashboard.tsx with real API calls
6. 🔧 Update JobsClient.tsx with recommended filter
7. 🧪 Test all components with real data
8. 🚀 Deploy to production
