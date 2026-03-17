# Claude Code Prompt — Swim for Life Website: Phase 1 (Core Site & Registration)

## Project Overview

Build a modern, responsive website for **Swim for Life** (swimsforlife.com), a 501(c)(3) non-profit in North Palm Beach, FL that provides free adaptive swim lessons to children of all abilities, specializing in those with intellectual and developmental disabilities (IDD).

This is **Phase 1** of a 3-phase rebuild. Phase 1 covers: the full marketing site (Homepage, About, Programs, FAQ, Contact) with a built-in registration form that auto-populates a Google Sheet. Donations (Stripe), gallery, and newsletter features will be added in later phases — do NOT build them now, but leave clean integration points for them.

---

## Tech Stack

- **Framework**: Next.js 14+ with App Router (TypeScript)
- **Styling**: Tailwind CSS
- **Fonts**: Inter (via `next/font/google`)
- **Icons**: Lucide React
- **Form handling**: React Hook Form + Zod for validation
- **Google Sheets**: `googleapis` npm package with service account auth
- **Email**: `resend` npm package for transactional emails (registration confirmation + coach notification)
- **Animations**: Framer Motion (fade-in-on-scroll, count-up for stats)
- **Deployment target**: Vercel

---

## Design System

Follow this design language loosely — it's based on a Figma reference specific to this project, but frontend design UI/UX can be tweaked later:

### Colors
```
Primary Blue:         #2563EB  (Tailwind blue-600)
Primary Blue Hover:   #1D4ED8  (Tailwind blue-700)
Dark Navy BG:         #0F172A  (Tailwind slate-900)
Dark Navy Lighter:    #1E293B  (Tailwind slate-800)
Text on Dark:         #FFFFFF
Text on Light:        #1E293B  (Tailwind slate-800)
Muted Text on Dark:   #94A3B8  (Tailwind slate-400)
Accent/Label Text:    #2563EB  (Primary Blue)
```

### Typography
- **Hero heading**: text-5xl md:text-7xl font-bold, white. Accent word ("Boundaries") in Primary Blue.
- **Section eyebrow labels**: text-sm uppercase tracking-widest font-semibold, Primary Blue (e.g., "OUR PROGRAMS")
- **Section headings**: text-3xl md:text-4xl font-bold
- **Body text**: text-base md:text-lg, normal weight
- **All text**: Font family is Inter

### Buttons
- **Primary**: bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 font-semibold, with optional arrow icon
- **Secondary**: bg-white text-slate-800 rounded-full px-8 py-3 font-semibold border border-slate-200
- **Nav Donate**: bg-blue-600 text-white rounded-full px-6 py-2 with heart icon (from Lucide)

### Layout Patterns
- **Section rhythm**: Alternate between light (white/slate-50) and dark (slate-900) background sections
- **Content width**: max-w-7xl mx-auto with px-4 sm:px-6 lg:px-8 padding
- **Section padding**: py-20 md:py-24
- **Split layouts**: Grid with text on left, image on right (or vice versa) on desktop; stacked on mobile
- **Cards**: bg-white rounded-xl shadow-lg p-6 on light backgrounds; bg-slate-800 rounded-xl p-6 on dark backgrounds

### Section Background Assignments
- **Light**: Hero, Coach Bios, FAQ, Registration
- **Dark**: Programs/Services, Impact Stats, Footer

---

## Pages & Components to Build

### Global Layout (`src/app/layout.tsx`)

**AnnouncementBar component**: A slim bar at the very top of the page with configurable text. Currently: "Now Enrolling for Spring 2026". Dark background (slate-800), white text, centered. Dismissible with an X button.

**Navbar component**: Sticky. Contains:
- Left: Logo icon (blue rounded square with wave lines SVG) + "Swim For Life" text
- Center/Right: Navigation links — Home, About, Programs, Contact
- Far Right: Blue pill "Donate" button with heart icon
- Mobile: Hamburger menu that opens a full-screen overlay with all nav links + Donate button
- Active page link should have an underline or visual indicator

