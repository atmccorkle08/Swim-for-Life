# Claude Code Prompt — Swim for Life Website: Phase 4 (Supabase Migration & Automation)

## Project Context

This is **Phase 4** of a 4-phase website rebuild for **Swim for Life** (swimsforlife.com), a 501(c)(3) non-profit in North Palm Beach, FL that provides free adaptive swim lessons to children of all abilities, specializing in those with intellectual and developmental disabilities (IDD).

**Phases 1–3 are complete.** The site is a Next.js 14+ App Router project with TypeScript, and Tailwind CSS. It is deployed on Vercel. Here's what currently exists:

- **Phase 1 (Core)**: Homepage, About, Programs, Register, FAQ, Contact pages. Registration form submits to Google Sheets API via a service account. Confirmation emails to parents and notification emails to coaches via Resend.
- **Phase 2 (Donations)**: Stripe donation page with preset/custom amounts, one-time and recurring giving, Stripe Checkout redirect. Thank-you page. Fundraising progress bar on homepage reads from a static config in `src/data/config.ts`. Donor wall on homepage reads from a static `src/data/donors.json` file. Stripe webhook route exists but only logs events.
- **Phase 3 (Engagement)**: Photo/video gallery with lightbox, YouTube embeds. Newsletter signup integrated with Mailchimp.

**Phase 4 does the following:**
1. Introduces Supabase as the project's database
2. Migrates registration storage from Google Sheets API to Supabase
3. Migrates the donor wall from a static JSON file to a Supabase table
4. Migrates the fundraising progress bar from static config to a Supabase table
5. Updates the Stripe webhook to auto-insert donors and auto-update campaign totals in Supabase
6. Optionally syncs new registrations to Google Sheets so coaches retain spreadsheet access

After Phase 4, the site has zero manual data management — registrations, donations, donor recognition, and fundraising progress are all automated.

---

## Tech Stack Additions for Phase 4

Everything from Phases 1–3 remains. Add:

- **Database**: Supabase (PostgreSQL) via `@supabase/supabase-js` npm package
- **No other new libraries needed**

Remove after migration is confirmed working:
- `googleapis` npm package (Google Sheets API) — only if you choose NOT to keep the Google Sheets sync. If keeping the sync, retain it.

---

## Database Schema

Create these tables in Supabase. The SQL below should be run in the Supabase SQL Editor.

