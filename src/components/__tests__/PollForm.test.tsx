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
import { PollForm } from '../PollForm';
import { withProviders } from '@/test-utils';
import type { User } from '@/types';

const mockUser: User = {
  id: '1',
  email: 'test@test.com',
  name: 'Test User',
};

describe('PollForm', () => {
  it('renders poll creation form', () => {
    render(withProviders(<PollForm />, { user: mockUser }));
    expect(screen.getByLabelText(/question/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });

  it('shows validation errors on submit with empty fields', async () => {
    render(withProviders(<PollForm />, { user: mockUser }));
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(await screen.findAllByText(/required/i)).not.toHaveLength(0);
  });
});
