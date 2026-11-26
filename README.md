# FIXORA Client

FIXORA is a home-appliance and smart-device repair platform for Bangladesh. This repository contains the customer-facing web app and role-based dashboards, where customers can find services and technicians can manage repair requests.

## Features

- Browse approved repair services and view service details.
- Create an account and sign in.
- Book services and view bookings and payments.
- Technician dashboard for managing service listings and repair requests.
- Admin dashboard for managing users, services, bookings, and transactions.
- Stripe checkout for booking payments.
- ImgBB image uploads for service and profile images.

## Tech stack

- Next.js App Router, React, and TypeScript
- Tailwind CSS
- Better Auth for authentication
- MongoDB for application and authentication data
- Stripe for payments and ImgBB for image hosting

## Requirements

- Node.js 20.9 or later
- npm
- A MongoDB connection string

Stripe and ImgBB credentials are needed only to use their respective integrations.

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root and configure the required variables:

   ```env
   MONGODB_URI="your-mongodb-connection-string"
   BETTER_AUTH_SECRET="a-long-random-secret"
   BETTER_AUTH_URL="http://localhost:3000"
   ```

   Optional settings:

   ```env
   MONGODB_DATABASE="fixoraClientDb"
   STRIPE_SECRET_KEY="your-stripe-secret-key"
   IMGBB_API_KEY="your-imgbb-api-key"
   ```

   Set `BETTER_AUTH_URL` to the app's public URL in each deployment environment. Keep secrets out of source control.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Useful commands

```bash
npm run dev    # Start the local development server
npm run lint   # Run ESLint
npm run build  # Build the production app
npm start      # Start the production build
```

## Demo data

The demo seed script adds sample technicians, services, bookings, and a payment record. It requires the local app to be running at `http://localhost:3000` and reads its MongoDB connection from `.env` (not `.env.local`). Point it to an isolated development or staging database:

```bash
npm run seed:demo -- --confirm-nonproduction
```

The script does not overwrite existing demo accounts or delete existing records. It prints one-time generated passwords for the created demo accounts; change them after testing.

## Project structure

- `app/` — Next.js routes, pages, and API endpoints
- `app/lib/` — Authentication, database, and API helpers
- `components/` — Shared site, service, and dashboard UI
- `scripts/` — Maintenance and demo-data scripts
