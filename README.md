# 🗳️ Pollstr

A modern, feature-rich polling application that allows users to create polls, share them via QR codes, and collect votes in real-time. Built with Next.js and Supabase.

## ✨ Features

- **🔐 User Authentication**
  - Secure registration and login with Supabase Auth
  - Protected routes and session management
  - User profile integration

- **📊 Poll Management**
  - Create polls with custom questions and multiple options
  - View all polls in a clean, organized interface
  - Individual poll pages with detailed results
  - Edit and delete your own polls

- **🗳️ Voting System**
  - One vote per user per poll (enforced at database level)
  - Real-time vote counting with automatic updates
  - Results visualization with percentages and progress bars
  - Duplicate vote prevention

- **📱 QR Code Sharing**
  - Generate QR codes for each poll
  - Easy sharing via unique links
  - Mobile-friendly voting interface

- **🔒 Security**
  - Row Level Security (RLS) on all database tables
  - SQL injection protection via parameterized queries
  - Input validation on all forms
  - Secure environment variable handling

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js Server Actions
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Chart.js, React Chart.js 2
- **QR Codes**: qrcode.react
- **Form Handling**: React Hook Form, Zod validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- npm, yarn, pnpm, or bun
- A Supabase account ([sign up here](https://supabase.com))

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yahaiii/pollstr.git
cd pollstr
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project dashboard → SQL Editor
3. Copy and run the contents of `supabase-schema.sql`
4. This will create all necessary tables, policies, and triggers

### 4. Configure environment variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

To find your credentials:
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the Project URL and anon/public key

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests

## 📁 Project Structure

```
pollstr/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── auth/            # Authentication pages
│   │   ├── create-poll/     # Poll creation page
│   │   ├── polls/           # Poll listing and voting pages
│   │   └── dashboard/       # User dashboard
│   ├── components/          # React components
│   │   └── ui/              # shadcn/ui components
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and Supabase client
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
├── supabase-schema.sql      # Database schema
└── .env.local              # Environment variables (create this)
```

## 🗄️ Database Schema

The application uses three main tables:

```
polls (id, title, description, created_at, user_id, created_by)
  ↓
poll_options (id, poll_id, text, votes, created_at)
  ↓
votes (id, poll_id, option_id, user_id, created_at)
```

- **polls**: Stores poll information (title, description, creator)
- **poll_options**: Stores poll choices with vote counts
- **votes**: Tracks individual votes to prevent duplicates

## 🔒 Security Features

- **Row Level Security (RLS)**: Users can only create/update/delete their own polls
- **Vote Integrity**: One vote per user per poll enforced at the database level
- **Input Validation**: All forms validated with Zod schemas
- **Authentication Required**: Poll creation and voting require authentication
- **SQL Injection Protection**: Parameterized queries via Supabase

## 🧪 Testing

For detailed testing instructions, see [TESTING_GUIDE.md](./TESTING_GUIDE.md).

Basic testing flow:
1. Register a new account at `/auth/register`
2. Create a poll at `/create-poll`
3. View polls at `/polls`
4. Vote on a poll and verify results
5. Test duplicate vote prevention

## 📚 Additional Documentation

- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [DATABASE_SETUP_COMPLETE.md](./DATABASE_SETUP_COMPLETE.md) - Database configuration guide
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Comprehensive testing guide
- [AUTHENTICATION_TESTING.md](./AUTHENTICATION_TESTING.md) - Authentication testing guide

## 🚢 Deployment

### Deploy on Vercel

The easiest way to deploy Pollstr is using the [Vercel Platform](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add your environment variables (Supabase URL and key)
4. Deploy!

Make sure to add the same environment variables from `.env.local` to your Vercel project settings.

For more deployment options, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Database and auth by [Supabase](https://supabase.com)
- Icons from [Lucide](https://lucide.dev)

---

Made with ❤️ by the Pollstr team
