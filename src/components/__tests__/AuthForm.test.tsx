// Mock next/navigation's useRouter for Next.js App Router context
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthForm } from '../AuthForm';
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

describe('AuthForm', () => {
  const wrapper = (children: React.ReactNode) => (
    <AuthContext.Provider value={{ user: mockUser, session: null }}>
      {children}
    </AuthContext.Provider>
  );

  it('renders login form by default', () => {
    render(wrapper(<AuthForm mode="login" />));
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders register form when mode is register', () => {
    render(wrapper(<AuthForm mode="register" />));
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('shows validation errors on submit with empty fields', async () => {
    render(wrapper(<AuthForm mode="login" />));
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument();
  });
});
