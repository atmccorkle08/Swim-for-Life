# Claude Code Prompt — Swim for Life Website: Phase 2 (Donations & Fundraising)

## Project Context

This is **Phase 2** of a 3-phase website rebuild for **Swim for Life** (swimsforlife.com), a 501(c)(3) non-profit in North Palm Beach, FL that provides free adaptive swim lessons to children of all abilities, specializing in those with intellectual and developmental disabilities (IDD).

**Phase 1 is already complete.** The site already has: Homepage, About, Programs, Register, FAQ, and Contact pages. It uses Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion, React Hook Form + Zod, Google Sheets API integration, and Resend for transactional emails. It is deployed on Vercel.

**Phase 2 adds**: Stripe donation page with one-time and recurring giving, a fundraising progress bar, a donor recognition wall, and all supporting API routes and infrastructure. Phase 3 (gallery, newsletter integration) comes later — do NOT build those features.

---

## Tech Stack Additions for Phase 2

Everything from Phase 1 remains. Add:

- **Payments**: `stripe` npm package (server-side) for creating Checkout Sessions and handling webhooks
- **Webhook signature verification**: `stripe` package's built-in `constructEvent` method
- No new frontend libraries needed — use existing Tailwind + Framer Motion + Lucide React

---

## Design System Reference

The existing site follows this design language. All Phase 2 additions must match it exactly:



### Phase 2 Section Background Assignments
- **Donation page hero**
- **Donation tiers selection**
- **501(c)(3) trust banner**
- **Thank-you page**
- **Fundraising progress bar (homepage)**
- **Donor wall (homepage)**

---

## What to Build

### 1. Donation Page (`src/app/donate/page.tsx`)

This is the primary new page. It should feel trustworthy, professional, and emotionally compelling. Build these sections top to bottom:

**1a. Hero Section (Dark Navy BG)**
- Eyebrow label: "SUPPORT OUR MISSION"
- Heading: "Help Kids" (white) + "Make a Splash" (Primary Blue) — same two-tone heading pattern used on the homepage hero
- Subtitle: "Every dollar goes directly to providing free adaptive swim lessons for children of all abilities in our community. Swim for Life is a registered 501(c)(3) — your donation is tax-deductible."
- Subtle background image or gradient to add visual interest (can be a water texture, keep it understated so text remains readable)

**1b. Donation Tiers Section (Light BG)**
- Eyebrow label: "CHOOSE YOUR IMPACT"
- Heading: "Every Contribution Makes Waves"

- **Amount selection**: A grid of 6 options (3x2 on desktop, 2x3 on mobile). Five preset amounts + one custom:
  - $10 — "Provides goggles and swim caps for a child"
  - $25 — "Covers one child's full 10-lesson session"
  - $50 — "Equips a session with safety equipment"
  - $100 — "Sponsors two children for a full session"
  - $250 — "Funds an entire week of group lessons"
  - Custom — Text input for custom dollar amount (minimum $1)
- Each amount is a selectable card (border highlight + checkmark when selected). The impact label appears below the dollar amount on each card.
- Default selection: $25 (pre-selected on page load)

- **Recurring toggle**: Directly below the amount grid. A clean toggle or segmented control with two options: "One-time" and "Monthly". Default: "One-time".
  - When "Monthly" is selected, show a small note below: "You can cancel your monthly donation at any time."

- **Donor recognition opt-in**: A checkbox below the toggle: "Display my first name on our Supporters wall" (default: unchecked). Below it in muted text: "Only your first name will be shown. You can opt out anytime by contacting us."

- **Donate button**: Large, full-width on mobile, centered on desktop. Primary blue pill button: "Donate $25" (dynamically updates with selected amount). If recurring is toggled on: "Donate $25/month". The button triggers the Stripe Checkout flow.

**1c. Trust & Transparency Section (Dark Navy BG)**
- Three trust indicators in a horizontal row (icon + text each):
  - Shield icon: "501(c)(3) Tax-Deductible" — "EIN: [placeholder — I will fill in the real EIN]"
  - Lock icon: "Secure Payment" — "Processed securely via Stripe"
  - Heart icon: "100% Impact" — "Every dollar funds free swim lessons"
- Below: A brief line: "Swim for Life is a registered 501(c)(3) non-profit organization. A tax receipt will be emailed to you automatically."

**1d. How Donations Are Used Section (Light BG)**
- Eyebrow label: "YOUR IMPACT"
- Heading: "Where Your Money Goes"
- 3 or 4 cards showing how funds are allocated. Each card has an icon, a title, and a 1-sentence description:
  - "Pool Access & Facility Fees" — "Covering costs to use the North Palm Beach Country Club pool"
  - "Safety Equipment" — "Providing goggles, swim caps, kickboards, and flotation devices"
  - "Instructor Training" — "Maintaining Red Cross WSI and Lifeguard certifications"
  - "Program Growth" — "Expanding to serve more children and more sessions each year"

