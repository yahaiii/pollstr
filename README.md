# 🗳️ Pollstr

A modern, full-stack polling application built with Next.js and Supabase that allows users to create polls, share them via unique links and QR codes, and collect votes in real-time.

## ✨ Features

- **🔐 User Authentication**: Secure registration and login with Supabase Auth
- **📊 Poll Creation**: Create custom polls with multiple options
- **🗳️ Voting System**: One vote per user per poll with duplicate prevention
- **📈 Real-time Results**: Live vote counting with percentages and visual charts
- **🔗 Easy Sharing**: Share polls via unique URLs and QR codes
- **👤 User Dashboard**: Manage your polls and view voting history
- **🔒 Secure**: Row Level Security (RLS) policies and proper data validation

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Database**: [Supabase](https://supabase.com) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Chart.js with react-chartjs-2
- **QR Codes**: qrcode.react
- **Form Handling**: React Hook Form with Zod validation

## 📋 Prerequisites

- Node.js 18.x or later
- npm, yarn, pnpm, or bun
- A Supabase account ([sign up here](https://supabase.com))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yahaiii/pollstr.git
cd pollstr
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Supabase Database

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy the contents of `supabase-schema.sql` from this repository
4. Paste and run the SQL in the Supabase SQL Editor

This will create:
- `polls` table for storing poll information
- `poll_options` table for poll choices
- `votes` table for tracking votes
- Row Level Security (RLS) policies
- Indexes for optimal performance
- Automatic vote counting triggers

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

To find these values:
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the **Project URL** and **anon/public key**

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
pollstr/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── auth/           # Authentication pages (login, register)
│   │   ├── create-poll/    # Poll creation page
│   │   ├── dashboard/      # User dashboard
│   │   └── polls/          # Poll listing and voting pages
│   ├── components/         # Reusable React components
│   │   └── ui/            # shadcn/ui components
│   ├── context/           # React context providers (AuthContext)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and Supabase client
│   └── types/             # TypeScript type definitions
├── public/                # Static assets
├── supabase-schema.sql   # Database schema
└── .env.local            # Environment variables (not committed)
```

## 🎯 Key Features Explained

### Authentication
- User registration with email and password
- Secure login/logout functionality
- Protected routes requiring authentication
- Session management across the application

### Poll Management
- Create polls with custom questions and descriptions
- Add multiple answer options (minimum 2 required)
- View all polls in a clean, organized list
- Access individual poll pages with full details

### Voting System
- Vote on any poll (authentication required)
- One vote per user per poll enforced at database level
- Real-time vote counting
- Visual results with percentages and progress bars
- Vote history tracking

### QR Code Sharing
- Generate unique QR codes for each poll
- Easy sharing for mobile users
- Direct links to poll pages

## 🔒 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **User Isolation**: Users can only manage their own polls
- **Vote Integrity**: Duplicate voting prevented at database level
- **Input Validation**: All forms validated using Zod schemas
- **SQL Injection Protection**: Parameterized queries via Supabase
- **Secure Authentication**: Industry-standard auth with Supabase

## 🧪 Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

For detailed testing instructions, see [TESTING_GUIDE.md](TESTING_GUIDE.md).

## 📚 Additional Documentation

- [SETUP.md](SETUP.md) - Detailed setup instructions
- [DATABASE_SETUP_COMPLETE.md](DATABASE_SETUP_COMPLETE.md) - Database integration details
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Comprehensive testing guide
- [AUTHENTICATION_TESTING.md](AUTHENTICATION_TESTING.md) - Authentication testing guide

## 🚢 Deployment

### Deploy on Vercel

The easiest way to deploy Pollstr is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yahaiii/pollstr)

### Environment Variables for Production

Make sure to set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Database and Auth by [Supabase](https://supabase.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
