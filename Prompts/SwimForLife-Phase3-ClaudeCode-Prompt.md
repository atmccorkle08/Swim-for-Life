# Claude Code Prompt — Swim for Life Website: Phase 3 (Gallery & Newsletter)

## Project Context

This is **Phase 3** of a 4-phase website rebuild for **Swim for Life** (swimsforlife.com), a 501(c)(3) non-profit in North Palm Beach, FL that provides free adaptive swim lessons to children of all abilities, specializing in those with intellectual and developmental disabilities (IDD).

**Phases 1–2 are complete.** The site is a Next.js 14+ App Router project with TypeScript, Tailwind CSS, Framer Motion, Lucide React, React Hook Form + Zod, Google Sheets API, Resend, and Stripe. It is deployed on Vercel. Here's what currently exists:

- **Phase 1 (Core)**: Homepage, About, Programs, Register, FAQ, Contact pages. Registration form submits to Google Sheets API. Confirmation and notification emails via Resend. Sticky navbar with Donate button. Dark/light alternating section design.
- **Phase 2 (Donations)**: Stripe donation page with preset/custom amounts, one-time and recurring giving, Stripe Checkout redirect. Thank-you page. Fundraising progress bar reading from `src/data/config.ts`. Donor wall reading from `src/data/donors.json`. Stripe webhook route (logs events).

**Phase 3 adds:**
1. A photo and video gallery page with lightbox viewing and YouTube embeds
2. A functional newsletter signup integrated with Mailchimp, replacing the non-functional placeholder
3. A dedicated newsletter CTA section on the homepage replacing the existing placeholder

**Phase 4 (Supabase migration) comes after this — do NOT build any database integration in Phase 3.**

---

## Tech Stack Additions for Phase 3

Everything from Phases 1–2 remains. Add:

- **Lightbox**: `yet-another-react-lightbox` npm package — lightweight, accessible, supports swipe navigation and keyboard controls
- **Mailchimp**: `@mailchimp/mailchimp_marketing` npm package — server-side only, for adding subscribers to a mailing list

No other new libraries needed.

---

## Design System Reference

All Phase 3 additions must match the existing design language exactly:

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

### Consistent Patterns
- **Section rhythm**: Alternating light ↔ dark navy backgrounds
- **Eyebrow labels**: text-sm uppercase tracking-widest font-semibold, Primary Blue
- **Section headings**: text-3xl md:text-4xl font-bold
- **Buttons**: Primary = blue-600 filled pill, white text. Secondary = white filled pill, dark text.
- **Cards**: rounded-xl with shadow-lg on light BGs, bg-slate-800 on dark BGs
- **Content width**: max-w-7xl mx-auto with px-4 sm:px-6 lg:px-8
- **Section padding**: py-20 md:py-24
- **Page heroes**: Dark navy background with eyebrow label + large white heading (same as About, Programs, FAQ, etc.)
- **Animations**: Fade-in-on-scroll via Framer Motion (match existing sections)

### Phase 3 Section Background Assignments
- **Gallery page hero**: Dark navy
- **Photo gallery grid**: Light (white/slate-50)
- **Video section**: Dark navy
- **Homepage newsletter CTA**: Dark navy with a subtle blue tint or gradient to differentiate from adjacent dark sections

---

## What to Build

### 1. Gallery Page (`src/app/gallery/page.tsx`)

A new page showcasing photos and videos from Swim for Life sessions. This is important for building trust with parents (they can see what lessons look like) and for creating emotional connection with potential donors.

Build these sections top to bottom:

**1a. Hero Section (Dark Navy BG)**
- Eyebrow label: "OUR COMMUNITY"
- Heading: "Moments from" (white) + "the Pool" (Primary Blue)
- Subtitle: "See our swimmers in action! Browse photos and videos from our lessons and events."

**1b. Category Filter Bar (Light BG, sticky below nav on scroll — optional)**
- A horizontal row of filter buttons/tabs for gallery categories
- Categories are defined in a data file (see data structure below). Example categories: "All", "Summer 2025", "Spring 2025", "Events"
- "All" is selected by default and shows everything
- Selecting a category filters both photos and videos to that category
- Style: Pill-shaped buttons. Active = bg-blue-600 text-white. Inactive = bg-slate-100 text-slate-600 hover:bg-slate-200
- On mobile: Horizontally scrollable row (overflow-x-auto with hidden scrollbar)
- This is a client component (`"use client"`) since it manages filter state

