# Swim for Life — Website Overhaul PRD

## Project Summary

Swim for Life is a 501(c)(3) non-profit based in North Palm Beach, FL that provides free adaptive swim lessons to children of all abilities, with a focus on those with intellectual and developmental disabilities (IDD). The current website (swimsforlife.com) is hosted on Squarespace and serves as a basic informational site with a Google Form for registration.

This project is a complete rebuild as a custom Next.js application to modernize the design, improve user experience, add integrated registration and donation functionality, and better serve the organization's two core audiences: **parents registering children for lessons** and **donors/supporters funding the mission**.

---

## Problem Statement

The current Squarespace site has several limitations:

1. **Registration friction** — Linking out to a Google Form breaks the user flow, feels unprofessional, and provides no confirmation feedback to parents.
2. **No donation capability** — There is no way for supporters to donate directly through the website, leaving significant fundraising potential on the table.
3. **Limited engagement tools** — No newsletter signup, no gallery, no FAQ — the site is static and informational only.
4. **Design constraints** — Squarespace templates limit visual customization and don't match the polished, modern look the organization wants to project.
5. **Ongoing cost** — Squarespace charges $16–33/month. A custom site on Vercel can run for ~$12/year (domain renewal only).

---

## Goals & Success Metrics

| Goal | Success Metric |
|------|---------------|
| Replace Google Form with built-in registration | 100% of registrations flow through the website and auto-populate Google Sheets |
| Enable online donations | Stripe donation page is live with one-time and recurring options |
| Improve design and UX | Site matches the Figma design reference; mobile-responsive; loads in < 2s |
| Increase donor conversion | Donation page includes impact labels, progress bar, and 501(c)(3) messaging |
| Build an email list | Newsletter signup captures emails on every page via footer |
| Reduce hosting costs | Monthly hosting cost drops to $0 (Vercel free tier) |
| Improve credibility and trust | Site includes testimonials, FAQ, partner logos, and 501(c)(3) badge |

---

## Target Users

### Primary: Parents & Guardians
- Parents of children (often with IDD) in the North Palm Beach, FL area
- Looking for free, safe, adaptive swim lessons
- Need to understand what the program offers, who the coaches are, and how to register
- Often finding the site via local search, word of mouth, or social media
- Many will be on mobile devices

### Secondary: Donors & Supporters
- Community members, local businesses, or individuals passionate about inclusion and water safety
- Want to understand the mission, see impact, and donate with confidence
- Need clear tax-deductible donation receipts (501(c)(3) status)
- May also want to volunteer or spread the word

### Tertiary: Partners & Media
- Organizations like Best Buddies International, local government, media outlets
- Looking for professional information about the program for partnerships or coverage

---

## Core Features

### P0 — Must Have (Phase 1: Core Site & Registration)

#### Homepage
- **Hero section**: Full-width pool background image with overlay text ("Swimming Without Boundaries"), subtitle describing the mission, and two CTA buttons: "View Programs" (primary/blue) and "Support Our Mission" (secondary/outlined)
- **Announcement bar**: Configurable top-of-nav banner (e.g., "Now Enrolling for Spring 2026")
- **Navigation**: Sticky top nav with logo, page links (Home, About, Programs, Contact), and persistent blue "Donate" button with heart icon
- **Impact stats section**: 3–4 key numbers (kids taught, lessons given, communities served) with count-up animation on scroll
- **Mission preview**: 2–3 sentence overview with "Learn more" link to About page
- **Services overview**: Cards for Lessons, Schedule, Location
- **Coach spotlights**: Photo + bio card for each coach (Aidan McCorkle, Blake Peters)

#### About Page
- Expanded mission and story
- Certifications and credentials (Red Cross WSI, Lifeguard)
- Connection to Best Buddies International origin story
- Photos/images

#### Programs / Services Page
- Detailed lesson structure (10 free lessons, 20 min each, Mon–Thu)
- What participants learn (water entry, floating, strokes, safety)
- Schedule and hours (11am–noon, Mon–Thu)
- Location details with embedded Google Map (North Palm Beach Country Club, 951 US-1)

#### Registration Form (Built-in)
- **Fields**: Child's name, age, parent/guardian name, email, phone, swim experience level (dropdown: None / Beginner / Some experience), special needs or accommodations (conditional textarea — appears if checkbox selected), session preference, photo release consent checkbox, liability waiver agreement checkbox
- **Submission flow**: Form data sent to Next.js API route → Google Sheets API appends row with all fields + timestamp
- **Confirmation**: On-screen success message after submission
- **Validation**: Client-side + server-side validation; required fields enforced

#### FAQ Page
- Accordion-style (click to expand/collapse)
- Pre-populated with ~10 questions covering: experience requirements, ages served, accommodations, parent presence, what to bring, cost (free), registration process, location/parking, 501(c)(3) status, donation usage