**Footer component**: Dark navy background (slate-900). 4-column grid on desktop, stacked on mobile:
1. Logo + tagline ("Empowering children of all abilities through aquatic education, fostering water safety, and building inclusive communities.") + social media icon links (Instagram, YouTube)
2. Quick Links: About Our Mission, Programs, Register, Contact Us
3. Our Programs: Free Swim Lessons, Water Safety Basics, Adaptive Instruction
4. Get In Touch: Location with pin icon (951 US-1, North Palm Beach, FL 33408), Phone with phone icon ((917)-821-3667), Email with mail icon (atmccorkle08@gmail.com)
- Below the grid: Divider line, then 501(c)(3) statement + copyright on same row: "Swim for Life is a registered 501(c)(3) non-profit. All donations are tax-deductible. | © 2026 Swim for Life. All rights reserved."

---

### Homepage (`src/app/page.tsx`)

Build these sections in order, top to bottom:

**1. HeroSection**
- Full-viewport-height section with a background image of a pool/swimming (use a placeholder optimized image; I will replace it later)
- Dark gradient overlay (from bottom-left) to ensure text readability
- Large bold heading: "Swimming Without" (white) + line break + "Boundaries" (Primary Blue)
- Subtitle paragraph: "An inclusive aquatic program for children of all abilities, specializing in adaptive lessons for those with intellectual and developmental disabilities."
- Two CTA buttons side by side: "View Programs →" (primary blue, links to /programs) and "Support Our Mission" (secondary white/outlined, links to /donate — this page won't exist yet in Phase 1, so link to a placeholder or # for now)
- Subtle scroll indicator at the bottom (animated down arrow)

**2. ImpactStats**
- Dark navy background section
- Eyebrow label: "OUR IMPACT"
- 3 or 4 stat cards in a row: Use placeholder numbers for now. Format: large bold number + short label underneath. Examples: "50+" / "Children Taught", "200+" / "Lessons Given", "3" / "Seasons Completed", "100%" / "Free of Charge"
- Numbers should animate (count up) when the section scrolls into view using Framer Motion

**3. MissionPreview**
- Light background
- Eyebrow label: "WHO WE ARE"
- Heading: "Spreading Ripples of Inclusion"
- 2–3 paragraphs about the mission: "While organizing a Swim for Understanding Meet with Best Buddies International, we learned of the need for water safety lessons within various groups in our community, including the Intellectual and Developmental Disabilities (IDD) community. Swim for Life was born to help close that gap. We provide 10 free swim lessons per session, teaching water safety, confidence, and essential swimming skills in a supportive, inclusive environment."
- "Learn More" button linking to /about

**4. ServicesOverview**
- Dark navy background
- Eyebrow label: "OUR PROGRAMS"
- Heading: "Specialized Aquatic Education"
- Left side: List of 4 items with blue circle checkmark icons:
  - "10 free lessons, 20 minutes each, Monday through Thursday"
  - "Red Cross certified Water Safety Instructors"
  - "Adaptive instruction for children with IDD"
  - "Safe, inclusive environment at North Palm Beach Country Club"
- "Explore Programs →" button linking to /programs
- Right side: Atmospheric pool/water image (placeholder, will be replaced)

**5. CoachSpotlights (make it so it is easily possible to add new coaches, their photos, they bios, and other information)**
- Light background
- Eyebrow label: "MEET YOUR COACHES"
- Heading: "Led by Certified Instructors"
- Two coach cards side by side (stacked on mobile):
  - **Aidan McCorkle**: Photo placeholder (circular crop), name, bio: "Active member at the North Palm Beach Swim Team with 6 years of competitive swimming experience. Red Cross Certified Water Safety Instructor (WSI) and Certified Lifeguard. Co-founder of Swim for Life."
  - **Blake Peters**: Photo placeholder (circular crop), name, bio: "Competitive swimmer at the North Palm Beach Swim Team. Red Cross Certified WSI and Lifeguard. Passionate about helping people gain confidence and safety in the pool."

**6. FundraisingBarPlaceholder**
- Dark navy background
- Simple section with heading "Support Our Mission" and a brief line: "Help us continue providing free swim lessons to children in our community."
- "Donate" button (links to /donate — placeholder for Phase 2)
- NOTE: The actual fundraising progress bar will be built in Phase 2. This is a simple CTA placeholder.

**7. NewsletterCTAPlaceholder**
- Slightly different dark shade or a blue-tinted background for variety
- Heading: "Stay in the Loop"
- Subtitle: "Sign up to be the first to know when new sessions open."
- Email input + "Subscribe" button (non-functional in Phase 1 — show a toast/alert saying "Newsletter coming soon!" on submit)

---

### About Page (`src/app/about/page.tsx`)

- Hero banner with page title "About Swim for Life" on a dark background
- Mission section: Expanded version of the origin story (connection to Best Buddies International, how the need was identified, what the program does)
- Values section: 3 cards — "Inclusion", "Safety", "Community" — each with an icon, short heading, and 1–2 sentence description
- Credentials section: Mention Red Cross WSI and Lifeguard certifications, Best Buddies International connection
- Call to action: "Ready to join?" button linking to /register

---

### Programs Page (`src/app/programs/page.tsx`)

- Hero banner: "Our Programs"
- **Lessons section**: Detailed description of the 10-lesson program structure. Use the content from the current site: "In each lesson participants begin with a brief orientation covering pool rules, recognizing lifeguards, and basic emergency signals. The lesson then transitions to practical skills, starting with how to enter and exit the water safely. Instructors teach floating techniques, treading water, and basic strokes like the front crawl and backstroke to build confidence and mobility. Emphasis is placed on breath control, staying calm in deep water, and how to call for help. The session concludes with group activities that reinforce safe behaviors, such as practicing reaching assists and simulating safe responses to someone in trouble."
- **Schedule card**: Hours: 11am–noon, Monday through Thursday. Visual card with clock icon.
- **Location card**: North Palm Beach Country Club, 951 US-1, North Palm Beach, FL 33408. Card with map pin icon. Include an embedded Google Maps iframe.
- **CTA**: "Register Now" button linking to /register

---

### Registration Page (`src/app/register/page.tsx`)

- Hero banner: "Register for Lessons"
- Intro text: "Once you submit the form below, one of our coaches will reach out to you shortly with the next available date and time."
- **Registration form** (use React Hook Form + Zod):
  - Child's Full Name (text, required)
  - Child's Age (number, required, min 3 max 18)
  - Parent/Guardian Full Name (text, required)
  - Parent/Guardian Email (email, required)
  - Parent/Guardian Phone (tel, required)
  - Swim Experience Level (select dropdown: "No experience", "Beginner", "Some experience" — required)
  - "My child has special needs or requires accommodations" (checkbox)
  - If checked, show: Special Needs / Accommodations Details (textarea, required when visible)
  - Session Preference (text, optional — "e.g., Morning sessions preferred")
  - Photo Release Consent: "I consent to my child being photographed or videoed during lessons for use on the Swim for Life website and social media." (checkbox, required)
  - Liability Waiver: "I acknowledge that swimming involves inherent risks and agree to hold Swim for Life, its coaches, and North Palm Beach Country Club harmless from any liability." (checkbox, required)
  - Submit button: "Submit Registration" (primary blue)
- **On successful submission**: Replace form with a success message: "Registration submitted! A coach will reach out within 48 hours to confirm your session." Include a "Submit another registration" link.
- **On error**: Show inline field errors and a general error message at top.
- **Loading state**: Disable button and show spinner during submission.

### Registration API Route (`src/app/api/register/route.ts`)

- Accept POST with JSON body
- Validate all fields server-side with Zod (same schema as client)
- On valid submission:
  1. Authenticate with Google Sheets API using service account credentials (stored in environment variables)
  2. Append a row to the configured Google Sheet with all form fields + ISO timestamp
  3. Send a **confirmation email to the parent** via Resend with:
     - Subject: "Registration Confirmed — Swim for Life"
     - Branded HTML email (blue + white, consistent with site design)
     - Content: "Thank you for registering [Child's Name] for Swim for Life! We've received your submission and a coach will reach out shortly to confirm your session details."
     - Include: registration summary (child name, age, experience level, session preference), program info (10 free lessons, Mon–Thu, 11am–noon), location (North Palm Beach Country Club), coach contact info
  4. Send a **notification email to coaches** via Resend:
     - To: atmccorkle08@gmail.com and bapeters_1@icloud.com
     - Subject: "New Registration: [Child's Name]"
     - Content: Parent name, email, phone, child's name, age, experience level, any special needs noted, timestamp
  5. Return `{ success: true }`
  - Note: Email failures should be logged but should NOT cause the registration to fail. The Google Sheets write is the critical operation. If the sheet write succeeds but email fails, still return success to the user.
- On validation failure: Return `{ success: false, errors: [...] }` with 400 status
- On Google Sheets API failure: Return `{ success: false, message: "Something went wrong. Please try again." }` with 500 status
- **Environment variables needed**: `GOOGLE_SHEETS_PRIVATE_KEY`, `GOOGLE_SHEETS_CLIENT_EMAIL`, `GOOGLE_SHEETS_SPREADSHEET_ID`, `RESEND_API_KEY`

---

### FAQ Page (`src/app/faq/page.tsx`)

- Hero banner: "Frequently Asked Questions"
- Accordion component: Click a question to expand/collapse the answer. Only one open at a time (or allow multiple — your call, just be consistent).
- **Questions to include**:
  1. "Do participants need prior swim experience?" → "No! Our program welcomes children of all skill levels, from those who have never been in the water to those with some swimming experience."
  2. "What ages do you serve?" → "We work with children of various ages. Please note your child's age on the registration form and we'll ensure appropriate instruction."
  3. "What accommodations are available for children with IDD?" → "Our coaches are trained to adapt lessons for children with intellectual and developmental disabilities. During registration, please describe any specific needs so we can prepare accordingly."
  4. "Does a parent or guardian need to be present?" → "Yes, a parent or guardian must remain on-site during all lessons."
  5. "What should my child bring?" → "A swimsuit, towel, and goggles (optional). Sunscreen is recommended for outdoor sessions."
  6. "Are the lessons really free?" → "Yes, 100% free. Swim for Life is a 501(c)(3) non-profit funded entirely by donations and community support."
  7. "How do I register?" → "Fill out the registration form on our Register page. A coach will contact you within 48 hours to confirm your session."
  8. "Where are lessons held?" → "North Palm Beach Country Club, 951 US-1, North Palm Beach, FL 33408."
  9. "Is Swim for Life a registered non-profit?" → "Yes, Swim for Life is a registered 501(c)(3) organization. All donations are tax-deductible."
  10. "How can I support Swim for Life?" → "You can donate on our Support page (coming soon), spread the word on social media, or contact us about volunteer opportunities."

---

### Contact Page (`src/app/contact/page.tsx`)

- Hero banner: "Get in Touch"
- Two-column layout:
  - Left: Contact information cards for each coach:
    - Aidan McCorkle — atmccorkle08@gmail.com — (917)-821-3667
    - Blake Peters — bapeters_1@icloud.com — (561)-388-7370
  - Right: Embedded Google Maps iframe showing North Palm Beach Country Club
- Below: Social media links (Instagram: https://www.instagram.com/swimsforlife/ , YouTube: https://www.youtube.com/@swimforlife123)
- Optional: A simple contact form (name, email, message) that sends to the coaches' email. If you build this, use Resend or a simple mailto: link. Not critical — can be skipped if it adds significant complexity.

---

## File / Folder Structure

```
swimsforlife/
├── public/
│   ├── images/
│   │   ├── hero-placeholder.jpg
│   │   ├── pool-atmosphere.jpg
│   │   ├── coach-aidan.jpg
│   │   └── coach-blake.jpg
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/page.tsx
│   │   ├── programs/page.tsx
│   │   ├── register/page.tsx
│   │   ├── faq/page.tsx
│   │   ├── contact/page.tsx
│   │   └── api/
│   │       └── register/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── AnnouncementBar.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ImpactStats.tsx
│   │   │   ├── MissionPreview.tsx
│   │   │   ├── ServicesOverview.tsx
│   │   │   ├── CoachSpotlights.tsx
│   │   │   ├── FundraisingPlaceholder.tsx
│   │   │   └── NewsletterPlaceholder.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Accordion.tsx
│   │   │   ├── SectionHeading.tsx
│   │   │   └── PageHero.tsx
│   │   └── forms/
│   │       └── RegistrationForm.tsx
│   ├── lib/
│   │   ├── google-sheets.ts
│   │   ├── resend.ts          # Resend email client + email templates
│   │   └── validations.ts     # Zod schemas
│   ├── data/
│   │   ├── coaches.ts
│   │   ├── faq.ts
│   │   ├── services.ts
│   │   ├── stats.ts
│   │   └── config.ts
│   └── styles/
│       └── globals.css
├── .env.local.example
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## Code Style & Conventions

- **TypeScript**: Strict mode. Use interfaces for component props. No `any` types.
- **Components**: Functional components only. Use `"use client"` directive only on components that need client-side interactivity (forms, animations, accordion). Keep page-level components as server components where possible.
- **Naming**: PascalCase for components, camelCase for functions/variables, SCREAMING_SNAKE_CASE for env vars.
- **Imports**: Use `@/` path alias for `src/` directory.
- **Data**: Store content in `src/data/` as typed TypeScript files, not hardcoded in components. This makes Phase 2 and 3 additions cleaner.
- **Error handling**: All API routes should try/catch with appropriate HTTP status codes and user-friendly error messages.
- **Accessibility**: Semantic HTML (nav, main, section, article, footer). Alt text on all images. Proper heading hierarchy. Focus management on the registration form. aria-labels on icon buttons. Keyboard-navigable accordion.
- **Responsive**: Mobile-first. Test at 375px (mobile), 768px (tablet), 1024px+ (desktop). The nav must have a working mobile hamburger menu.

---

## Environment Variables

Create a `.env.local.example` file with:

```
# Google Sheets API (Registration Form)
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id-here

# Resend (Registration Confirmation & Coach Notification Emails)
RESEND_API_KEY=re_your_api_key_here

# Site Config
NEXT_PUBLIC_SITE_URL=https://swimsforlife.com
```

---

## Out of Scope for Phase 1

Do NOT build any of the following — they are coming in Phases 2 and 3:

- Stripe payment/donation integration (just leave a placeholder CTA)
- Fundraising progress bar (just leave a placeholder section)
- Donor wall
- Photo/video gallery
- Newsletter signup integration with Mailchimp (just leave a non-functional placeholder)
- User accounts, login, or authentication
- Admin dashboard or CMS
- Blog

However, structure the codebase so these can be added cleanly. For example, the `src/lib/` directory should be ready for `stripe.ts` and `mailchimp.ts` files in future phases.

---

## Success Criteria

Phase 1 is complete when:

1. All 6 pages render correctly and are navigable (Home, About, Programs, Register, FAQ, Contact)
2. The site is fully responsive at mobile (375px), tablet (768px), and desktop (1024px+) breakpoints
3. The registration form validates input, submits to a Google Sheet via API route, sends a branded confirmation email to the parent, sends a notification email to coaches, and shows success/error states on screen
4. The design matches the provided Figma reference (color palette, typography, section rhythm, button styles)
5. The navbar is sticky with a working mobile hamburger menu and persistent Donate button
6. The footer displays all required information in the 4-column layout
7. The FAQ accordion expands and collapses correctly
8. Impact stats animate (count up) on scroll
9. All images have alt text; heading hierarchy is correct; the site is keyboard-navigable
10. The site builds without errors and runs on `next dev`
11. A `.env.local.example` file documents all required environment variables
12. A README.md explains how to set up and run the project locally

---

## When in Doubt

- **Design ambiguity**: Default to the Figma reference screenshots. If those don't cover a case, use clean, minimal design, but still fun and fitting with the non-profit vibe, consistent with the established design system.
- **Content ambiguity**: Use the content provided in this prompt. For any missing content, use realistic placeholder text that I can replace later — never use "Lorem ipsum."
- **Technical decisions**: Prefer simplicity. Server components over client components where possible. Static data files over database calls. Built-in Next.js features over third-party libraries.
- **Scope questions**: If something feels like it belongs in Phase 2 or 3, leave a clean placeholder and move on. Don't build features not listed in this prompt.