```sql
-- ============================================
-- REGISTRATIONS TABLE
-- Replaces Google Sheets as the primary store
-- ============================================
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  child_name TEXT NOT NULL,
  child_age INTEGER NOT NULL CHECK (child_age >= 3 AND child_age <= 18),
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  swim_experience TEXT NOT NULL CHECK (swim_experience IN ('none', 'beginner', 'some')),
  has_special_needs BOOLEAN DEFAULT FALSE,
  special_needs_details TEXT,
  session_preference TEXT,
  photo_release_consent BOOLEAN NOT NULL DEFAULT FALSE,
  liability_waiver_agreed BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'confirmed', 'completed', 'cancelled'))
);

-- Index for coaches filtering by status
CREATE INDEX idx_registrations_status ON registrations(status);
-- Index for sorting by date
CREATE INDEX idx_registrations_created ON registrations(created_at DESC);

-- ============================================
-- DONORS TABLE
-- Replaces donors.json
-- ============================================
CREATE TABLE donors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('splash_supporter', 'wave_maker', 'tide_changer')),
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  display_consent BOOLEAN NOT NULL DEFAULT FALSE,
  is_recurring BOOLEAN DEFAULT FALSE,
  stripe_session_id TEXT UNIQUE,
  stripe_customer_id TEXT
);

-- Index for donor wall queries (only show those who opted in)
CREATE INDEX idx_donors_display ON donors(display_consent) WHERE display_consent = TRUE;
-- Index for tier grouping
CREATE INDEX idx_donors_tier ON donors(tier);

-- ============================================
-- CAMPAIGNS TABLE
-- Replaces fundraisingConfig in config.ts
-- ============================================
CREATE TABLE campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  label TEXT NOT NULL,
  goal_amount DECIMAL(10, 2) NOT NULL CHECK (goal_amount > 0),
  current_amount DECIMAL(10, 2) DEFAULT 0 CHECK (current_amount >= 0),
  is_active BOOLEAN DEFAULT TRUE
);

-- Only one campaign should be active at a time
CREATE UNIQUE INDEX idx_campaigns_active ON campaigns(is_active) WHERE is_active = TRUE;

-- Insert the default campaign (transfer your current values from config.ts)
INSERT INTO campaigns (label, goal_amount, current_amount, is_active)
VALUES ('Help us fund Summer 2026 sessions', 5000, 0, true);

-- ============================================
-- CONTACT SUBMISSIONS TABLE (bonus)
-- If the contact page has a form, store submissions here
-- ============================================
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE
);

-- ============================================
-- ROW LEVEL SECURITY
-- All tables use RLS. Access is through the service role key
-- in API routes only — no direct client-side access.
-- ============================================
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Service role key bypasses RLS automatically.
-- No additional policies needed since all access goes through
-- server-side API routes using the service role key.

-- ============================================
-- HELPER FUNCTION: Auto-update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

Include this SQL in a file at `supabase/schema.sql` in the project root for reference. Do NOT run it from the application — it's meant to be run once manually in the Supabase SQL Editor during setup.

---

## Environment Variables

Add to `.env.local` (and Vercel environment variables):

```
# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key
```

Keep existing variables. After confirming the Supabase migration works, the Google Sheets variables become optional (only needed if you keep the sync):

```
# Google Sheets (optional — only if keeping sync for coaches)
GOOGLE_SHEETS_PRIVATE_KEY=...
GOOGLE_SHEETS_CLIENT_EMAIL=...
GOOGLE_SHEETS_SPREADSHEET_ID=...
```

Update `.env.local.` to reflect all current variables with clear comments about which are required vs optional.

---

## Files to Create

### 1. Supabase Client (`src/lib/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
```

This client uses the **service role key**, which bypasses Row Level Security. It must ONLY be used in server-side code (API routes, server components). Never import this file in a `"use client"` component.

### 2. Database Type Definitions (`src/lib/database.types.ts`)

Create TypeScript types that match the database schema:

```typescript
export interface Registration {
  id: string;
  created_at: string;
  child_name: string;
  child_age: number;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  swim_experience: 'none' | 'beginner' | 'some';
  has_special_needs: boolean;
  special_needs_details: string | null;
  session_preference: string | null;
  photo_release_consent: boolean;
  liability_waiver_agreed: boolean;
  status: 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Donor {
  id: string;
  created_at: string;
  name: string;
  tier: 'splash_supporter' | 'wave_maker' | 'tide_changer';
  amount: number;
  display_consent: boolean;
  is_recurring: boolean;
  stripe_session_id: string | null;
  stripe_customer_id: string | null;
}

export interface Campaign {
  id: string;
  created_at: string;
  updated_at: string;
  label: string;
  goal_amount: number;
  current_amount: number;
  is_active: boolean;
}

export interface ContactSubmission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
}
```

### 3. Database Helper Functions (`src/lib/db.ts`)

Create a clean abstraction layer over Supabase queries. This file is the ONLY place that imports the Supabase client — all API routes and server components go through these functions:

```typescript
// Registration functions
insertRegistration(data: Omit<Registration, 'id' | 'created_at' | 'status'>): Promise<Registration>
getRegistrations(status?: string): Promise<Registration[]>
updateRegistrationStatus(id: string, status: Registration['status']): Promise<Registration>

// Donor functions
insertDonor(data: Omit<Donor, 'id' | 'created_at'>): Promise<Donor>
getVisibleDonors(): Promise<Donor[]>  // WHERE display_consent = true, ordered by tier then date
getDonorByStripeSession(sessionId: string): Promise<Donor | null>  // prevent duplicates

// Campaign functions
getActiveCampaign(): Promise<Campaign | null>
incrementCampaignAmount(amount: number): Promise<Campaign>  // adds to current_amount