**1c. Photo Gallery Grid (Light BG)**
- Eyebrow label: "PHOTOS"
- Responsive grid layout: 3 columns on desktop, 2 on tablet, 1 on mobile
- Each photo is displayed as a card with:
  - The image (using Next.js `<Image>` component with `fill` and `object-cover` for consistent sizing)
  - Rounded corners (rounded-xl)
  - Subtle hover effect: slight scale-up (scale-105) with shadow increase, smooth transition
  - An optional caption overlay at the bottom of the image (semi-transparent dark gradient from bottom, white text) — only shown if a caption exists in the data
- **Clicking a photo opens the lightbox** (full-screen overlay):
  - Shows the photo at full resolution
  - Navigation arrows (left/right) to browse through photos
  - Swipe support on mobile (handled by `yet-another-react-lightbox`)
  - Keyboard navigation (arrow keys, Escape to close)
  - Close button (X) in the top right
  - Photo counter ("3 / 12") in the top left or bottom center
  - Caption displayed below the photo if available
  - Dark semi-transparent backdrop
- **Fade-in-on-scroll animation**: Photos should animate in as the user scrolls down (Framer Motion, staggered by 100ms per item)
- If no photos exist for the selected category, show: "No photos yet for this session. Check back soon!"

**1d. Video Section (Dark Navy BG)**
- Eyebrow label: "VIDEOS"
- Heading: "Watch Our Swimmers in Action"
- Grid of YouTube video embeds: 2 columns on desktop, 1 on mobile
- Each video displayed as:
  - A responsive YouTube iframe embed (16:9 aspect ratio using Tailwind `aspect-video`)
  - Rounded corners (rounded-xl) with overflow-hidden
  - A title below the embed
  - Optional description text below the title in muted text
- Use `loading="lazy"` on iframes for performance
- **Privacy-conscious embedding**: Use `youtube-nocookie.com` domain for embeds instead of `youtube.com` to reduce tracking
- If no videos exist for the selected category, show: "No videos yet for this session. Stay tuned!"

**1e. Call to Action (Light BG)**
- Heading: "Want to See Your Child Here?"
- Subtitle: "Register for free swim lessons and join our inclusive aquatic community."
- Two buttons: "Register Now →" (primary, links to /register) and "Support Our Mission" (secondary, links to /donate)

---

### 2. Gallery Data Structure (`src/data/gallery.ts`)

Create a typed data file that stores all gallery content. This makes it easy to add new photos and videos without touching component code.

