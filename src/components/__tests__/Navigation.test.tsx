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
import { AuthContext } from '../../context/AuthContext';
import React from 'react';

const mockUser = {
  id: '1',
  email: 'test@test.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

describe('Navigation', () => {
  const wrapper = (children: React.ReactNode) => (
    <AuthContext.Provider value={{ user: mockUser, session: null }}>
      {children}
    </AuthContext.Provider>
  );

  it('renders navigation links', () => {
    render(wrapper(<Navigation />));
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText(/pollstr/i)).toBeInTheDocument();
  });
});