// Contact functions
insertContactSubmission(data: Omit<ContactSubmission, 'id' | 'created_at' | 'is_read'>): Promise<ContactSubmission>
```

Each function should:
- Call the Supabase client
- Handle errors gracefully (throw descriptive errors that the API route can catch)
- Return typed data

### 4. Schema Reference (`supabase/schema.sql`)

Place the full SQL schema from above in this file for documentation purposes.

---

## Files to Modify

### 5. Registration API Route (`src/app/api/register/route.ts`)

**Current behavior**: Validates form → writes to Google Sheets → sends emails → returns success.

**New behavior**: Validates form → inserts into Supabase `registrations` table → sends emails → optionally syncs to Google Sheets → returns success.

Specific changes:
- Replace the Google Sheets `appendRegistration()` call with the Supabase `insertDonor()` call from `src/lib/db.ts`
- The Zod validation schema stays exactly the same
- The Resend email logic stays exactly the same
- Error handling: If the Supabase insert fails, return 500. If emails fail after a successful insert, still return success (emails are non-critical, same as before).

**Optional Google Sheets sync**: If you want coaches to still see registrations in Google Sheets, add the Google Sheets write as a secondary operation AFTER the Supabase insert. If the Sheets sync fails, log the error but don't fail the request — Supabase is the source of truth.

```
// New flow:
1. Validate with Zod
2. Insert into Supabase (primary — must succeed)
3. Send confirmation email to parent via Resend (non-critical)
4. Send notification email to coaches via Resend (non-critical)
5. Sync to Google Sheets (optional, non-critical)
6. Return success
```

### 6. Stripe Webhook Route (`src/app/api/stripe-webhook/route.ts`)

**Current behavior**: Verifies signature, logs events, does nothing else.

**New behavior**: Verifies signature, processes `checkout.session.completed` events to auto-populate the donor wall and auto-update the fundraising campaign.

On `checkout.session.completed`:

```
1. Extract from session:
   - amount_total (in cents — divide by 100)
   - metadata.donorName
   - metadata.displayConsent ("true" / "false" string)
   - metadata.recurring ("true" / "false" string)
   - session.id (for deduplication)

2. Determine donor tier:
   - amount >= 500 → "tide_changer"
   - amount >= 100 → "wave_maker"
   - amount >= 25  → "splash_supporter"
   - amount < 25   → "splash_supporter" (minimum tier for any donation)

3. Check if this session ID already exists in donors table (prevent duplicate processing):
   - Call getDonorByStripeSession(session.id)
   - If exists, skip insertion and return 200

4. If displayConsent is "true" and donorName is present:
   - Insert into donors table via insertDonor()

5. Update the active campaign's current_amount:
   - Call incrementCampaignAmount(amount)

6. Return 200
```

Handle edge cases:
- If there's no active campaign, log a warning but don't fail
- If the donor insert fails (e.g., duplicate stripe_session_id), log and continue
- Always return 200 to Stripe unless signature verification fails (return 400)

### 7. FundraisingBar Component (`src/components/home/FundraisingBar.tsx`)

**Current behavior**: Imports static values from `src/data/config.ts`.

**New behavior**: Fetches the active campaign from Supabase at render time (server component).

Changes:
- Remove the import from `src/data/config.ts` for fundraising data
- Import `getActiveCampaign` from `src/lib/db.ts`
- Call `getActiveCampaign()` at the top of the component (this works because it's a server component — no `useEffect` or `useState` needed)
- If no active campaign is returned, don't render the section (same behavior as the old `isActive: false`)
- All visual styling, animation, and layout stay exactly the same
- The only change is where the numbers come from

**Important**: This component should remain a **server component** (no `"use client"` directive). Fetching data from Supabase in a server component means the query runs on the server at request time, the data is embedded in the HTML sent to the browser, there's no loading spinner or client-side fetch, and the Supabase service role key is never exposed to the client.

If the FundraisingBar is currently a client component (because of Framer Motion animations), split it into a server wrapper that fetches data and a client child that handles animation:

```
FundraisingBar.tsx (server component)
  → fetches campaign data from Supabase
  → passes data as props to:
    FundraisingBarClient.tsx (client component, "use client")
      → receives data via props
      → handles Framer Motion animation
      → renders the progress bar