#### Contact Page
- Coach names, emails, phone numbers
- Location with embedded map
- Social media links (Instagram, YouTube)

#### Footer (Global)
- 4-column layout: Logo + tagline + socials | Quick Links | Programs | Contact info with icons
- 501(c)(3) badge and EIN
- Copyright notice

#### Registration Confirmation Email
- Auto-sent to the parent's email immediately after successful registration submission
- Uses Resend (free tier, up to 3,000 emails/month)
- **Email content**: "Thank you for registering [Child's Name] for Swim for Life! We've received your submission and a coach will reach out within 48 hours to confirm your session details." Includes: summary of registration details, coach contact info, location and schedule reminder
- Triggered from the same API route that writes to Google Sheets — only sends if the sheet write succeeds
- Professionally formatted HTML email with Swim for Life branding (blue + white, logo)

#### Coach Notification Email
- Auto-sent to Aidan and Blake's email addresses when a new registration is submitted
- Brief summary: child's name, age, parent contact info, any special needs noted
- Allows coaches to respond quickly without checking the spreadsheet

#### Technical Requirements
- Fully responsive (mobile-first)
- Accessible (WCAG 2.1 AA: proper contrast, alt text, keyboard navigation, semantic HTML)
- Fast (< 2s load time, optimized images, static generation where possible)
- SEO optimized (meta tags, Open Graph, structured data for local business)

---

### P1 — Should Have (Phase 2: Donations & Fundraising)

#### Stripe Donation Page
- **Preset amounts**: $10, $25, $50, $100, $250, Custom
- **Impact labels**: Each tier shows what it funds (e.g., "$25 = one child's full 10-lesson session")
- **Recurring toggle**: Switch between "One-time" and "Monthly" donation
- **Stripe Checkout**: Redirect to Stripe-hosted checkout (PCI-compliant, no card data on our server)
- **Thank-you page**: Post-donation redirect with confirmation and tax-deductible receipt language
- **501(c)(3) messaging**: Prominent display of tax-exempt status and EIN near the donate button and on receipts

#### Fundraising Progress Bar
- Displays on homepage and donation page
- Shows current amount raised vs. goal (e.g., "$2,750 of $5,000")
- Visual progress bar with percentage
- Campaign label (e.g., "Help us fund Summer 2026 sessions")
- Configurable via a simple config file or environment variables (manual update initially; Stripe webhook automation as future enhancement)

#### Donor Wall
- Dedicated section on donation page or homepage
- Displays first names of donors who opted in during checkout
- Checkbox during Stripe checkout: "Display my first name on our Supporters page"
- Tiered recognition levels: "Splash Supporter" ($25+), "Wave Maker" ($100+), "Tide Changer" ($500+)
- Initially maintained via a JSON data file; Stripe webhook automation as future enhancement

---

### P2 — Nice to Have (Phase 3: Engagement & Media)

#### Photo/Video Gallery
- Categorized by session or season (e.g., "Summer 2025")
- Lightbox viewer for full-screen photo viewing with swipe navigation
- YouTube video embeds (highlight reels from existing channel)
- Only displays photos of children whose parents opted in via photo release in registration

#### Email Newsletter Signup
- Simple email input in footer (every page) and optionally a dedicated CTA section on homepage
- Integration with Mailchimp (free tier, up to 500 contacts) or Resend
- Confirmation message on signup
- Optional segmentation: "Parent" vs "Supporter" toggle

#### (Moved to P0: Registration confirmation emails and coach notifications are now part of Phase 1)

---

## Technical Architecture

### Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 14+ (App Router) | Static generation + API routes in one project; excellent DX; free Vercel hosting |
| Styling | Tailwind CSS | Utility-first; rapid prototyping; easy to match Figma designs precisely |
| Hosting | Vercel (free tier) | Zero-config Next.js deployment; global CDN; serverless functions for API routes |
| Registration backend | Google Sheets API via service account | Free; coaches already use Google Sheets; no database needed |
| Payments | Stripe Checkout | PCI-compliant; non-profit discount available; handles receipts and recurring billing |
| Email (transactional) | Resend (free tier) | Simple API; 3,000 emails/month free; great DX with Next.js. Used in Phase 1 for registration confirmations and coach notifications |
| Email (marketing) | Mailchimp (free tier) | 500 contacts free; built-in templates; standard for small non-profits |
| Analytics | Vercel Analytics or Google Analytics 4 | Free; lightweight; privacy-respecting |
| Domain | swimsforlife.com (existing) | DNS pointed to Vercel |

### Architecture Diagram (Simplified)

