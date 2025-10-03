import React from 'react';
// Mock next/navigation's useRouter to prevent 'expected app router to be mounted' error
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

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PollOwnerActions from "../PollOwnerActions";
import { withProviders } from '@/test-utils';
import type { User } from '@supabase/supabase-js';
import * as supabaseLib from "@/lib/supabase";

const poll = {
  id: 1,
  title: "Test Poll",
  description: "Test Description",
  userId: "user-123",
  createdBy: "Test User",
  options: [],
  createdAt: new Date(),
};

const makeUser = (id: string): User => ({
  id,
  email: id + "@test.com",
  app_metadata: {},
  user_metadata: { name: 'Test User' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
});
const renderWithUser = (user: User | null) =>
  render(withProviders(<PollOwnerActions poll={poll} />, { user }));

describe("PollOwnerActions", () => {
  it("does not render for non-owner", () => {
  renderWithUser(makeUser("not-owner"));
    expect(screen.queryByText(/Edit/i)).toBeNull();
    expect(screen.queryByText(/Delete/i)).toBeNull();
  });

  it("renders edit and delete for owner", () => {
  renderWithUser(makeUser("user-123"));
    expect(screen.getByText(/Edit/i)).toBeInTheDocument();
    expect(screen.getByText(/Delete/i)).toBeInTheDocument();
  });

  it("opens edit dialog and updates fields", async () => {
  renderWithUser(makeUser("user-123"));
    fireEvent.click(screen.getByText(/Edit/i));
    expect(await screen.findByText(/Edit Poll/i)).toBeInTheDocument();
    const titleInput = screen.getByLabelText(/Title/i);
    fireEvent.change(titleInput, { target: { value: "New Title" } });
    expect(titleInput).toHaveValue("New Title");
  });

  it("calls onDelete when confirmed", async () => {
    window.confirm = jest.fn(() => true);
    const mockDelete = jest.fn().mockResolvedValue({ success: true });
    jest.spyOn(supabaseLib, "deletePoll").mockImplementation(mockDelete);
  renderWithUser(makeUser("user-123"));
    fireEvent.click(screen.getByText(/Delete/i));
    await waitFor(() => expect(mockDelete).toHaveBeenCalledWith(1));
  });
});