```

### 8. DonorWall Component (`src/components/home/DonorWall.tsx`)

**Current behavior**: Imports static data from `src/data/donors.json`.

**New behavior**: Fetches visible donors from Supabase at render time (server component).

Changes:
- Remove the import from `src/data/donors.json`
- Import `getVisibleDonors` from `src/lib/db.ts`
- Call `getVisibleDonors()` at the top of the component
- Group the returned donors by tier for display
- If no donors exist, show the "Be the first!" messaging for each tier
- All visual styling and layout stay exactly the same

Apply the same server/client component split as FundraisingBar if needed for animations.

### 9. Homepage (`src/app/page.tsx`)

Minimal changes:
- If FundraisingBar and DonorWall were previously synchronous imports with static data, they now use async data fetching. If the homepage is a server component (which it should be), this works naturally with `async/await` at the page level.
- If needed, make the page component `async` and await the data before passing it as props.

### 10. Data Config Cleanup (`src/data/config.ts`)

- Remove `fundraisingConfig` from this file (it now lives in the Supabase `campaigns` table)
- Keep any other config values that aren't database-driven (e.g., site metadata, announcement bar text)

### 11. Donor Data Cleanup

- Delete `src/data/donors.json` (replaced by Supabase `donors` table)
- If any component still imports from it, update the import

### 12. Contact Page (Optional Enhancement)

If the Contact page has a contact form, update its API route (`src/app/api/contact/route.ts` — create if it doesn't exist) to insert submissions into the Supabase `contact_submissions` table instead of (or in addition to) sending a mailto or email.

---

## Updated File Structure (Phase 4 additions/changes)

```
swimsforlife/
├── supabase/
│   └── schema.sql                              # NEW — SQL schema for reference
├── src/
│   ├── app/
│   │   ├── page.tsx                             # MODIFY — may need async for data fetching
│   │   └── api/
│   │       ├── register/
│   │       │   └── route.ts                     # MODIFY — Supabase insert + optional Sheets sync
│   │       ├── stripe-webhook/
│   │       │   └── route.ts                     # MODIFY — auto-insert donors, update campaign
│   │       └── contact/
│   │           └── route.ts                     # NEW or MODIFY — Supabase insert
│   ├── components/
│   │   └── home/
│   │       ├── FundraisingBar.tsx               # MODIFY — fetch from Supabase
│   │       ├── FundraisingBarClient.tsx         # NEW (if needed) — client animation wrapper
│   │       ├── DonorWall.tsx                    # MODIFY — fetch from Supabase
│   │       └── DonorWallClient.tsx              # NEW (if needed) — client animation wrapper
│   ├── lib/
│   │   ├── supabase.ts                          # NEW — Supabase client
│   │   ├── database.types.ts                    # NEW — TypeScript types for all tables
│   │   ├── db.ts                                # NEW — database helper functions
│   │   ├── google-sheets.ts                     # KEEP (optional sync) or DELETE
│   │   ├── stripe.ts                            # KEEP — no changes
│   │   ├── resend.ts                            # KEEP — no changes
│   │   └── validations.ts                       # KEEP — no changes
│   └── data/
│       ├── config.ts                            # MODIFY — remove fundraisingConfig
│       ├── donors.json                          # DELETE — replaced by Supabase
│       ├── coaches.ts                           # KEEP — no changes
│       ├── faq.ts                               # KEEP — no changes
│       ├── services.ts                          # KEEP — no changes
│       └── stats.ts                             # KEEP — no changes
├── .env.local                                   # MODIFY — add Supabase vars
└── .env.local.example                           # MODIFY — document all vars
```

---

## Environment Variables (Complete List After Phase 4)

Update `.env.local.example` to show the full set:

```
# ============================================
# REQUIRED
# ============================================

# Supabase (Database — registrations, donors, campaigns)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key

# Stripe (Donations)
STRIPE_SECRET_KEY=sk_test_your_test_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Resend (Transactional Emails)
RESEND_API_KEY=re_your_api_key_here

# Mailchimp (Newsletter)
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_LIST_ID=your_list_id

# Site
NEXT_PUBLIC_SITE_URL=https://swimsforlife.com

# ============================================
# OPTIONAL (Google Sheets sync for coaches)
# ============================================

