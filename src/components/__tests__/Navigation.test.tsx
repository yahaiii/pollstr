import React from 'react';
// Mock next/navigation's useRouter and usePathname for Next.js App Router context
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
}));
import { render, screen } from '@testing-library/react';
import { Navigation } from '../Navigation';
import { withProviders } from '@/test-utils';
import type { User } from '@supabase/supabase-js';

const mockUser: User = {
  id: '1',
  email: 'test@test.com',
  app_metadata: {},
  user_metadata: { name: 'Test User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

describe('Navigation', () => {
  it('renders navigation links', () => {
    render(withProviders(<Navigation />, { user: mockUser }));
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText(/pollstr/i)).toBeInTheDocument();
  });
});
