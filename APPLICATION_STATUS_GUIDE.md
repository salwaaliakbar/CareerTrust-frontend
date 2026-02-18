# Application Status Guide for CareerTrust

## Status Lifecycle

```
┌─────────────────────────────────────────┐
│  Jobseeker Applies for Job              │
└──────────────────┬──────────────────────┘
                   ↓
         ╔═════════════════════╗
         ║ Status: "pending"   ║
         ║ (Awaiting company)  ║
         ╚═════════════════════╝
                   ↓
        ┌──────────────────────┐
        │ Company Views Resume │
        └──────────────────────┘
                   ↓
         ╔═════════════════════════╗
         ║ Status: "reviewing"     ║
         ║ (Company reviewing app) ║
         ╚═════════════════════════╝
        ↙             │              ↘
   
   ❌ Rejected    ✅ Shortlisted   (No decision yet)
       │               │
       ↓               ↓
    [REJECTED]  ╔═════════════════════════╗
                ║ Status: "shortlisted"   ║
                ║ (Passed initial screen) ║
                ╚═════════════════════════╝
                       │
                  ┌────────────┐
                  │ Interview  │
                  │ Scheduled  │
                  └────────────┘
                       ↓
                ╔═════════════════════╗
                ║ Status: "interviewed"║
                ║ (Met with company)  ║
                ╚═════════════════════╝
                    ↙ │ ↖
                     
         ❌ Rejected  🎯 Offered
             │           │
             ↓           ↓
          [REJECTED]  ╔═════════════════════╗
                      ║ Status: "hired"     ║
                      ║ (OFFER ACCEPTED ✅) ║
                      ╚═════════════════════╝
```

---

## Status Definitions

### 1. pending
**When**: Just after application is submitted
**Meaning**: Waiting for company to review
**User Message**: "Your application is in the queue"
**Backend Action**: 
- Check if user uploaded resume
- Store application record
- Set initial status to "pending"

**Duration**: 1-7 days typically

---

### 2. reviewing
**When**: Company has started reviewing applications
**Meaning**: Company is actively looking at your profile and resume
**User Message**: "The company is reviewing your application"
**Backend Action**:
- Company views application on their portal
- Can update status via employer dashboard
- Should add timestamp

**Duration**: 2-14 days

**Don't Confuse With**: 
- "pending" = hasn't been looked at yet
- "reviewing" = someone is actively reviewing it

---

### 3. shortlisted
**When**: You passed initial screening (resume matches requirements)
**Meaning**: You're one of the top candidates they're considering
**User Message**: "Great! You've been shortlisted for this position"
**Backend Action**:
- Company selects candidates to move forward
- Filters based on skills, experience
- Sends notification to user

**Duration**: Few days to 1 week

---

### 4. interviewed
**When**: You've had a meeting/call with the company (phone, video, in-person)
**Meaning**: You've passed the interview stage
**User Message**: "You've completed an interview. Awaiting feedback..."
**Backend Action**:
- Either:
  - Company schedules interview → set to "interviewed" after completed
  - Or track interview stages: "phone_interview", "technical_interview", etc.
  
**Tips**:
- Could track interview type if needed for more detail
- Note completion date/time

**Duration**: 1-3 days to decision

---

### 5. hired ✅ 
**When**: ONLY when company makes a job offer AND the candidate accepts it
**Meaning**: **JOB SECURED! Offer has been accepted.** This is the final positive status.
**User Message**: "Congratulations! You have accepted the offer"
**Backend Action**:
- Company sends formal offer letter
- Candidate accepts offer
- Set status to "hired"
- Flag as "offer_accepted: true"

**CRITICAL**: 
❌ Do NOT set to "hired" just when offer is extended
✅ Only set to "hired" when candidate has accepted

**Display in Dashboard**: 
- Count this in "Accepted Offers"
- Highlight with emerald notification
- Show congratulations message

**Duration**: Permanent (job accepted)

---