---

### 2. Stripe Checkout API Route (`src/app/api/create-checkout-session/route.ts`)

- Accept POST request with JSON body:
  ```typescript
  {
    amount: number;        // in dollars (e.g., 25)
    recurring: boolean;    // true for monthly, false for one-time
    donorName?: string;    // optional, for donor wall
    displayConsent: boolean; // whether donor opted in to wall display
  }
  ```
- Validate:
  - `amount` must be a positive number, minimum 1, maximum 10000
  - `amount` must be a valid number (not NaN, not negative)
- Create a Stripe Checkout Session:
  - **For one-time donations**: Use `mode: 'payment'` with a single `line_items` entry using `price_data` with `unit_amount: amount * 100` (Stripe uses cents)
  - **For recurring donations**: Use `mode: 'subscription'` with `price_data` that includes `recurring: { interval: 'month' }`
  - `success_url`: `${process.env.NEXT_PUBLIC_SITE_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`
  - `cancel_url`: `${process.env.NEXT_PUBLIC_SITE_URL}/donate`
  - `metadata`: Include `donorName` and `displayConsent` for future webhook processing
  - `payment_intent_data.receipt_email` (for one-time) or `subscription_data` (for recurring): Let Stripe handle receipt emails automatically
  - Set `submit_type: 'donate'` for one-time payments (shows "Donate" instead of "Pay" on the Stripe page)
- Return `{ url: session.url }` for the client to redirect to
- On error: Return `{ error: "Failed to create checkout session" }` with 500 status

**Important Stripe configuration notes for the prompt:**
- Use `stripe` npm package server-side only — never expose the secret key to the client
- The Stripe publishable key is not needed since we're using Stripe Checkout (redirect-based, not embedded)
- Product name in Checkout: "Donation to Swim for Life"
- Product description: "Supporting free adaptive swim lessons for children of all abilities"

---

### 3. Stripe Webhook Route (`src/app/api/stripe-webhook/route.ts`)

This route receives events from Stripe when payments are completed. For Phase 2 it handles updating the donor wall JSON file. Set it up now even though the auto-update workflow is a stretch goal — at minimum it should log events correctly.

- **Disable Next.js body parsing** for this route (Stripe requires the raw body for signature verification):
  ```typescript
  export const runtime = 'nodejs';
  // Use req.text() to get raw body for Stripe signature verification
  ```
- Verify the webhook signature using `stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)`
- Handle these event types:
  - `checkout.session.completed` — Log the event. Extract `metadata.donorName` and `metadata.displayConsent`. If `displayConsent` is `"true"` and `donorName` is present, log a message indicating a new donor wall entry should be added. (In a future iteration, this could auto-append to the donors JSON file, but for now just log it so the site admin can manually update.)
  - `payment_intent.succeeded` — Log for record-keeping
- Return 200 for all handled events, 400 for signature verification failures
- **Environment variable needed**: `STRIPE_WEBHOOK_SECRET`

---

### 4. Donation Success Page (`src/app/donate/success/page.tsx`)

- Light background
- Centered content with generous padding
- Large green checkmark icon (Lucide `CheckCircle` in green-500) at the top
- Heading: "Thank You for Your Generosity!"
- Subtitle: "Your donation to Swim for Life has been received. A tax-deductible receipt has been sent to your email."
- 501(c)(3) reminder: "Swim for Life is a registered 501(c)(3) non-profit. Your donation is tax-deductible to the extent allowed by law."
- Two CTA buttons:
  - "Return Home" (primary blue, links to /)
  - "Share on Social Media" (secondary, links to Instagram page or opens a share dialog)
- Optional: If `session_id` is present in the URL query params, use it to fetch the session from Stripe (server-side) and display: "You donated $[amount]" personalized message. If this adds significant complexity, skip it — the generic thank-you is fine.

---

### 5. Fundraising Progress Bar Component (`src/components/home/FundraisingBar.tsx`)

**This replaces the existing `FundraisingPlaceholder.tsx` on the homepage.**

- Dark navy background section
- Eyebrow label: "OUR CAMPAIGN"
- Heading: "Help Us Reach Our Goal"
- Campaign description: Configurable text (e.g., "Help us raise $5,000 to fund Summer 2026 sessions for children in our community")
- **Progress bar**:
  - Full-width horizontal bar with rounded ends
  - Background: slate-700
  - Fill: A gradient from blue-600 to green-500 (or solid blue-600 — whichever looks better)
  - Animated fill on scroll-into-view (Framer Motion, animates from 0% to actual percentage)
  - Above the bar, left-aligned: "$2,750 raised" in bold white
  - Above the bar, right-aligned: "$5,000 goal" in muted slate-400
  - Below the bar, centered: "55% of goal reached" in muted text
