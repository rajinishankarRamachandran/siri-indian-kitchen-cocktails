# SIRI Restaurant - Installation Guide

## Prerequisites

Before installing, ensure you have the following installed on your local machine:

- **Node.js** (v20 or higher)
- **npm** (comes with Node.js) or **bun** (recommended for faster installation)

## Installation Steps

### 1. Clone or Download the Project

If you haven't already, get the project files on your local machine.

### 2. Install Dependencies

Navigate to the project directory in your terminal and run:

```bash
npm install
```

**OR** if you have bun installed (faster):

```bash
bun install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database (Turso)
DATABASE_URL=your_database_url
DATABASE_AUTH_TOKEN=your_database_auth_token

# Better Auth
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000

# Email (Nodemailer for AOL)
EMAIL_HOST=smtp.aol.com
EMAIL_PORT=587
EMAIL_USER=sirirestaurant@aol.com
EMAIL_PASSWORD=your_aol_app_password

# Supabase (for image uploads)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe (for payments)
STRIPE_TEST_KEY=your_stripe_test_key
STRIPE_LIVE_KEY=your_stripe_live_key
AUTUMN_SECRET_KEY=your_autumn_secret_key
```

### 4. Run Database Migrations

```bash
npm run db:push
```

**OR** with bun:

```bash
bun run db:push
```

### 5. Start the Development Server

```bash
npm run dev
```

**OR** with bun:

```bash
bun dev
```

The application will be available at **http://localhost:3000**

## Production Build

To create a production build:

```bash
npm run build
npm start
```

**OR** with bun:

```bash
bun run build
bun start
```

---

## Complete Dependencies List

### Production Dependencies (70 packages)

- **Core Framework:**
  - next@15.3.5
  - react@19.0.0
  - react-dom@19.0.0

- **UI Components (Radix UI):**
  - @radix-ui/react-accordion@1.2.11
  - @radix-ui/react-alert-dialog@1.1.14
  - @radix-ui/react-aspect-ratio@1.1.7
  - @radix-ui/react-avatar@1.1.10
  - @radix-ui/react-checkbox@1.3.2
  - @radix-ui/react-collapsible@1.1.11
  - @radix-ui/react-context-menu@2.2.15
  - @radix-ui/react-dialog@1.1.14
  - @radix-ui/react-dropdown-menu@2.1.15
  - @radix-ui/react-hover-card@1.1.14
  - @radix-ui/react-label@2.1.7
  - @radix-ui/react-menubar@1.1.15
  - @radix-ui/react-navigation-menu@1.2.13
  - @radix-ui/react-popover@1.1.14
  - @radix-ui/react-progress@1.1.7
  - @radix-ui/react-radio-group@1.3.7
  - @radix-ui/react-scroll-area@1.2.9
  - @radix-ui/react-select@2.2.5
  - @radix-ui/react-separator@1.1.7
  - @radix-ui/react-slider@1.3.5
  - @radix-ui/react-slot@1.2.3
  - @radix-ui/react-switch@1.2.5
  - @radix-ui/react-tabs@1.1.12
  - @radix-ui/react-toggle@1.1.9
  - @radix-ui/react-toggle-group@1.1.10
  - @radix-ui/react-tooltip@1.2.7

- **Database & ORM:**
  - @libsql/client@0.15.15
  - drizzle-orm@0.44.7
  - drizzle-kit@0.31.6

- **Authentication:**
  - better-auth@1.3.10
  - bcrypt@6.0.0

- **Payments:**
  - stripe@19.2.0
  - autumn-js@0.1.43
  - atmn@0.0.28

- **Forms & Validation:**
  - react-hook-form@7.60.0
  - @hookform/resolvers@5.1.1
  - zod@4.1.12

- **Styling & UI:**
  - tailwind-merge@3.3.1
  - tailwindcss-animate@1.0.7
  - class-variance-authority@0.7.1
  - clsx@2.1.1
  - @tailwindcss/typography@0.5.19

- **Animations:**
  - framer-motion@12.23.24
  - motion@12.23.24
  - motion-dom@12.23.23

- **Icons:**
  - lucide-react@0.552.0
  - @heroicons/react@2.2.0
  - @tabler/icons-react@3.35.0
  - react-icons@5.5.0

- **3D & Visualizations:**
  - three@0.178.0
  - @react-three/fiber@9.0.0-alpha.8
  - @react-three/drei@10.4.4
  - three-globe@2.43.0
  - cobe@0.6.5

- **Carousels & Sliders:**
  - embla-carousel-react@8.6.0
  - embla-carousel-autoplay@8.6.0
  - embla-carousel-auto-scroll@8.6.0
  - swiper@12.0.3

- **Email:**
  - nodemailer@7.0.11

- **Storage:**
  - @supabase/supabase-js@2.86.0

- **Utilities:**
  - date-fns@4.1.0
  - next-themes@0.4.6
  - sonner@2.0.7
  - cmdk@1.1.1
  - vaul@1.1.2
  - react-day-picker@9.8.0
  - react-dropzone@14.3.8
  - react-intersection-observer@10.0.0
  - react-resizable-panels@3.0.3
  - react-responsive-masonry@2.7.1
  - react-syntax-highlighter@15.6.1
  - react-wrap-balancer@1.1.1
  - react-fast-marquee@1.6.5
  - recharts@3.0.2
  - @number-flow/react@0.5.10
  - input-otp@1.4.2

- **Build Tools:**
  - @babel/parser@7.28.5
  - estree-walker@2.0.2

- **Other:**
  - @headlessui/react@2.2.9
  - @tsparticles/engine@3.8.1
  - @tsparticles/react@3.0.0
  - @tsparticles/slim@3.8.1
  - dotted-map@2.2.3
  - mini-svg-data-uri@1.4.4
  - qss@3.0.0
  - simplex-noise@4.0.3

### Development Dependencies (9 packages)

- @eslint/eslintrc@3.3.1
- @tailwindcss/postcss@4
- @types/node@20
- @types/react@19
- @types/react-dom@19
- @types/react-syntax-highlighter@15.5.13
- @types/three@0.178.0
- eslint@9.38.0
- eslint-config-next@16.0.1
- tailwindcss@4
- tw-animate-css@1.4.0
- typescript@5

---

## Quick Start Command

For a one-line installation on your local terminal:

```bash
npm install
```

This single command will install all 79 dependencies (70 production + 9 development) automatically.

---

## Troubleshooting

### Port 3000 Already in Use

If port 3000 is already in use, you can specify a different port:

```bash
npm run dev -- -p 3001
```

### Node Version Issues

Make sure you're using Node.js v20 or higher:

```bash
node --version
```

### Installation Errors

If you encounter installation errors, try clearing the cache:

```bash
npm cache clean --force
npm install
```

---

## Additional Scripts

Available npm scripts:

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

---

**For questions or issues, contact: sirirestaurant@aol.com**
