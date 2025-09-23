# Pollstr Setup Instructions

## Database Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database schema**:
   - Copy the contents of `supabase-schema.sql`
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Paste and run the SQL schema

3. **Configure environment variables**:
   - Create a `.env.local` file in the project root
   - Add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Features Implemented

✅ **Authentication**
- User registration and login
- Protected routes
- User session management

✅ **Poll Management**
- Create polls with custom questions and options
- View all polls
- Individual poll pages with voting

✅ **Voting System**
- Vote on polls (one vote per user per poll)
- Real-time vote counting
- Results visualization with percentages

✅ **Database Integration**
- Supabase PostgreSQL database
- Row Level Security (RLS) policies
- Real-time data synchronization

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses three main tables:

- **polls**: Stores poll information (title, description, creator)
- **poll_options**: Stores poll choices with vote counts
- **votes**: Tracks individual votes to prevent duplicate voting

## Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only create/update/delete their own polls
- One vote per user per poll enforced at database level
- Secure authentication with Supabase Auth