```typescript
export interface GalleryPhoto {
  id: string;
  src: string;           // path relative to /public/images/gallery/
  alt: string;           // descriptive alt text (required for accessibility)
  caption?: string;      // optional overlay caption
  category: string;      // matches a category slug
  width: number;         // original image width (for Next.js Image optimization)
  height: number;        // original image height
}

export interface GalleryVideo {
  id: string;
  youtubeId: string;     // just the video ID, not the full URL
  title: string;
  description?: string;
  category: string;
}

export interface GalleryCategory {
  slug: string;          // URL-friendly identifier
  label: string;         // display name
  order: number;         // sort order (lower = first)
}

export const galleryCategories: GalleryCategory[] = [
  { slug: "all", label: "All", order: 0 },
  { slug: "summer-2025", label: "Summer 2025", order: 1 },
  { slug: "spring-2025", label: "Spring 2025", order: 2 },
  { slug: "events", label: "Events", order: 3 },
];

export const galleryPhotos: GalleryPhoto[] = [
  // Include 6-9 placeholder entries so the grid looks populated during development.
  // Use placeholder images from /public/images/gallery/ (create the directory).
  // I will replace these with real photos later.
  {
    id: "photo-1",
    src: "/images/gallery/placeholder-1.jpg",
    alt: "Children learning to float during a Swim for Life lesson",
    caption: "First-time floaters!",
    category: "summer-2025",
    width: 800,
    height: 600,
  },
  {
    id: "photo-2",
    src: "/images/gallery/placeholder-2.jpg",
    alt: "Coach Aidan helping a swimmer practice the backstroke",
    category: "summer-2025",
    width: 800,
    height: 600,
  },
  {
    id: "photo-3",
    src: "/images/gallery/placeholder-3.jpg",
    alt: "Group water safety exercise at North Palm Beach Country Club",
    caption: "Teamwork makes the dream work",
    category: "spring-2025",
    width: 800,
    height: 600,
  },
  {
    id: "photo-4",
    src: "/images/gallery/placeholder-4.jpg",
    alt: "Swimmer celebrating after completing the front crawl",
    category: "summer-2025",
    width: 800,
    height: 600,
  },
  {
    id: "photo-5",
    src: "/images/gallery/placeholder-5.jpg",
    alt: "Coach Blake demonstrating treading water technique",
    category: "spring-2025",
    width: 800,
    height: 600,
  },
  {
    id: "photo-6",
    src: "/images/gallery/placeholder-6.jpg",
    alt: "Swim for Life community event group photo",
    caption: "Our amazing community",
    category: "events",
    width: 800,
    height: 600,
  },
  {
    id: "photo-7",
    src: "/images/gallery/placeholder-7.jpg",
    alt: "Young swimmers lined up at the pool edge for safety drill",
    category: "summer-2025",
    width: 800,
    height: 600,
  },
  {
    id: "photo-8",
    src: "/images/gallery/placeholder-8.jpg",
    alt: "Parent and child at the pool during a lesson",
    category: "spring-2025",
    width: 800,
    height: 600,
  },
];

export const galleryVideos: GalleryVideo[] = [
  // Include 2-3 entries. Use real YouTube video IDs from the Swim for Life channel
  // if available, otherwise use placeholder IDs that I'll replace.
  {
    id: "video-1",
    youtubeId: "placeholder_id_1",
    title: "Swim for Life — Summer 2025 Highlights",
    description: "Watch our swimmers grow in confidence and skill over the summer session.",
    category: "summer-2025",
  },
  {
    id: "video-2",
    youtubeId: "placeholder_id_2",
    title: "What is Swim for Life?",
    description: "Learn about our mission to provide inclusive aquatic education for children of all abilities.",
    category: "events",
  },
  {
    id: "video-3",
    youtubeId: "placeholder_id_3",
    title: "Spring 2025 Session Recap",
    category: "spring-2025",
  },
];
```

Also create the placeholder image directory:
```
public/images/gallery/
```

For placeholder images during development, generate simple colored rectangles or use a service like `https://placehold.co/800x600/0F172A/2563EB?text=Swim+for+Life` as the `src` value. I will replace these with real photos.

---

### 3. Lightbox Component (`src/components/gallery/Lightbox.tsx`)

A wrapper around `yet-another-react-lightbox` configured for this project:

- `"use client"` component (lightbox requires client-side interactivity)
- Props: `photos: GalleryPhoto[]`, `initialIndex: number`, `isOpen: boolean`, `onClose: () => void`
- Configure the lightbox with:
  - Captions plugin (shows photo caption below the image)
  - Counter plugin (shows "3 / 12")
  - Zoom plugin (pinch-to-zoom on mobile, scroll-to-zoom on desktop)
  - Keyboard navigation enabled
  - Swipe navigation enabled
  - Custom styling to match the site's dark navy aesthetic (dark backdrop, white controls)
- Import required CSS from `yet-another-react-lightbox/styles.css`

### 4. PhotoGrid Component (`src/components/gallery/PhotoGrid.tsx`)

- `"use client"` component (manages lightbox open state and selected photo index)
- Props: `photos: GalleryPhoto[]`
- Renders the responsive grid of photo cards
- Manages state: `selectedIndex: number | null` and `lightboxOpen: boolean`
- Clicking a photo sets the index and opens the lightbox
- Framer Motion fade-in-on-scroll with stagger animation
- If `photos` array is empty, show the "No photos yet" empty state

### 5. VideoGrid Component (`src/components/gallery/VideoGrid.tsx`)

- Can be a server component (no interactivity needed — iframes handle their own playback)
- Props: `videos: GalleryVideo[]`
- Renders the responsive grid of YouTube embeds
- Each embed uses the privacy-enhanced URL: `https://www.youtube-nocookie.com/embed/{youtubeId}`
- If `videos` array is empty, show the "No videos yet" empty state