# Google Sheets API — only needed if syncing registrations to a spreadsheet
# GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
# GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
# GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id-here
```

---

## Code Style & Conventions

Same as all previous phases. Additional conventions for Phase 4:

- **All Supabase access goes through `src/lib/db.ts`** — never import the Supabase client directly in API routes or components. This creates a single point of change if you ever swap databases.
- **Server components for data fetching** — FundraisingBar and DonorWall should fetch data as server components. Split into server (data) + client (animation) wrappers if needed.
- **Never import `src/lib/supabase.ts` in `"use client"` components** — the service role key must stay server-side.
- **Idempotent webhook processing** — always check for existing `stripe_session_id` before inserting a donor to prevent duplicates from webhook retries.
- **Graceful degradation** — if a Supabase query fails in a display component (FundraisingBar, DonorWall), render a fallback or hide the section. Don't crash the page.

---

## Migration Verification Checklist

After Phase 4 is built, verify the migration by testing each flow:

### Registration Flow
1. Submit a registration form on the site
2. Verify: New row appears in Supabase `registrations` table (check Supabase dashboard → Table Editor)
3. Verify: Confirmation email received by parent
4. Verify: Notification email received by coaches
5. Verify: (If sync enabled) New row also appears in Google Sheet

### Donation Flow
1. Make a test donation using Stripe test card `4242 4242 4242 4242`
2. Opt in to donor wall display during checkout
3. Verify: Redirected to /donate/success after payment
4. Verify: New row in Supabase `donors` table with correct tier, amount, and display_consent
5. Verify: `campaigns` table `current_amount` increased by the donation amount
6. Verify: Donor name now appears on the donor wall on the homepage
7. Verify: Fundraising progress bar reflects the new total

### Recurring Donation Flow
1. Make a test recurring donation
2. Verify: Same as above, plus `is_recurring` is true in the donors table

### Duplicate Webhook Protection
1. Use Stripe CLI to resend a webhook event
2. Verify: No duplicate donor entry is created

### Edge Cases
1. Donate without opting in to donor wall → donor row exists but `display_consent` is false → name does NOT appear on wall
2. Donate less than $25 → tier should be `splash_supporter`
3. Submit registration with special needs checkbox unchecked → `has_special_needs` is false, `special_needs_details` is null
4. View homepage when no active campaign exists → FundraisingBar section does not render

---

## Out of Scope for Phase 4

Do NOT build:

- Admin dashboard or CMS for managing data (coaches use the Supabase Table Editor directly)
- User authentication or login
- Real-time subscriptions (Supabase supports these, but they're not needed — standard server-side fetching with page reloads or revalidation is sufficient)
- Supabase Edge Functions (not needed — Next.js API routes handle all server logic)
- Database migrations tooling (the schema is simple enough to manage manually; if it grows, consider adding Supabase CLI migrations later)
- Automatic Google Sheets sync beyond registration data

---

## Success Criteria

Phase 4 is complete when:

1. The Supabase database has all four tables created and working (`registrations`, `donors`, `campaigns`, `contact_submissions`)
2. Registration form submissions are stored in Supabase (not just Google Sheets)
3. The Stripe webhook automatically inserts donors into the `donors` table when `displayConsent` is true
4. The Stripe webhook automatically increments the active campaign's `current_amount`
5. The FundraisingBar component reads from the Supabase `campaigns` table (not `config.ts`)
6. The DonorWall component reads from the Supabase `donors` table (not `donors.json`)
7. Duplicate webhook events do not create duplicate donor entries
8. If no active campaign exists, the FundraisingBar gracefully hides
9. If no visible donors exist, the DonorWall shows appropriate empty state messaging
10. All existing functionality from Phases 1–3 continues to work without regression
11. The `.env.local.example` is updated with Supabase variables and clear documentation
12. The `supabase/schema.sql` file exists in the project root for reference
13. `src/data/donors.json` is deleted and `fundraisingConfig` is removed from `config.ts`
14. The site builds without errors with `next build`

---

## When in Doubt

- **Data access pattern**: Always go through `src/lib/db.ts`. Never query Supabase directly from components or API routes.
- **Server vs client**: Fetch data in server components. Pass it as props to client components for interactivity/animation.
- **Error handling**: Supabase queries can fail. Wrap in try/catch. For display components, fail gracefully (hide section). For API routes, return appropriate error responses.
- **Google Sheets**: If the Google Sheets sync adds significant complexity, skip it. The Supabase Table Editor provides a similar spreadsheet-like view that coaches can use directly.
- **Keep it simple**: Supabase has many advanced features (real-time, edge functions, auth, storage). For this project, we only need basic CRUD operations via the JavaScript client. Don't over-engineer.
