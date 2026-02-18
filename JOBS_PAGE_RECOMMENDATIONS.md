# Jobs Page: Recommended Jobs Feature Guide

## Overview

The `/jobs` page should display **ALL jobs** but with the ability to:
1. Show recommended jobs with a special badge/filter
2. Display match percentages for logged-in users
3. Filter by match threshold (>50% for recommendations)
4. Sort by relevance (highest match first)

---

## Component Structure

### JobsClient.tsx Updates Required

```typescript
interface JobFilterState {
  searchTerm: string;
  selectedLocation: string;
  selectedSalary: string[];
  selectedRatings: number[];
  selectedDates: string[];
  sortByRelevant: boolean;
  recommendedOnly: boolean; // NEW: Filter for >50% match only
}
```

---

## Implementation Guide

### 1. Add "Recommended Only" Toggle

In the filter section, add:

```tsx
<label className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition">
  <input
    type="checkbox"
    checked={recommendedOnly}
    onChange={(e) => setRecommendedOnly(e.target.checked)}
    className="rounded"
  />
  <span className="text-sm font-medium text-blue-700">
    Show Recommended Only ({recommendedJobs.length})
  </span>
</label>
```

### 2. Filter Logic

```typescript
const filteredJobs = useMemo(() => {
  let filtered = jobs
    // Filter by recommended status if toggle is on
    .filter((job) => {
      if (recommendedOnly) {
        return (job.match || 0) > 50;
      }
      return true;
    })
    // ... existing filters ...
    .filter((job) => {
      const matchesSearch = /* existing */;
      const matchesLocation = /* existing */;
      const matchesSalary = /* existing */;
      const matchesRating = /* existing */;
      const matchesDate = /* existing */;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesSalary &&
        matchesRating &&
        matchesDate
      );
    });

  // Sort by relevance if enabled
  if (sortByRelevant && isSignedIn) {
    filtered = [...filtered].sort((a, b) => (b.match || 0) - (a.match || 0));
  }

  return filtered;
}, [
  jobs,
  searchTerm,
  selectedLocation,
  selectedSalary,
  selectedRatings,
  selectedDates,
  sortByRelevant,
  recommendedOnly, // NEW dependency
  isSignedIn,
]);
```

### 3. Job Card with Match Badge

Update JobCard to show:

```tsx
{/* Show match percentage for logged-in users */}
{isSignedIn && job.match !== undefined && (
  <div className="flex items-center gap-2">
    {job.match > 50 && (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
        <Sparkles className="w-3 h-3" />
        Recommended
      </span>
    )}
    {/* Match percentage badge */}
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-blue-100 to-indigo-100 border-2 border-blue-300">
      <span className="text-sm font-bold text-blue-700">{Math.round(job.match)}%</span>
    </div>
  </div>
)}

{/* Show match info for non-recommended jobs without badge */}
{isSignedIn && job.match !== undefined && job.match <= 50 && (
  <p className="text-xs text-gray-500">Match: {Math.round(job.match)}%</p>
)}
```

### 4. URL Query Parameter Handling

Handle filter from Dashboard recommendation link:

```typescript
useEffect(() => {
  const filter = searchParams.get("filter");
  if (filter === "recommended") {
    setRecommendedOnly(true);
    setSortByRelevant(true);
  }
}, [searchParams]);
```

---

## Display Logic

### All Jobs Page Rules:

| Scenario | Show | Notes |
|----------|------|-------|
| User NOT logged in | All jobs (no match%) | No recommendations shown |
| User logged in | All jobs with match% | Sort by relevance is optional |
| Filter: "Recommended Only" | Jobs with >50% match | Sorted by highest match first |
| Regular job with >50% | Regular card + "Recommended" badge | Shows both |
| Regular job with ≤50% | Regular card | No badge, shows match% smaller |

---

## Recommended Jobs Section (Dashboard)

- Shows only jobs with match > 50%
- Limited to top 6 jobs (by highest match)
- "View All" button → `/jobs?filter=recommended`
- Empty state if no recommendations yet

---

## API/Redux Expectations

Jobs in Redux should include:
```typescript
interface Job {
  id: number | string;
  title: string;
  company: string;
  location: string;
  match?: number; // 0-100 percentage
  // ... other fields
}
```

Match percentage is calculated by:
1. Backend when fetching jobs (if user logged in)
2. Or fetched separately from recommendation endpoint
3. Stored in Redux `jobs.items[].match`

---

## Status Badge Rules

```
Match > 80%  → "Perfect Match"     (emerald)
Match 50-80% → "Recommended"       (blue)
Match < 50%  → [Not shown]         (regular job)
Match N/A    → [No badge]          (not logged in)
```

---

## Key Points

✅ Recommended jobs = jobs with match > 50%
✅ They're part of "all jobs", not separate
✅ Show badge only on /jobs if match > 50%
✅ Dashboard shows only recommended (>50%) in special section
✅ User can filter /jobs to see only recommended
✅ Match % visible for all logged-in users
✅ Regular sort + relevance sort both available