### 6. CategoryFilter Component (`src/components/gallery/CategoryFilter.tsx`)

- `"use client"` component (manages active filter state)
- Props: `categories: GalleryCategory[]`, `activeCategory: string`, `onCategoryChange: (slug: string) => void`
- Renders the horizontal row of filter pills
- Handles the active/inactive styling toggle

### 7. GalleryPageClient Component (`src/components/gallery/GalleryPageClient.tsx`)

Since the gallery page needs client-side filtering (selecting a category filters both photos and videos), create a client wrapper that manages the filter state and passes filtered data down:

- `"use client"` component
- Props: Receives all gallery data (photos, videos, categories) from the server page component
- State: `activeCategory: string` (default: "all")
- Filtering logic:
  - If activeCategory is "all", pass all photos and videos
  - Otherwise, filter both arrays by `category === activeCategory`
- Renders: CategoryFilter, PhotoGrid, VideoGrid, and the CTA section
- This keeps the page-level component (`src/app/gallery/page.tsx`) as a server component that just imports data and passes it to this client wrapper

---

### 8. Newsletter Integration

#### 8a. Newsletter API Route (`src/app/api/newsletter/route.ts`)

- Accept POST with JSON body: `{ email: string, segment?: "parent" | "supporter" }`
- Validate email format with Zod
- Add the subscriber to a Mailchimp audience list using the Mailchimp Marketing API:
  1. Initialize the Mailchimp client with the API key
  2. Call `mailchimp.lists.addListMember(listId, { email_address, status: "subscribed", merge_fields: { SEGMENT: segment } })`
  3. Handle the case where the email is already subscribed (Mailchimp returns a specific error for this) — return a friendly message like "You're already subscribed!" instead of an error
- Return `{ success: true, message: "You're subscribed!" }` on success
- Return `{ success: false, message: "..." }` with appropriate status on failure
- **Environment variables needed**: `MAILCHIMP_API_KEY`, `MAILCHIMP_LIST_ID`, `MAILCHIMP_SERVER_PREFIX`

#### 8b. Mailchimp Client (`src/lib/mailchimp.ts`)

```typescript
import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX, // e.g., "us21"
});

export default mailchimp;
```

#### 8c. Newsletter Form Component (`src/components/forms/NewsletterForm.tsx`)

- `"use client"` component
- A compact, inline form with:
  - Email input field (placeholder: "Enter your email")
  - Submit button: "Subscribe" (primary blue pill)
  - Optional: A small radio or toggle for segment selection ("I'm a Parent" / "I'm a Supporter") — only include this if it doesn't make the form feel cluttered. If it adds too much visual weight, skip it and default all subscribers to a general list.
- States:
  - **Default**: Input + button
  - **Loading**: Button shows spinner, input disabled
  - **Success**: Input and button replaced with a green checkmark + "You're subscribed! Thanks for joining." message. This persists (no need to reset back to the form).
  - **Already subscribed**: Show "You're already on the list! Thanks for being a supporter." in a friendly tone (not an error)
  - **Error**: Show red error text below the input: "Something went wrong. Please try again."
- Client-side email validation before submitting
- Calls POST `/api/newsletter` on submit

---

### 9. Homepage Newsletter Section Update

**Replace the existing `NewsletterPlaceholder` component** on the homepage with a real, functional newsletter section.

#### New Component: `NewsletterCTA.tsx` (`src/components/home/NewsletterCTA.tsx`)

- Dark navy background with a subtle visual differentiator from adjacent dark sections. Options (pick whichever looks best):
  - A very subtle blue gradient overlay
  - A faint water texture or wave pattern as a background image
  - A slightly lighter shade of navy (slate-800 instead of slate-900)
- Eyebrow label: "STAY CONNECTED"
- Heading: "Never Miss a" (white) + "Session" (Primary Blue)
- Subtitle: "Get notified when new sessions open, see impact updates, and stay connected with our community."
- **The NewsletterForm component** centered below the text
- Below the form: A small muted text line: "We respect your inbox. No spam — just updates that matter."

This replaces `NewsletterPlaceholder.tsx` in the homepage section order.

---

### 10. Footer Newsletter Integration

