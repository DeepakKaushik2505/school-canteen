# School Canteen 🍽️

A modern canteen ordering prototype built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, **Clerk Auth**, and **Supabase**.

## ✨ Features

- 🏠 Stylish landing page with full-screen hero, About section, and footer
- 🍟 Snacks page with image cards, full/half pricing, and quantity controls (`+` / `-`)
- 🔐 Authentication with Clerk + Google OAuth
- 👤 Navbar auth states: Login button (signed out), avatar dropdown (signed in)
- 🎓 Create Student form with Name, Class, Section, Roll No., and referral code
- ✅ Form handling and validation using **React Hook Form + Zod**
- 🧠 Shared UI state using **Zustand** store (students detail modal state)
- 📋 Students page with a table of 20 dummy students and popup detail modal
- 🧪 Fallback/mock-first behavior for demos when backend is unavailable

## 🚀 Setup Instructions

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create `.env.local` from `.env.local.example` and set:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

### 3) Setup Supabase (SQL Editor)

Run these files in order:

1. `supabase/schema.sql`
2. `supabase/migration_userid_text.sql` (if needed)
3. `supabase/migration_snacks_full_half.sql`
4. `supabase/migration_students_class_section_rollno.sql`
5. `supabase/seed.sql` (optional starter rows)
6. `supabase/seed_snacks_new.sql` (optional snack rows)

### 4) Setup Clerk

- Create a Clerk app
- Enable **Google OAuth** in social connections
- Add keys to `.env.local`

### 5) Start development server

```bash
npm run dev
```

Open: [https://school-canteen-mocha.vercel.app/](https://school-canteen-mocha.vercel.app/)

## 📚 Libraries Used

### Runtime

- `next`
- `react`, `react-dom`
- `@supabase/supabase-js`
- `@clerk/nextjs`
- `react-hook-form`
- `zod`
- `@hookform/resolvers`
- `zustand`

### Development

- `typescript`
- `tailwindcss`, `postcss`, `autoprefixer`
- `eslint`, `eslint-config-next`
- `@types/node`, `@types/react`, `@types/react-dom`

## 🧪 Mock Data Approach (if backend is not used)

The project supports a demo-friendly mock approach:

- **Snacks fallback:** `src/lib/snacks-config.ts`
  - UI still shows snack cards if Supabase fetch fails.
- **Students dummy table:** `src/lib/dummy-students.ts`
  - 20 dummy students are generated.
- **Dummy order history:** also in `src/lib/dummy-students.ts`
  - Per-student mock orders are shown in popup modal on Students page.

This lets the app remain usable for UI testing and presentations even without a working backend.

## 📁 Important Paths

- `src/app/page.tsx` - landing page
- `src/app/snacks/page.tsx` - snacks UI and ordering
- `src/app/students/page.tsx` - students table + popup details
- `src/app/students/create/page.tsx` - create student form (RHF + Zod)
- `src/lib/store/app-store.ts` - Zustand global store
- `src/lib/db.ts` - Supabase query layer
- `src/lib/types.ts` - shared interfaces
- `src/lib/snacks-config.ts` - snacks config + fallback
- `src/lib/dummy-students.ts` - dummy students and orders
- `src/components/StudentDetailModal.tsx` - student popup modal

## 📝 Notes

- Site icon/logo: `public/assets/logo.jpg`
- Hero assets: `public/assets/home-pic.webp`, `public/assets/home-canteen.avif`
- Current setup is prototype-oriented; tighten RLS/auth rules for production use.