- **Donate CTA button**: Below the progress bar. "Contribute Now →" (primary blue pill, links to /donate)
- **Data source**: Import values from `src/data/config.ts`:
  ```typescript
  export const fundraisingConfig = {
    goalAmount: 5000,
    currentAmount: 2750,
    campaignLabel: "Help us raise $5,000 to fund Summer 2026 sessions",
    isActive: true,
  };
  ```
  When `isActive` is false, the section should not render at all.

---

### 6. Donor Wall Component (`src/components/home/DonorWall.tsx`)

**Add this as a new section on the homepage, below the Fundraising Progress Bar.**

- Light background section
- Eyebrow label: "OUR SUPPORTERS"
- Heading: "Making Waves Together"
- Subtitle: "Thank you to everyone who has supported our mission."

- **Tier display**: Three tiers displayed as columns (or tabs on mobile):
  - 🌊 **Tide Changer** ($500+) — Displayed first, most prominently
  - 🌊 **Wave Maker** ($100+)
  - 🌊 **Splash Supporter** ($25+)
- Each tier shows its icon/emoji, tier name, threshold, and a list of donor first names
- If a tier has no donors yet, show: "Be the first Tide Changer!" with a donate link
- At the bottom: "Want to see your name here?" with a "Donate Now" button linking to /donate

- **Data source**: Import from `src/data/donors.json`:
  ```json
  {
    "donors": [
      {
        "name": "Sarah M.",
        "tier": "wave_maker",
        "date": "2026-01-15"
      },
      {
        "name": "Anonymous",
        "tier": "splash_supporter",
        "date": "2026-02-01"
      },
      {
        "name": "The Johnson Family",
        "tier": "tide_changer",
        "date": "2025-12-20"
      }
    ]
  }
  ```
  Include 5–8 sample entries across all three tiers so the component looks populated during development. I will replace these with real data.

- **Tier thresholds** (define in config or as constants):
  ```typescript
  const DONOR_TIERS = {
    tide_changer: { label: "Tide Changer", minAmount: 500, emoji: "🌊🌊🌊" },
    wave_maker: { label: "Wave Maker", minAmount: 100, emoji: "🌊🌊" },
    splash_supporter: { label: "Splash Supporter", minAmount: 25, emoji: "🌊" },
  };
  ```

---

### 7. Homepage Updates

Modify `src/app/page.tsx` to integrate the new Phase 2 components:

1. **Replace** the existing `FundraisingPlaceholder` component import and usage with the new `FundraisingBar` component
2. **Add** the `DonorWall` component as a new section directly below the `FundraisingBar`
3. **Update** the "Support Our Mission" CTA button in the hero section to link to `/donate` (it was previously a placeholder `#` link)
4. **Update** the `FundraisingPlaceholder` (or any other placeholder donate links throughout the site) to point to `/donate`
5. Keep all other homepage sections exactly as they are

**Updated homepage section order:**
1. HeroSection (existing — update donate link)
2. ImpactStats (existing — no changes)
3. MissionPreview (existing — no changes)
4. ServicesOverview (existing — no changes)
5. CoachSpotlights (existing — no changes)
6. FundraisingBar (**new** — replaces FundraisingPlaceholder)
7. DonorWall (**new**)
8. NewsletterPlaceholder (existing — no changes, Phase 3)

---

### 8. Navigation Update

Update the **Navbar** component:
- The "Donate" button (blue pill with heart icon) should now link to `/donate` instead of any placeholder
- Ensure the Donate button is visually active/highlighted when on the `/donate` page

Update the **Footer** component:
- In the "Quick Links" column, add "Support Us" linking to `/donate` (if not already present)

---

### 9. Donation Page in Navbar

Add "Donate" or "Support" as a navigation destination. The existing nav has: Home, About, Programs, Contact. There are two options:

- **Option A (preferred)**: Keep the nav links as they are (Home, About, Programs, Contact) and rely on the blue "Donate" pill button as the primary donation entry point. This is already in the nav.
- **Option B**: Add "Support" as a regular nav link alongside the others.

Go with **Option A** — the dedicated pill button is more effective for conversion than a text link.

---

## New Files to Create

```
src/
├── app/
│   ├── donate/
│   │   ├── page.tsx                          # Donation page
│   │   └── success/
│   │       └── page.tsx                      # Post-donation thank-you
│   └── api/
│       ├── create-checkout-session/
│       │   └── route.ts                      # Stripe Checkout session creation
│       └── stripe-webhook/
│           └── route.ts                      # Stripe webhook handler
├── components/
│   └── home/
│       ├── FundraisingBar.tsx                # Replaces FundraisingPlaceholder.tsx
│       └── DonorWall.tsx                     # New homepage section
├── lib/
│   └── stripe.ts                             # Stripe client initialization + helpers
└── data/
    └── donors.json                           # Donor wall data
```