```
User Browser
    │
    ├── Static Pages (served from Vercel CDN)
    │     └── Homepage, About, Programs, FAQ, Contact, Gallery
    │
    ├── Registration Form
    │     └── POST /api/register
    │           ├── Validate input
    │           ├── Write row to Google Sheet (Google Sheets API)
    │           ├── Send confirmation email to parent (Resend) ← Phase 1
    │           └── Send notification to coaches (Resend) ← Phase 1
    │
    ├── Donation Flow
    │     └── POST /api/create-checkout-session
    │           ├── Create Stripe Checkout Session
    │           └── Redirect to Stripe hosted checkout
    │     └── GET /donate/success (thank-you page)
    │     └── POST /api/stripe-webhook (future: auto-update donor wall & progress bar)
    │
    └── Newsletter Signup
          └── POST /api/newsletter
                └── Add subscriber to Mailchimp list via API
```

### File / Folder Structure

```
swimsforlife/
├── public/
│   ├── images/          # Optimized site images, coach photos, logo
│   ├── fonts/           # Custom fonts if needed (Inter or similar)
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout (nav + footer)
│   │   ├── page.tsx             # Homepage
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── programs/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── donate/
│   │   │   ├── page.tsx         # Donation page with tiers
│   │   │   └── success/
│   │   │       └── page.tsx     # Post-donation thank you
│   │   ├── faq/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── gallery/
│   │   │   └── page.tsx
│   │   └── api/
│   │       ├── register/
│   │       │   └── route.ts     # Registration → Google Sheets
│   │       ├── create-checkout-session/
│   │       │   └── route.ts     # Stripe checkout creation
│   │       ├── stripe-webhook/
│   │       │   └── route.ts     # Stripe event handling
│   │       └── newsletter/
│   │           └── route.ts     # Mailchimp subscription
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
│   │   │   ├── FundraisingBar.tsx
│   │   │   └── NewsletterCTA.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Accordion.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── Modal.tsx
│   │   ├── forms/
│   │   │   ├── RegistrationForm.tsx
│   │   │   ├── DonationTiers.tsx
│   │   │   └── NewsletterForm.tsx
│   │   └── gallery/
│   │       ├── PhotoGrid.tsx
│   │       └── Lightbox.tsx
│   ├── lib/
│   │   ├── google-sheets.ts     # Google Sheets API helper
│   │   ├── stripe.ts            # Stripe config and helpers
│   │   ├── resend.ts            # Email sending helper
│   │   └── mailchimp.ts         # Mailchimp API helper
│   ├── data/
│   │   ├── coaches.ts           # Coach bios and photos
│   │   ├── faq.ts               # FAQ content
│   │   ├── services.ts          # Program descriptions
│   │   ├── donors.json          # Donor wall data (manual for now)
│   │   └── config.ts            # Fundraising goal, announcement text, etc.
│   └── styles/
│       └── globals.css          # Tailwind imports + custom CSS
├── .env.local                   # API keys (Google, Stripe, Resend, Mailchimp)
├── tailwind.config.ts
├── next.config.js
├── package.json
└── README.md
```

---

## Data Models

### Registration Submission (Google Sheets Row)

| Column | Type | Required |
|--------|------|----------|
| Timestamp | ISO datetime | Auto |
| Child Name | String | Yes |
| Child Age | Number | Yes |
| Parent/Guardian Name | String | Yes |
| Parent Email | Email | Yes |
| Parent Phone | Phone | Yes |
| Swim Experience | Enum (None / Beginner / Some) | Yes |
| Has Special Needs | Boolean | No |
| Special Needs Details | String | Conditional |
| Session Preference | String | No |
| Photo Release Consent | Boolean | Yes |
| Liability Waiver Agreed | Boolean | Yes |
| Status | String (default: "New") | Auto |

### Donor Wall Entry (JSON)

```json
{
  "name": "Sarah M.",
  "tier": "wave_maker",
  "date": "2026-01-15",
  "displayConsent": true
}
```

### Fundraising Config (config.ts)

```typescript
export const fundraisingConfig = {
  goalAmount: 5000,
  currentAmount: 2750,
  campaignLabel: "Help us fund Summer 2026 sessions",
  isActive: true
};
```

---

## API / Interface Design

### POST /api/register
- **Request body**: JSON with all registration form fields
- **Response**: `{ success: true, message: "Registration submitted" }` or `{ success: false, errors: [...] }`
- **Side effects**: Appends row to Google Sheet; sends confirmation email to parent; sends notification to coaches

### POST /api/create-checkout-session
- **Request body**: `{ amount: number, recurring: boolean, donorName?: string, displayConsent?: boolean }`
- **Response**: `{ url: string }` (Stripe Checkout URL to redirect to)

### POST /api/stripe-webhook
- **Trigger**: Stripe sends events (payment_intent.succeeded, etc.)
- **Action**: (Future) Update donor wall JSON and fundraising progress

