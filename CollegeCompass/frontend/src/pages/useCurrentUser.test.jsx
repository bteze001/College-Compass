import { render, screen, waitFor } from '@testing-library/react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import useCurrentUser from './useCurrentUser';

// Mock Firebase auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => 'mock-auth'),
  onAuthStateChanged: vi.fn(),
}));

// Fake component to consume the hook
function TestComponent() {
  const { user, username } = useCurrentUser();

  return (
    <div>
      <p data-testid="username">{username}</p>
      <p data-testid="user">{user ? 'logged in' : 'not logged in'}</p>
    </div>
  );
}

describe('useCurrentUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns user and username when logged in', async () => {
    const mockUser = { email: 'user@example.com', displayName: 'John Doe' };

    // Simulate onAuthStateChanged callback
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {}; // unsubscribe function
    });

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('username')).toHaveTextContent('John Doe');
      expect(screen.getByTestId('user')).toHaveTextContent('logged in');
    });
  });

  it('returns empty username and null user when not logged in', async () => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });

    render(<TestComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('username')).toHaveTextContent('');
      expect(screen.getByTestId('user')).toHaveTextContent('not logged in');
    });
  });
});
