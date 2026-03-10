# Professional Portfolio & Skill Tracker

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Personal profile page with hero section (name, title, bio, avatar, location, contact links)
- About/Summary section with professional background
- Work Experience section (company, role, dates, description)
- Education section (institution, degree, dates)
- Hobbies & Interests section with visual cards
- Skills & Progress section with progress bars showing mastery level per skill
- Skill achievement tracking: mark a skill as achieved/completed with a timestamp
- Add/Edit/Remove entries for experience, education, hobbies, and skills
- Admin login to edit profile content vs public read-only view

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: Store profile data (bio, experience, education, hobbies, skills with progress %)
2. Backend: CRUD operations for each section
3. Backend: Skill progress update endpoint; mark skill as achieved
4. Frontend: Public profile view (LinkedIn-style layout)
5. Frontend: Profile header with avatar, name, title, location
6. Frontend: Tabbed or scrollable sections: About, Experience, Education, Skills, Hobbies
7. Frontend: Skills section with progress bars and achieved badges
8. Frontend: Admin edit mode (behind authorization) to add/edit/remove entries
