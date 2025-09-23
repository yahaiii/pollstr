-- Pollstr Database Schema
-- Run this SQL in your Supabase SQL editor to set up the database

-- Create polls table with bigint identity primary key
CREATE TABLE IF NOT EXISTS polls (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_by TEXT NOT NULL
);

-- Create poll_options table
CREATE TABLE IF NOT EXISTS poll_options (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  poll_id BIGINT REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  votes INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  poll_id BIGINT REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  option_id BIGINT REFERENCES poll_options(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, user_id) -- Prevent duplicate votes from same user
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_polls_user_id ON polls(user_id);
CREATE INDEX IF NOT EXISTS idx_polls_created_at ON polls(created_at);
CREATE INDEX IF NOT EXISTS idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_poll_id ON votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_option_id ON votes(option_id);

-- Enable Row Level Security
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for polls
CREATE POLICY "Anyone can view polls" ON polls
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users can create polls" ON polls
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own polls" ON polls
  FOR UPDATE TO authenticated 
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own polls" ON polls
  FOR DELETE TO authenticated USING ((SELECT auth.uid()) = user_id);

-- Create RLS policies for poll_options
CREATE POLICY "Anyone can view poll options" ON poll_options
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users can create poll options" ON poll_options
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Users can update poll options for their polls" ON poll_options
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.user_id = (SELECT auth.uid())
    )
  );

-- Create RLS policies for votes (restricted for privacy)
CREATE POLICY "Users can view their own votes" ON votes
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Authenticated users can create votes" ON votes
  FOR INSERT TO authenticated 
  WITH CHECK (
    (SELECT auth.uid()) = user_id
    AND EXISTS (
      SELECT 1 FROM poll_options po
      JOIN polls p ON po.poll_id = p.id
      WHERE po.id = votes.option_id
      AND p.id = votes.poll_id
    )
    AND NOT EXISTS (
      SELECT 1 FROM votes v2
      WHERE v2.poll_id = votes.poll_id
      AND v2.user_id = votes.user_id
    )
  );

-- Create function to increment vote count with proper security
CREATE OR REPLACE FUNCTION increment_vote_count(option_id BIGINT)
RETURNS void AS $$
BEGIN
  -- Set search_path for security
  SET search_path = public;
  
  UPDATE poll_options 
  SET votes = votes + 1 
  WHERE id = option_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to decrement vote count
CREATE OR REPLACE FUNCTION decrement_vote_count(option_id BIGINT)
RETURNS void AS $$
BEGIN
  -- Set search_path for security
  SET search_path = public;
  
  UPDATE poll_options 
  SET votes = GREATEST(votes - 1, 0)
  WHERE id = option_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger function to automatically update vote counts
CREATE OR REPLACE FUNCTION handle_vote_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM increment_vote_count(NEW.option_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM decrement_vote_count(OLD.option_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to handle vote count changes
CREATE TRIGGER vote_count_trigger
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION handle_vote_change();

-- Grant minimal necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON polls TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON poll_options TO anon, authenticated;
GRANT SELECT, INSERT ON votes TO authenticated;

-- Revoke execute permissions from public roles for security
REVOKE EXECUTE ON FUNCTION increment_vote_count(BIGINT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION decrement_vote_count(BIGINT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION handle_vote_change() FROM PUBLIC;