The footer should also include a newsletter signup. This is standard practice — the footer appears on every page, giving visitors a persistent opportunity to subscribe.

**Modify the Footer component** (`src/components/layout/Footer.tsx`):

- In the first column (logo + tagline + socials), add a compact newsletter form below the social icons:
  - Just the email input + a small "Subscribe" button (can be an arrow icon button to save space)
  - Or a single-line layout: `[email input] [→ button]`
  - Uses the same NewsletterForm component but in a compact/mini variant
- To support this, the NewsletterForm component should accept a `variant` prop:
  - `variant="default"` — full-size version used on the homepage CTA section
  - `variant="compact"` — smaller version for the footer (smaller input, icon-only button, no segment selector, minimal success state)

---

### 11. Navigation Update

**Modify the Navbar** (`src/components/layout/Navbar.tsx`):

- Add "Gallery" as a nav link between "Programs" and "Contact"
- Updated nav order: Home, About, Programs, **Gallery**, Contact + [Donate button]
- Mobile menu: Add "Gallery" in the same position

**Modify the Footer** (`src/components/layout/Footer.tsx`):

- In the "Quick Links" column, add "Gallery" linking to `/gallery`

---

### 12. FAQ Update (Optional)

If time allows, add one more FAQ entry to `src/data/faq.ts`:

- "Can I see photos from previous sessions?" → "Yes! Visit our Gallery page to see photos and videos from past sessions. We only share photos of children whose parents have provided photo release consent."

---

## New Files to Create

```
src/
├── app/
│   ├── gallery/
│   │   └── page.tsx                           # Gallery page (server component)
│   └── api/
│       └── newsletter/
│           └── route.ts                       # Mailchimp subscription endpoint
├── components/
│   ├── gallery/
│   │   ├── GalleryPageClient.tsx              # Client wrapper with filter state
│   │   ├── CategoryFilter.tsx                 # Category filter pills
│   │   ├── PhotoGrid.tsx                      # Photo grid + lightbox trigger
│   │   ├── VideoGrid.tsx                      # YouTube embed grid
│   │   └── Lightbox.tsx                       # Lightbox wrapper component
│   ├── home/
│   │   └── NewsletterCTA.tsx                  # Homepage newsletter section (replaces placeholder)
│   └── forms/
│       └── NewsletterForm.tsx                 # Reusable newsletter form (default + compact variants)
├── lib/
│   └── mailchimp.ts                           # Mailchimp client initialization
└── data/
    └── gallery.ts                             # Gallery photos, videos, and categories data
```

Also create:
```
public/
└── images/
    └── gallery/                               # Directory for gallery photos (placeholders for now)
        ├── placeholder-1.jpg
        ├── placeholder-2.jpg
        ├── placeholder-3.jpg
        ├── placeholder-4.jpg
        ├── placeholder-5.jpg
        ├── placeholder-6.jpg
        ├── placeholder-7.jpg
        └── placeholder-8.jpg
```

## Files to Modify

```
src/
├── app/
│   └── page.tsx                               # Replace NewsletterPlaceholder with NewsletterCTA
├── components/
│   └── layout/
│       ├── Navbar.tsx                          # Add "Gallery" nav link
│       └── Footer.tsx                         # Add Gallery to Quick Links + add compact newsletter form
└── data/
    └── faq.ts                                 # Add gallery FAQ entry (optional)
```

## Files to Delete (or leave as unused)

```
src/components/home/NewsletterPlaceholder.tsx   # Replaced by NewsletterCTA.tsx
```

---

## Environment Variables

Add to `.env.local` (and Vercel environment variables):

```
# Mailchimp (Newsletter)
MAILCHIMP_API_KEY=your_mailchimp_api_key_here
MAILCHIMP_LIST_ID=your_audience_list_id_here
MAILCHIMP_SERVER_PREFIX=us21
```

**How to find these values:**

