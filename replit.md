# Edward & Amaury Solicitors — Lead Generation Website

## Overview

A lead generation website for Edward & Amaury Solicitors (Carlisle, Cumbria). Two separate landing pages each with a routing quiz, contact form (Cloudflare Turnstile protected), and personalised thank you pages.

## Architecture

pnpm workspace monorepo with:
- **Frontend**: React + Vite (`artifacts/ea-solicitors/`) — serves at `/`
- **API Server**: Express 5 (`artifacts/api-server/`) — serves at `/api`

## Pages

- `/wills-and-probate` — Wills & Probate landing page
- `/wills-and-probate/quiz` — Routing quiz (4 paths: probate, wills, both, not-sure)
- `/wills-and-probate/thank-you` — Personalised thank you
- `/uk-spouse-visa` — Immigration Spouse Visa landing page
- `/uk-spouse-visa/quiz` — Weighted scoring quiz (7 questions, max 21 pts)
- `/uk-spouse-visa/thank-you` — Personalised thank you (strong/challenges/expert)

## API Endpoints

- `POST /api/leads/wills` — Submit Wills & Probate lead
- `POST /api/leads/visa` — Submit Spouse Visa lead

On submission each endpoint:
1. Verifies Cloudflare Turnstile token
2. Appends row to Google Sheet (separate tabs)
3. Sends notification email to firm
4. Sends confirmation email to lead

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Validation**: Zod (via Orval codegen)
- **Email**: nodemailer (SMTP)
- **Sheets**: Google Sheets API v4 (googleapis)

## Environment Variables / Secrets Required

Set these in Replit Secrets:

| Secret | Purpose |
|--------|---------|
| `TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key (frontend) |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key (backend) |
| `GOOGLE_SHEETS_CREDENTIALS` | JSON string of Google service account credentials |
| `GOOGLE_SHEET_ID` | The Google Spreadsheet ID |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP port (usually 587 or 465) |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `NOTIFICATION_EMAIL` | Email address to receive lead notifications |
| `FROM_EMAIL` | From address for outbound emails |

Frontend env vars (prefix with `VITE_` for frontend use):
| Variable | Purpose |
|----------|---------|
| `VITE_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key (same value as TURNSTILE_SITE_KEY) |
| `VITE_GA4_MEASUREMENT_ID` | Google Analytics 4 Measurement ID |
| `VITE_GOOGLE_ADS_CONVERSION_ID` | Google Ads Conversion ID |
| `VITE_GOOGLE_ADS_CONVERSION_LABEL_WILLS` | Google Ads label for Wills funnel |
| `VITE_GOOGLE_ADS_CONVERSION_LABEL_VISA` | Google Ads label for Visa funnel |

**The site works without any of these — tracking/email/sheets are all skipped gracefully.**

## Client Info

- **Firm**: Edward & Amaury Solicitors
- **Phone**: 01228 272395
- **SRA No**: 800525
- **Location**: Carlisle, Cumbria

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks from OpenAPI spec
- `pnpm --filter @workspace/api-server run dev` — run API server locally
