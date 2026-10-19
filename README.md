# KaaryaMithra — Hyperlocal Unorganised Workforce Integration & Service Discovery Platform

> **Tagline:** Every Skill Matters. Every Worker Deserves an Opportunity.  
> **Repository:** [https://github.com/greeshmavasupalli/KaaryaMithra](https://github.com/greeshmavasupalli/KaaryaMithra)

---

## 1. Product Overview

**KaaryaMithra** is a responsive, mobile-first, hyperlocal workforce discovery and service enquiry platform. It provides an inclusive, transparent discovery layer for unorganised tradespeople and informal workers (plumbers, electricians, carpenters, domestic cleaners, cooks, painters, masons, and technicians) who are overlooked or excluded by high-commission corporate platforms.

### Key Innovations & Principles:
- **Zero Platform Fees for Workers:** Workers are never charged commission cuts, listing fees, or lead unlocking fees.
- **Mutual Contact Privacy:** Personal phone numbers are never displayed on public search cards or search engine results. Direct contact is only unlocked when a worker explicitly accepts an enquiry.
- **Factual, Honest Trust Safeguards:** Prohibits fabricated marketing labels (e.g. "certified master" or "background checked"). Only verified factual indicators are allowed: *Phone confirmed* (via OTP), *Community reference added*, and *Skill evidence submitted*, each with an explanatory tooltip.
- **Multi-Lingual (i18n):** Full support for English, हिन्दी (Hindi), and తెలుగు (Telugu) across navigation, hero, search, CTAs, and trust labels.
- **One-Click Reviewer Demo Mode:** Integrated banner with instant switching between Customer, Worker, and Moderator roles without needing manual database credentials.

---

## 2. Tech Stack Architecture

- **Frontend:** React 18, React Router v6, Tailwind CSS, Lucide Icons, Vite, Vitest + React Testing Library.
- **Backend:** Node.js, Express REST API, Layered Architecture (Routes, Controllers, Services, Validators).
- **Database:** MongoDB + Mongoose with schema-level validation, compound indexes, text indexes, and timestamps.
- **Zero-Setup Database Fallback:** Automatic detection of local MongoDB (`mongodb://127.0.0.1:27017/skilldost`); if local MongoDB is not running, seamlessly initializes `mongodb-memory-server` in-memory fallback.
- **Authentication:** bcrypt password hashing (10 salt rounds) + JWT stored in secure `httpOnly` cookies with cross-origin token fallback.
- **Security Middleware:** Helmet HTTP security headers, CORS allowlist, Express rate-limiting, NoSQL query injection sanitization, and request payload size limits.
- **Validation:** Authoritative Zod schemas shared on server and client for robust data integrity.

---

## 3. Project Structure

```
KaaryaMithra/
├── client/                     # Vite + React Frontend
│   ├── public/                 # Static assets & icons
│   ├── src/
│   │   ├── components/         # Reusable UI components & common widgets
│   │   ├── context/            # AuthContext & LanguageContext providers
│   │   ├── i18n/               # Multi-language dictionaries (EN, HI, TE)
│   │   ├── pages/              # Route pages (Home, Search, Profile, Dashboards, Admin)
│   │   ├── services/           # Axios / Fetch API client abstractions
│   │   ├── styles/             # Global CSS & Tailwind configuration
│   │   └── tests/              # Frontend component unit & integration tests
│   ├── index.html              # HTML5 entry with SEO tags
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Express REST API Backend
│   ├── src/
│   │   ├── config/             # DB connection, constants, environment settings
│   │   ├── controllers/        # Express route request handlers
│   │   ├── middlewares/        # Auth, role guard, error handler, rate limiter
│   │   ├── models/             # Mongoose schemas (User, WorkerProfile, Enquiry, etc.)
│   │   ├── routes/             # API routes (/auth, /workers, /categories, /enquiries, /admin)
│   │   ├── seed/               # Fictional Andhra Pradesh dataset & seed runner
│   │   ├── tests/              # Backend integration test suite
│   │   ├── app.js              # Express app setup with middleware stack
│   │   └── server.js           # Server bootstrap & DB connection
│   ├── package.json
│   └── .env.example
├── .gitignore
├── package.json                # Monorepo workspaces config
└── README.md
```

---

## 4. Getting Started & Commands

### Prerequisites
- Node.js `v18+` (Tested on `v20+` and `v24+`)
- npm `v9+`
- MongoDB (Optional: Local service or in-memory fallback automatically engaged)

### Step 1: Install Dependencies
Install all workspace dependencies across client and server:
```bash
npm install
```

### Step 2: Seed Prototype Database
Populates 12 categories, 32+ realistic worker profiles (focused on Andhra Pradesh localities like Visakhapatnam, Vijayawada, Guntur), demo accounts, active enquiries, and pending moderation reports:
```bash
npm run seed:reset
# or
npm run seed
```

### Step 3: Run Full-Stack Development Servers
Starts both the Express API (`http://localhost:5000`) and the Vite React client (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

Alternatively, run client and server independently:
```bash
# Terminal 1: Backend API (Port 5000)
npm run dev:server

# Terminal 2: Frontend Client (Port 5173)
npm run dev:client
```

### Step 4: Run Tests
Executes the comprehensive Vitest test suite across backend API integration and frontend components:
```bash
npm test

# Or independently:
npm run test:server   # 23 tests (Health, Discovery, Auth, Workflow, Safeguards)
npm run test:client   # 4 tests (TrustBadges, Cards, Navbar branding)
```

### Step 5: Lint & Production Build
```bash
npm run lint          # ESLint code hygiene check
npm run build         # Vite production bundle generation
```

---

## 5. Demo Accounts & Reviewer Walkthroughs

KaaryaMithra features a persistent **Demo Mode Bar** at the top of every page. Reviewers can click any button to instantaneously log in and experience that role without entering credentials.

| Role | Email | Password | Suggested Focus |
|---|---|---|---|
| **Platform Moderator** | `admin@skilldost.demo` | `admin123` | Moderate reports, audit logs, metrics |
| **Customer (Ananya)** | `ananya.customer@skilldost.demo` | `demo123` | Search, send enquiry, track status, feedback |
| **Customer (Vikram)** | `vikram.customer@skilldost.demo` | `demo123` | Telugu UI, submit new service requests |
| **Worker (Ramesh - Electrician)** | `ramesh.electrician@skilldost.demo` | `demo123` | Profile editor, availability toggle, accept job |
| **Worker (Lakshmi - House Cleaning)** | `lakshmi.cleaning@skilldost.demo` | `demo123` | Completed job review, service radius |
| **Worker (Suresh - Plumber)** | `suresh.plumber@skilldost.demo` | `demo123` | Emergency leaks, respond to enquiries |

> **Simulated Phone OTP Code:** When testing phone confirmation during registration or profile updates, use prototype code `123456`.

---

### Reviewer Walkthrough 1: Customer Journey
1. Open `http://localhost:5173/`.
2. Notice the clean branding, tagline, and multi-lingual language selector (English / Hindi / Telugu).
3. In the search bar, enter `Plumber` and locality `Gajuwaka` (or click on any popular category chip).
4. Review the search results list. Filter by availability (`Available Now`) or Trust Safeguard (`Phone Confirmed`).
5. Click **View Profile** on `Suresh Varma`.
6. Inspect his skills, indicative pricing (`₹200 – ₹900`), and hover over the trust badges to read the factual safeguard explanations.
7. Click **Send Enquiry**. Fill in message: *"Water leakage near shower mixer"*, and select preferred time.
8. Submit the enquiry. You are redirected to `/customer/dashboard` where your enquiry is listed as `New`.
9. Click **View Timeline & Contact** to inspect the live status progression.

---

### Reviewer Walkthrough 2: Worker Journey
1. Click **Try as Worker (Ramesh - Electrician)** in the top Demo Banner.
2. You are directed to `/worker/dashboard`.
3. Review your **Profile Readiness bar (90%+)**, current average rating (`4.8` stars), and incoming enquiries.
4. Click **Set as Busy** to toggle your availability; observe the status change in real time.
5. Click **Manage Enquiries** to go to `/worker/enquiries`.
6. Locate a `New` customer enquiry.
7. Click **Accept Enquiry (Unlock Phone)**. Notice that the customer's contact phone is now revealed for direct coordination.
8. Click **Edit Profile & Services** (`/worker/profile/edit`). Update your indicative charges or service radius slider, and click **Preview** to verify the public card rendering before saving.

---

### Reviewer Walkthrough 3: Administrator & Moderation Journey
1. Click **Try as Admin** in the top Demo Banner.
2. You are directed to `/admin`.
3. In the **Reports Queue** tab, observe seeded pending community reports (e.g., reported misleading price info or unreachable listing).
4. Click **Triage & Resolve** on a pending report.
5. Enter resolution notes: *"Contacted provider: confirmed pricing conforms to emergency Sunday rate policy."*
6. Choose action: *Mark as Resolved*, and submit.
7. Switch to the **Audit Log** tab. Confirm that your action (`RESOLVE_REPORT_NONE`) is logged with an immutable actor ID and timestamp.
8. Switch to the **Platform Metrics** tab to review aggregate counts of workers, customers, enquiries, and categories.

---

## 6. API Reference Summary

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/api/health` | GET | Public | Server status and uptime verification |
| `/api/categories` | GET | Public | List of 12 service trade categories |
| `/api/workers` | GET | Public | Hyperlocal worker search and radius discovery |
| `/api/workers/:id` | GET | Public | Detailed worker profile and trust safeguards |
| `/api/auth/register` | POST | Public | Register customer or worker |
| `/api/auth/login` | POST | Public | JWT login with httpOnly cookie |
| `/api/auth/me` | GET | Authenticated | Retrieve current session user |
| `/api/enquiries` | POST | Customer | Submit a service request to a worker |
| `/api/enquiries/my` | GET | Authenticated | List enquiries for customer or worker |
| `/api/enquiries/:id/status`| PATCH | Worker | Accept/reject enquiry (unlocks mutual contact) |
| `/api/admin/reports` | GET | Admin | View user reports moderation queue |
| `/api/admin/metrics` | GET | Admin | Platform statistics & overview |

---

## 7. Assumptions & Operating Decisions

1. **Local Prototype Mode:** Fictional seed data is localized around Andhra Pradesh (Visakhapatnam, Gajuwaka, MVP Colony, Vijayawada, Guntur) with culturally realistic names and trades.
2. **Simulated OTP:** Fixed demo code `123456` verifies phone numbers without requiring paid third-party SMS gateway credentials (Twilio/MSG91).
3. **No Paid Maps API:** Approximate location matching and distance radius filters use locality text search and km radius calculations rather than Google Maps Geocoding API keys.
4. **Voice Onboarding:** Marked as a clearly labeled *"Coming soon in future update"* module rather than a misleading pseudo-functional control.

---

## 8. License & Disclaimers

KaaryaMithra is an open-source prototype created for the **Seva First Innovation Challenge**. All seed profiles, feedback records, and telephone numbers are fictional and intended solely for demonstration and academic evaluation.
