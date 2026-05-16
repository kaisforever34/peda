# PEDA - AI-Powered Learning Platform

PEDA is a premium, full-stack educational platform designed to bridge the gap between students and teachers through AI-driven insights, gamified progression, and multilingual support.

## 🌟 Key Features

- **Dual-Dashboard System**: Specialized interfaces for Students and Teachers/Admins.
- **AI Voice Coach**: Real-time speech assessment and pronunciation feedback.
- **Gamification Engine**: Daily streaks, XP points, and achievement badges to drive engagement.
- **AI-Powered Grading**: Strategic AI assistance for teachers to summarize performance and generate feedback.
- **Multilingual Support**: Full Arabic (RTL), French, and English localization.
- **Adaptive UI**: Premium design system with fluid typography and multiple themes (Arctic, Obsidian, Signal, Terra).

## 🚀 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Prisma ORM](https://www.prisma.io/) with SQLite (Dev) / PostgreSQL (Prod)
- **Auth**: [Clerk](https://clerk.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)

## 🚀 Deployment (Netlify)

This platform is optimized for Netlify. To deploy successfully:

1.  **Database**: SQLite (`dev.db`) is not supported on serverless platforms. You must use a managed **PostgreSQL** database (e.g., Supabase, Neon, or Railway).
2.  **Schema Update**: In `prisma/schema.prisma`, change the datasource provider to `"postgresql"`.
3.  **Environment Variables**: In your Netlify Site Settings, add the following:
    - `DATABASE_URL`: Your PostgreSQL connection string.
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: From your Clerk dashboard.
    - `CLERK_SECRET_KEY`: From your Clerk dashboard.
    - `NEXT_PUBLIC_APP_URL`: Your Netlify site URL.
4.  **Middleware**: Ensure `src/middleware.ts` is present (automatically fixed).

### Local vs Production Database
To maintain SQLite locally while using PostgreSQL on Netlify, you can use separate branches or update the `provider` in `schema.prisma` before pushing to your production branch.

## 🏗️ Architecture

- `src/app`: Next.js App Router (Pages, Actions, Layouts)
- `src/components`: Reusable UI components and Providers
- `src/lib`: Core utilities (Prisma client, i18n logic, Constants)
- `prisma/`: Database schema and migrations
- `docs/`: Technical reports and implementation guides

## 🧪 Testing

We use **Vitest** for unit and integration testing.
```bash
npm test
```

## 📄 License

This project is licensed under the MIT License.