## Files to Modify

```
src/
├── app/
│   └── page.tsx                              # Swap placeholder, add DonorWall, update links
├── components/
│   └── layout/
│       ├── Navbar.tsx                         # Update Donate button link to /donate
│       └── Footer.tsx                         # Add Support Us link if missing
└── data/
    └── config.ts                             # Add fundraisingConfig if not present
```

## Files to Delete (or leave as unused)

```
src/components/home/FundraisingPlaceholder.tsx   # Replaced by FundraisingBar.tsx
```

---

## Environment Variables

Add these to `.env.local` (and update `.env.local.example`):

```
# Stripe (Donations)
STRIPE_SECRET_KEY=sk_test_your_test_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Note: No STRIPE_PUBLISHABLE_KEY needed — we use Stripe Checkout (redirect), not embedded elements
```

Existing Phase 1 variables remain unchanged:
```
GOOGLE_SHEETS_PRIVATE_KEY=...
GOOGLE_SHEETS_CLIENT_EMAIL=...
GOOGLE_SHEETS_SPREADSHEET_ID=...
RESEND_API_KEY=...
NEXT_PUBLIC_SITE_URL=https://swimsforlife.com
```

---

## Code Style & Conventions

Same as Phase 1 — maintain consistency:

- **TypeScript strict mode**. Interfaces for all props. No `any`.
- **`"use client"`** only on components that need interactivity (the donation tier selector, recurring toggle, amount button). The donation page layout can be a server component with client sub-components.
- **PascalCase** components, **camelCase** functions, **SCREAMING_SNAKE_CASE** env vars.
- **`@/`** path alias for imports from `src/`.
- **Data in `src/data/`** — donor tiers, fundraising config, sample donors all live in data files, not hardcoded in components.
- **Error handling**: All API routes use try/catch with appropriate status codes.
- **Accessibility**: All interactive elements keyboard-accessible. Amount cards should be selectable via keyboard (use radio group pattern with proper aria attributes). Donate button has appropriate aria-label.

---

## Out of Scope for Phase 2

Do NOT build:

- Stripe embedded payment form (use Checkout redirect instead — simpler, fully PCI-compliant)
- Automatic donor wall updates via webhook (log the event, manual JSON update for now)
- Stripe Customer Portal for managing subscriptions (donors contact you directly to cancel)
- PayPal, Venmo, or any payment method beyond Stripe
- Donation history or donor accounts
- Photo/video gallery (Phase 3)
- Newsletter Mailchimp integration (Phase 3)
- Admin dashboard for managing donations

---

## Success Criteria

Phase 2 is complete when:

1. The `/donate` page renders with hero, amount selection grid, recurring toggle, donor wall opt-in checkbox, and donate button
2. Selecting a preset amount or entering a custom amount updates the donate button text dynamically (e.g., "Donate $50" or "Donate $50/month")
3. Clicking the donate button creates a Stripe Checkout Session and redirects the user to Stripe's hosted checkout page
4. One-time donations use `mode: 'payment'`; monthly donations use `mode: 'subscription'`
5. After successful payment, the user is redirected to `/donate/success` with a thank-you message and tax-deductible receipt language
6. Cancelling on Stripe redirects back to `/donate`
7. The Stripe webhook route receives events, verifies signatures, and logs checkout completions with donor metadata
8. The fundraising progress bar on the homepage displays the configured goal, current amount, and percentage with an animated fill
9. The donor wall on the homepage displays sample donors organized by tier
10. The "Donate" pill button in the navbar and all placeholder donate links across the site now link to `/donate`
11. The donation page is fully responsive (mobile, tablet, desktop) and matches the site's established design system
12. All amount cards are keyboard-accessible (arrow keys to navigate, enter/space to select)
13. The `.env.local.example` is updated with the new Stripe environment variables
14. The site builds without errors with `next build`

---

## When in Doubt

- **Design**: Match the established design system from Phase 1. Use the same colors, typography, button styles, section rhythm, and animation patterns. When in doubt, keep it clean and minimal.
- **Stripe complexity**: Prefer Stripe Checkout (redirect) over embedded forms. It's simpler, handles all PCI compliance, and looks professional out of the box.
- **Donor wall data**: Use the sample JSON data provided. Don't over-engineer an auto-update system — manual JSON editing is fine for a small non-profit.
- **Fundraising numbers**: Use the placeholder values in `fundraisingConfig`. I will update them with real numbers.
- **Scope**: If something feels like it belongs in Phase 3, skip it. The goal is a working, polished donation flow.