1. **MAILCHIMP_API_KEY**: Log in to Mailchimp → Account & Billing → Extras → API keys → Create A Key
2. **MAILCHIMP_LIST_ID**: Audience → All contacts → Settings → Audience name and defaults → Audience ID (it's a string like `a1b2c3d4e5`)
3. **MAILCHIMP_SERVER_PREFIX**: Look at your Mailchimp URL when logged in. If it's `https://us21.admin.mailchimp.com/`, the prefix is `us21`

Existing variables from Phases 1–2 remain unchanged.

---

## Code Style & Conventions

Same as all previous phases. Additional conventions for Phase 3:

- **Gallery data in `src/data/gallery.ts`** — all photo and video entries live here, not hardcoded in components. Adding a new photo to the gallery should be as simple as adding an entry to the array and dropping the image file in `public/images/gallery/`.
- **Next.js `<Image>` component** for all gallery photos — provides automatic optimization, lazy loading, and responsive sizing. Always specify `width` and `height` (or use `fill` with a sized container) to prevent layout shift.
- **YouTube embeds use `youtube-nocookie.com`** — privacy-conscious embedding that doesn't set tracking cookies.
- **Lightbox CSS** — import `yet-another-react-lightbox/styles.css` in the Lightbox component or in `globals.css`. If the default lightbox styles conflict with Tailwind, scope overrides carefully.
- **NewsletterForm variant pattern** — use a `variant` prop with TypeScript union type, not separate components. Keep it DRY.
- **Accessibility for the gallery**: All photos must have descriptive `alt` text (stored in the data file). The lightbox must be keyboard-navigable. The category filter buttons need proper `aria-pressed` or `aria-selected` attributes. YouTube iframes need a `title` attribute.

---

## Out of Scope for Phase 3

Do NOT build:

- Image upload or CMS for managing gallery photos (photos are added manually to the data file and `public/images/gallery/`)
- Video upload or hosting (all videos are YouTube embeds)
- Photo watermarking or download protection
- User comments on photos or videos
- Social sharing per photo
- Infinite scroll or pagination for the gallery (if the grid gets very large, pagination can be added later — for now, show all photos for the active category)
- Mailchimp email template design (Mailchimp handles this in their dashboard)
- Double opt-in flow (Mailchimp can be configured for this in their dashboard settings — don't build it in code)
- Supabase or any database integration (that's Phase 4)

---

## Success Criteria

Phase 3 is complete when:

1. The `/gallery` page renders with a hero, category filter, photo grid, video section, and CTA
2. Clicking a category tab filters both photos and videos to that category (or shows all when "All" is selected)
3. Clicking a photo opens a full-screen lightbox with navigation, swipe support, and keyboard controls
4. YouTube videos embed correctly using the privacy-enhanced `youtube-nocookie.com` domain with `loading="lazy"`
5. The homepage newsletter section is functional — entering an email and clicking Subscribe adds the subscriber to the Mailchimp list
6. The newsletter form handles all states: loading, success, already-subscribed, and error
7. The footer includes a compact newsletter signup form that works identically to the homepage version
8. "Gallery" appears in the navbar and footer navigation
9. The gallery page is fully responsive (mobile, tablet, desktop)
10. All gallery photos have descriptive alt text and the lightbox is keyboard-navigable
11. Photos animate in with a staggered fade-in-on-scroll effect
12. The gallery data is entirely driven by `src/data/gallery.ts` — no content is hardcoded in components
13. The `.env.local.example` is updated with Mailchimp environment variables
14. The site builds without errors with `next build`
15. All existing Phase 1 and Phase 2 functionality continues to work without regression

---

## When in Doubt

- **Design**: Match the established design system exactly. The gallery page should feel like it belongs alongside the existing pages — same hero pattern, same section rhythm, same typography, same color palette.
- **Photo placeholders**: Use colored rectangles or placehold.co images. The layout and interaction should be fully testable without real photos.
- **Lightbox customization**: Don't over-customize the lightbox beyond basic theme matching. The default `yet-another-react-lightbox` experience is good — just make sure the backdrop and controls don't clash with the site's color scheme.
- **Newsletter complexity**: Keep the form simple. A single email input + subscribe button is the goal. The optional segment selector (parent vs supporter) should only be included if it doesn't clutter the design. When in doubt, skip it.
- **Gallery size**: The data file has 8 sample photos and 3 videos. The layout should work well with anywhere from 3 to 30+ photos. Don't optimize prematurely for hundreds of images, but make sure the grid doesn't break if more are added later.
- **Scope**: If anything feels like Phase 4 territory (database, real-time updates, admin functionality), skip it.
