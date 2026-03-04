# Swim for Life — swimsforlife.com

A modern website for Swim for Life, a 501(c)(3) non-profit providing free adaptive swim lessons to children of all abilities in North Palm Beach, FL.

## Tech Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Email**: Resend
- **Google Sheets**: googleapis

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.local.example .env.local
```

Required variables:

| Variable | Description |
|---|---|
| `GOOGLE_SHEETS_PRIVATE_KEY` | Google service account private key (with newlines as `\n`) |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | Google service account email |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | Target Google Sheet ID |
| `RESEND_API_KEY` | Resend API key for transactional emails |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (e.g., `https://swimsforlife.com`) |

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/           # Next.js App Router pages and API routes
├── components/    # React components (layout, home, ui, forms)
├── data/          # Static content data files
├── lib/           # Utility modules (Google Sheets, Resend, validations)
└── styles/        # Global CSS
```

## Deployment

Configured for Vercel. Push to your Git repository and connect to Vercel for automatic deployments.
