# Daily Focus – Transform Your Focus into Achievement

Daily Focus is a powerful yet simple web application designed to help you conquer your daily tasks, maintain deep focus, and boost productivity through the proven Pomodoro technique. We believe in creating tools that are remarkably effective without being overwhelming.

## What Makes Daily Focus Special

- **Seamless Authentication**: Choose between email/password or Google OAuth for instant access
- **Intuitive Task Management**: Create, update, and organize tasks with a beautiful, responsive interface
- **Smart Pomodoro Timer**: Built-in 25/5 minute focus sessions with automatic tracking and history
- **Actionable Analytics**: Visualize your productivity with detailed stats on tasks and focus time
- **Thoughtful Reminders**: Never miss a deadline with intelligent email notifications
- **Modern Experience**: Enjoy a stunning UI with dark mode support and smooth animations

## Technology Stack

| Technology | Purpose |
|------------|---------|
| Next.js (App Router) | Full-stack framework with API routes |
| TailwindCSS | Rapid, beautiful UI development |
| TypeScript | Type-safe, maintainable codebase |
| PostgreSQL | Robust data persistence |
| Prisma | Type-safe database ORM |
| NextAuth | Secure authentication system |
| Nodemailer | Reliable email delivery |
| Framer Motion | Engaging animations and transitions |

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Altas463/daily-focus-Time-Management-Website.git
cd daily-focus-Time-Management-Website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up your environment
Create a `.env` or `.env.local` file with your configuration:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/dailyfocus
JWT_SECRET=your_secure_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
```

### 4. Initialize the database
```bash
npx prisma migrate dev --name init
```

### 5. Launch the application
```bash
npm run dev
```

## Development Roadmap

- ✅ Secure authentication (JWT + Google OAuth)
- ✅ Complete task management with deadlines
- ✅ Fully functional Pomodoro timer
- ✅ Comprehensive productivity analytics
- ✅ Intelligent email reminder system
- 🚧 Real-time synchronization across devices
- 🔜 Internationalization support (i18n)

## Contributing

We welcome contributions from the community! Here's how you can help:

- **Bug Reports**: Open detailed issues for any problems you encounter
- **Feature Requests**: Share your ideas for improving Daily Focus
- **Code Contributions**: Submit pull requests for bug fixes or new features
- **UI/UX**: Help us refine the user experience and interface design

Your feedback and contributions make Daily Focus better for everyone.

## Contact

- **Email**: atu3012@gmail.com
- **GitHub**: Altas463