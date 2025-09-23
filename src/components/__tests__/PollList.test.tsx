import { render, screen } from '@testing-library/react';
import { PollList } from '../PollList';

describe('PollList', () => {
  it('renders a list of polls', () => {
    const polls = [
      { id: 1, title: 'Poll 1', description: 'Desc 1', userId: 'u1', createdBy: 'u1', createdAt: new Date(), options: [] },
      { id: 2, title: 'Poll 2', description: 'Desc 2', userId: 'u2', createdBy: 'u2', createdAt: new Date(), options: [] },
    ];
    render(<PollList polls={polls} />);
    expect(screen.getByText(/Poll 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Poll 2/i)).toBeInTheDocument();
  });
});
