# Daily Focus – Time Management & Personal Focus

Daily Focus is a web app that helps you manage daily tasks, stay focused, and boost productivity using the Pomodoro technique. The goal is a simple, modern, effective personal tool.

## Features

1. Auth (Email/Password + Google OAuth)
2. Task management (CRUD)
3. Pomodoro timer (25/5 default) with history
4. Productivity stats (tasks and focus time)
5. Email reminders for upcoming deadlines
6. Modern, responsive UI (Tailwind, dark mode, Framer Motion)

## Tech Stack

| Tech                | Purpose                          |
|---------------------|----------------------------------|
| Next.js (App Router)| Frontend + API routes            |
| TailwindCSS         | Fast UI building                 |
| TypeScript          | Safer, maintainable code         |
| PostgreSQL          | Persist users, tasks, projects   |
| Prisma              | Type-safe ORM                    |
| JWT / NextAuth      | Authentication                   |
| Nodemailer          | Email notifications              |
| Framer Motion       | Motion effects                   |

## Setup

1. Clone
`ash
git clone https://github.com/Altas463/daily-focus-Time-Management-Website.git
cd daily-focus-Time-Management-Website
`

2. Install deps
`ash
npm install
`

3. Configure environment (.env or .env.local)
`ash
DATABASE_URL=postgresql://username:password@localhost:5432/dailyfocus
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
`

4. Database
`ash
npx prisma migrate dev --name init
`

5. Run
`ash
npm run dev
`

## Roadmap
- ✅ Auth (JWT + Google OAuth)
- ✅ CRUD Tasks + deadlines
- ✅ Pomodoro timer working
- ✅ Productivity stats (daily/weekly/monthly)
- ✅ Email reminders
- ⏳ Realtime sync / multi-device
- 🔜 Internationalization (i18n)

## Contributing
- Open issues for bugs
- Send PRs for improvements
- UI/UX and performance contributions are welcome

## Contact
- Email: atu3012@gmail.com
- GitHub: Altas463