### 6. rejected ❌
**When**: Company explicitly rejects the candidate
**Meaning**: Not selected for this position
**User Message**: "Unfortunately, the company has not selected you for this position"
**Backend Action**:
- Company clicks "Reject" on application
- Optionally include rejection reason
- Send notification to user

**Display Rules**:
- Show in recent applications with red badge
- Don't count in any positive statistics
- can optionally show reason if provided

**Duration**: Permanent (rejected)

---

## Dashboard Statistics Mapping

```typescript
// Statistics Calculation

interface DashboardStats {
  // Total number of applications submitted
  totalApplications: applications.length
  
  // Only "hired" status - means offer accepted
  acceptedApplications: applications.filter(a => a.status === "hired").length
  
  // Applications in active review process
  // Includes both just-applied and under-review stages
  pendingApplications: applications.filter(
    a => a.status === "pending" || a.status === "reviewing"
  ).length
  
  // Profile views by employers
  profileViews: userProfile.viewsCount
  
  // Jobs matching >50%
  jobsRecommended: jobs.filter(j => j.match > 50).length
  
  // Verified employment records
  verifiedRecords: employmentPassport.verifiedCount
}
```

---

## What NOT to Use

❌ "offer_extended" → Use "interviewed" or create better flow
❌ "accepted_offer" → Use "hired"
❌ "pending_offer" → Not a valid status
❌ "accepted" → Use "hired"
❌ "in_progress" → Use "reviewing"

---

## Status Transitions (Backend Validation)

Valid transitions:
```typescript
pending       → reviewing, rejected
reviewing     → shortlisted, rejected
shortlisted   → interviewed, rejected
interviewed   → hired, rejected
hired         → [final, no transitions]
rejected      → [final, no transitions]
```

**Backend should validate** these transitions to prevent invalid state changes.

---

## Employer Portal Updates

When employer updates status via admin/employer dashboard:

```typescript
// Example API call
PATCH /api/applications/{applicationId}
{
  status: "shortlisted",
  notes: "Good technical background, schedule interview"
}

// Frontend shows:
if (status === "shortlisted") {
  showNotification("You've been shortlisted! Check your email for next steps");
}
```

---

## Notification Strategy

### Auto-Generated Based on Status:

| Status | Notification | Email | SMS |
|--------|--------------|-------|-----|
| pending | ✅ App submitted | ✅ | ✅ |
| reviewing | ✅ Company reviewing | ✅ | - |
| shortlisted | ✅ You're shortlisted! | ✅ | ✅ |
| interviewed | ✅ Interview completed | ✅ | - |
| hired | ✅✅ Offer accepted! | ✅ | ✅ |
| rejected | - | ✅ | - |

---

## Testing Checklist

- [ ] Create application → status = "pending"
- [ ] Employer reviews → can change to "reviewing"
- [ ] Employer shortlists → status = "shortlisted" with notification
- [ ] Complete interview → status = "interviewed"
- [ ] Offer made and accepted → status = "hired" with congratulations
- [ ] Offer rejected → status = "rejected"
- [ ] Dashboard shows correct counts for each status
- [ ] Recent applications show all statuses with correct colors
- [ ] Can't transition to invalid states
- [ ] Timestamps update correctly
- [ ] Notifications send based on status change

---

## Quick Reference

**For Developers**: 
- Application just created? → "pending"
- Employer looked at it? → "reviewing"
- Top candidate? → "shortlisted"
- Met with company? → "interviewed"
- Got the job? → "hired" 🎉
- Didn't make cut? → "rejected"

**For Users**:
- See these 6 possible statuses in your applications
- "Hired" means you have an accepted job offer
- Watch for notifications when status changes
- "Pending" and "Reviewing" are different stages

**For Dashboard**:
- Show applications count (all statuses)
- Show accepted offers (only "hired")
- Show under-review apps ("pending" + "reviewing")
- Sort recent apps by newest first
- Color-code by status for quick scanning