### POST /api/newsletter
- **Request body**: `{ email: string, segment?: "parent" | "supporter" }`
- **Response**: `{ success: true }` or error

---

## Design System

Based on the Figma reference provided:

| Token | Value |
|-------|-------|
| Primary Blue | `#2563EB` (Tailwind `blue-600`) |
| Dark Navy Background | `#0F172A` (Tailwind `slate-900`) |
| Text on Dark | `#FFFFFF` |
| Text on Light | `#1E293B` (Tailwind `slate-800`) |
| Accent Label Text | Primary Blue |
| Heading Font | Inter (or system sans-serif), Bold |
| Body Font | Inter (or system sans-serif), Regular |
| Primary Button | Blue filled, fully rounded (pill), white text |
| Secondary Button | White filled, fully rounded, dark text |
| Nav Donate Button | Blue pill with heart icon |
| Section Rhythm | Alternating light and dark navy backgrounds |
| Border Radius | Fully rounded on buttons (pill), `rounded-xl` on cards |
| Spacing | Generous whitespace; sections padded `py-20` to `py-24` |
| Icons | Blue circle checkmarks for lists; line-style icons for contact |

### Section Background Assignments

- **Light sections**: Hero, Coach Bios, FAQ, Registration Form, Testimonials
- **Dark sections**: Programs/Services, Impact Stats, Fundraising Bar, Donor Wall, Newsletter CTA, Footer

---

## Out of Scope

The following are explicitly excluded from all phases:

- User accounts or login system
- Admin dashboard or CMS (content is managed via code/config files)
- Online scheduling or calendar booking system
- Payment processing beyond Stripe Checkout (no PayPal, Venmo, etc.)
- Automated Stripe webhook → donor wall/progress bar update (manual JSON update for now; webhook is a future enhancement)
- Multi-language support
- Blog or content management system
- E-commerce or merchandise store
- Native mobile app
- Swimmer progress tracking / skill badges (potential future feature)

---

## Open Questions

1. **Coach photos**: Are high-resolution photos of Aidan and Blake available for the rebuild, or should the design accommodate the existing images from the current site?
2. **Impact numbers**: What stats can be cited? (e.g., number of kids taught, total lessons given, years operating). Even estimates are valuable.
3. **Testimonials**: Are there parent quotes or endorsements available to include?
4. **Photo library**: Are there existing photos from lessons (with photo release) that can be used on the site?
5. **Stripe non-profit discount**: Has the application for reduced Stripe processing fees (2.2% + $0.30) been submitted?
6. **Google Sheet structure**: Is there an existing Google Sheet from the current Google Form registrations that should be matched or replaced?
7. **Domain registrar**: Where is swimsforlife.com registered? (Needed for DNS migration to Vercel)
8. **Email addresses**: Should the site use personal emails (current setup) or a branded email like hello@swimsforlife.com?

---

## Implementation Phases

### Phase 1: Core Site & Registration
**Scope**: Homepage, About, Programs, FAQ, Contact pages. Built-in registration form with Google Sheets integration. Registration confirmation emails to parents and notification emails to coaches via Resend. Global nav and footer. Mobile-responsive. Accessible. SEO basics.

**Estimated Claude Code sessions**: 1–2

**Deliverable**: A fully functional website that replaces the current Squarespace site with all existing content plus the built-in registration form with automatic confirmation emails to parents and notifications to coaches.

### Phase 2: Donations & Fundraising
**Scope**: Stripe donation page with tiers, recurring toggle, and Checkout integration. Fundraising progress bar. Donor wall. 501(c)(3) tax messaging. Thank-you page.

**Estimated Claude Code sessions**: 1

**Deliverable**: A complete donation flow that enables online fundraising with professional presentation.

### Phase 3: Engagement & Media
**Scope**: Photo/video gallery with lightbox. YouTube embeds. Newsletter signup with Mailchimp integration. Confirmation emails via Resend. Coach notification on registration.

**Estimated Claude Code sessions**: 1

**Deliverable**: Enhanced engagement features that make the site a living hub for the community, not just a static information page.

### Phase 4: Supabase Migration & Automation
**Scope**: Introduce Supabase (PostgreSQL) as the project database. Migrate registration storage from Google Sheets API to Supabase. Migrate donor wall from static JSON to Supabase. Migrate fundraising progress bar from static config to Supabase. Update Stripe webhook to auto-insert donors and auto-update campaign totals. Optional Google Sheets sync for coach familiarity.

**Estimated Claude Code sessions**: 1

**Deliverable**: A fully automated backend where registrations, donations, donor recognition, and fundraising progress are all managed through a real database with zero manual data management required.

---

*Document version: 1.1*
*Last updated: March 2, 2026*
