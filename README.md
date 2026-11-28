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
   NEXT_PUBLIC_API_URL="http://localhost:8000"
   ```

   Optional settings:

   ```env
   MONGODB_DATABASE="fixoraClientDb"
   IMGBB_API_KEY="your-imgbb-api-key"
   ```

   `NEXT_PUBLIC_API_URL` points to the Express API and defaults to `http://localhost:8000`; use the deployed server URL in Vercel. Service requests use the client's same-origin `/api` routes, which forward to Express and avoid browser cross-origin connection issues. Set `BETTER_AUTH_URL` to the app's public URL in each deployment environment. Configure `STRIPE_SECRET_KEY` in the Express server environment for checkout. Keep secrets out of source control.

3. Configure and start the Express server as described in [fixora-server/README.md](../fixora-server/README.md).

4. Start the client development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Vercel deployment

In both the **fixora-client** and **fixora-server** Vercel projects, set `BETTER_AUTH_SECRET` to the same value. In the client project, also set `NEXT_PUBLIC_API_URL` to the deployed Express server URL, plus `MONGODB_URI`, `MONGODB_DATABASE=fixoraClientDb`, and `BETTER_AUTH_URL`. Configure the server's MongoDB and Stripe variables as described in [fixora-server/README.md](../fixora-server/README.md).

Add these variables to the Production environment (and Preview if used) in both projects, then redeploy both projects. Never share or commit the secret value.

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
- `app/lib/` — Authentication, database, and Express gateway helpers
- `components/` — Shared site, service, and dashboard UI
- `scripts/` — Maintenance and demo-data scripts
