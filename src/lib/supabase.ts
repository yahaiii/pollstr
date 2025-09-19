import { createClient } from '@supabase/supabase-js';
import { Poll } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (for server components)
export const createServerClient = () => {
  console.log('🔧 Creating server client with URL:', supabaseUrl);
  console.log('🔧 Anon key present:', !!supabaseAnonKey);
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // Don't persist session on server
    },
  });
};

// Database types
export interface Database {
  public: {
    Tables: {
      polls: {
        Row: {
          id: number;
          title: string;
          description: string;
          created_at: string;
          user_id: string;
          created_by: string;
        };
        Insert: {
          id?: number;
          title: string;
          description: string;
          user_id: string;
          created_by: string;
        };
        Update: {
          id?: number;
          title?: string;
          description?: string;
          user_id?: string;
          created_by?: string;
        };
      };
      poll_options: {
        Row: {
          id: number;
          poll_id: number;
          text: string;
          votes: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          poll_id: number;
          text: string;
          votes?: number;
        };
        Update: {
          id?: number;
          poll_id?: number;
          text?: string;
          votes?: number;
        };
      };
      votes: {
        Row: {
          id: number;
          poll_id: number;
          option_id: number;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          poll_id: number;
          option_id: number;
          user_id: string;
        };
        Update: {
          id?: number;
          poll_id?: number;
          option_id?: number;
          user_id?: string;
        };
      };
    };
  };
}

// Auth functions
export async function signIn(email: string, password: string) {
  console.log('🔐 Attempting to sign in:', email);
  const result = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (result.error) {
    console.error('❌ Sign in error:', result.error.message);
  } else {
    console.log('✅ Sign in successful:', result.data.user?.email);
  }
  
  return result;
}

export async function signUp(email: string, password: string, name: string) {
  console.log('📝 Attempting to sign up:', email, name);
  const result = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  
  if (result.error) {
    console.error('❌ Sign up error:', result.error.message);
  } else {
    console.log('✅ Sign up successful:', result.data.user?.email);
  }
  
  return result;
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('❌ Get current user error:', error.message);
      return null;
    } else if (user) {
      console.log('✅ Current user:', user.email);
      return user;
    } else {
      console.log('ℹ️ No user logged in');
      return null;
    }
  } catch (error) {
    console.error('❌ Get current user error:', error);
    return null;
  }
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user');
    callback(session?.user || null);
  });
}

// Poll functions
export async function createPoll(poll: {
  title: string;
  description: string;
  options: string[];
  userId: string;
  userName: string;
}) {
  // Create the poll
  const { data: pollData, error: pollError } = await supabase
    .from('polls')
    .insert({
      title: poll.title,
      description: poll.description,
      user_id: poll.userId,
      created_by: poll.userName,
    })
    .select()
    .single();

  if (pollError) throw pollError;

  // Create poll options
  const optionsData = poll.options.map(option => ({
    poll_id: pollData.id,
    text: option,
    votes: 0,
  }));

  const { data: options, error: optionsError } = await supabase
    .from('poll_options')
    .insert(optionsData)
    .select();

  if (optionsError) throw optionsError;

  return { poll: pollData, options };
}

export async function getPolls(): Promise<Poll[]> {
  try {
    console.log('📊 Fetching polls...');
    const supabaseClient = createServerClient();
    
    const { data: polls, error } = await supabaseClient
      .from('polls')
      .select(`
        *,
        poll_options (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching polls:', error);
      throw error;
    }

    console.log('✅ Successfully fetched polls:', polls?.length || 0);
    return polls.map(poll => ({
      id: poll.id,
      title: poll.title,
      description: poll.description,
      createdAt: new Date(poll.created_at),
      createdBy: poll.created_by,
      options: poll.poll_options.map((option: { id: number; text: string; votes: number }) => ({
        id: option.id,
        text: option.text,
        votes: option.votes,
      })),
    }));
  } catch (error) {
    console.error('❌ Failed to fetch polls:', error);
    throw error;
  }
}

export async function getPoll(id: number): Promise<Poll | null> {
  const supabaseClient = createServerClient();
  
  const { data: poll, error } = await supabaseClient
    .from('polls')
    .select(`
      *,
      poll_options (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('❌ Error fetching poll:', error);
    throw error;
  }

  return {
    id: poll.id,
    title: poll.title,
    description: poll.description,
    createdAt: new Date(poll.created_at),
    createdBy: poll.created_by,
    options: poll.poll_options.map((option: { id: number; text: string; votes: number }) => ({
      id: option.id,
      text: option.text,
      votes: option.votes,
    })),
  };
}

export async function voteOnPoll(pollId: number, optionId: number, userId: string) {
  // The RLS policy and trigger will handle duplicate vote prevention and count increment
  const { error: voteError } = await supabase
    .from('votes')
    .insert({
      poll_id: pollId,
      option_id: optionId,
      user_id: userId,
    });

  if (voteError) {
    if (voteError.code === '23505') { // Unique constraint violation
      throw new Error('You have already voted on this poll');
    }
    throw voteError;
  }

  return { success: true };
}

export async function hasUserVoted(pollId: number, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('votes')
    .select('id')
    .eq('poll_id', pollId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return !!data;
}