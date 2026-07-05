# ZACO Global Scholars — Full Platform

A complete study-abroad platform: public site, Supabase authentication, student dashboard
(profile, documents, inquiries, application tracking, payments), admin console, and
WhatsApp integration. Countries and scholarships are hidden by default — visitors search
for a country, then see its universities, and only see scholarships after picking a country.

## What's included

```
zaco-global-scholars/
├── public/assets/          Your logo files
├── src/
│   ├── components/         Navbar, Footer, WhatsAppButton, ProtectedRoute
│   ├── context/            AuthContext (Supabase session/profile)
│   ├── data/                countries.js, universities.js, scholarships.js
│   ├── lib/supabaseClient.js
│   ├── pages/
│   │   ├── Home.jsx              Landing page + public inquiry form
│   │   ├── Explore.jsx           Hidden countries/universities/scholarships explorer
│   │   ├── Login.jsx / Register.jsx
│   │   ├── StudentDashboard.jsx  Profile, Documents, Inquiries, Applications, Payments
│   │   ├── AdminDashboard.jsx    Manage inquiries, applications, payments, students
│   │   └── Payment.jsx           Manual payment logging page
│   └── App.jsx / main.jsx
├── supabase/schema.sql     Run this in your Supabase project
├── .env.example
└── package.json
```

## Step 1 — Install dependencies

You need [Node.js](https://nodejs.org) 18+ installed on your computer.

```bash
cd zaco-global-scholars
npm install
```

## Step 2 — Set up Supabase (database, auth, storage)

Your project is already created:
- URL: `https://pavdptrszsjdytgedrgi.supabase.co`
- Publishable key: `sb_publishable_6X_C7tXRN5_gzUh73xFK8A_Dgmcso1U`

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → open your project.
2. Click **SQL Editor** → **New query**.
3. Open `supabase/schema.sql` from this project, paste its entire contents, and click **Run**.
   This creates:
   - `profiles`, `inquiries`, `documents`, `applications`, `payments` tables
   - Row Level Security policies (students only see their own data; admins see everything)
   - A private `documents` storage bucket for uploaded files
4. Go to **Authentication → Providers** and make sure **Email** is enabled.
5. Go to **Authentication → URL Configuration** and add your site URL (e.g. `http://localhost:5173`
   for now, and your production domain once deployed) to **Site URL** and **Redirect URLs**.
6. (Optional but recommended) Under **Authentication → Email Templates**, you can customize the
   "Confirm signup" email with your ZACO branding.

### Create your admin account

1. Run the app (`npm run dev`) and register a normal account through the site with your own email.
2. Back in Supabase → **SQL Editor**, run:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```
3. Sign out and back in — you'll now be redirected to `/admin` instead of the student dashboard.

## Step 3 — Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and confirm/update:

```
VITE_SUPABASE_URL=https://pavdptrszsjdytgedrgi.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_6X_C7tXRN5_gzUh73xFK8A_Dgmcso1U
VITE_WHATSAPP_NUMBER=234XXXXXXXXXX
```

Replace `VITE_WHATSAPP_NUMBER` with your real WhatsApp Business number (digits only, with
country code, no `+` or spaces), e.g. `2348012345678`.

## Step 4 — Run locally

```bash
npm run dev
```

Visit `http://localhost:5173`. Try:
- Submitting the public inquiry form on the homepage
- Registering a student account
- Going to `/explore`, typing "Canada" and viewing universities/scholarships
- Uploading a document from the student dashboard
- Signing in as your admin account and visiting `/admin`

## Step 5 — Update real business details

Before going live, edit these placeholders:

- `src/pages/Payment.jsx` — replace the bank transfer details with your real ones (or swap
  this page out for a real payment gateway like Paystack/Flutterwave/Stripe once you have keys).
- `src/pages/Home.jsx` — office emails/addresses under the Contact section.
- `.env` — `VITE_WHATSAPP_NUMBER`.
- `src/data/universities.js` and `src/data/scholarships.js` — add/remove entries as needed.
  These currently ship with a starter dataset; wire them to a `universities`/`scholarships`
  Supabase table later if you want admins to edit them without redeploying.
- `public/assets/` — your logo files are already copied in from what you uploaded
  (`logo-transparent.png`, `logo-full.png`, `logo-white-bg.png`). Swap them if you prefer a
  different version.

## Step 6 — Deploy

The fastest path is **Vercel** (free tier is enough to start).

### Deploy with Vercel (recommended)

1. Push this project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/zaco-global-scholars.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your GitHub repo.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Under **Environment Variables**, add the same three variables from your `.env` file:
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_WHATSAPP_NUMBER`.
5. Click **Deploy**. You'll get a live URL like `zaco-global-scholars.vercel.app`.
6. Back in Supabase → **Authentication → URL Configuration**, add that URL to **Site URL**
   and **Redirect URLs** so signup/confirmation emails work correctly.
7. (Optional) Add your own domain under Vercel → **Settings → Domains**.

### Alternative: Netlify

Same idea — connect the repo, set build command `npm run build`, publish directory `dist`,
add the same environment variables, then deploy.

## Notes on the features you asked for

- **Countries hidden**: the homepage never lists countries. `/explore` only reveals results
  after the visitor types a country name and picks one from the matches.
- **Scholarships hidden behind country selection**: on `/explore`, switching to the
  "Scholarships" tab still requires picking a country first — scholarships for that country
  only appear after selection, exactly like the university flow.
- **Payments**: no payment gateway keys were provided, so this ships as a manual
  bank-transfer + reference-code flow that logs to Supabase and that admins confirm. Swap
  in Paystack/Flutterwave/Stripe when you're ready — happy to wire that in once you share
  which processor and its keys.
- **Document upload**: goes to a private Supabase Storage bucket (`documents`), scoped so
  each student can only see their own files, and admins can see all of them.
- **WhatsApp integration**: floating button (bottom-right) opens a chat with your number,
  and student WhatsApp numbers are captured at signup and in inquiries for your team to
  follow up manually.

## Troubleshooting

- **Blank page / console error about Supabase URL**: you forgot to create `.env` from
  `.env.example`, or the dev server needs a restart after editing `.env`.
- **"new row violates row-level security policy"**: you likely skipped running
  `supabase/schema.sql`, or you're testing a table's insert without being signed in.
- **Admin routes redirect to student dashboard**: your account's `role` in the `profiles`
  table is still `student` — run the SQL update command from Step 2.
