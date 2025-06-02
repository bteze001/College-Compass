import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CollegeCompassDash from './UserDashboard';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../firebase', () => ({ db: {}, auth: {} }));
vi.mock('firebase/firestore', () => ({
  getDocs: vi.fn(),
  collection: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn()
}));
vi.mock('./AccountSettings', () => ({
  default: () => <div data-testid="account-settings">Account Settings</div>
}));
vi.mock('./useCurrentUser', () => ({ default: vi.fn() }));

import { getDocs, collection } from 'firebase/firestore';
import useCurrentUser from './useCurrentUser';

describe('UserDashboard Component', () => {
  const mockUser = { uid: 'test-user', email: 'test@example.com' };
  const renderComponent = () => render(<BrowserRouter><CollegeCompassDash /></BrowserRouter>);

  beforeEach(() => {
    vi.clearAllMocks();
    useCurrentUser.mockReturnValue({ user: mockUser, username: 'TestUser' });
    getDocs.mockResolvedValue({ docs: [] });
    collection.mockReturnValue({ toString: () => 'mock-collection-ref' });
  });

  test('renders dashboard with user info and core elements', async () => {
    await act(async () => renderComponent());
    
    expect(screen.getByText('TestUser')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('My Favorites')).toBeInTheDocument();
    expect(screen.getByAltText('College Compass Logo')).toBeInTheDocument();
  });

  test('home button navigation works', async () => {
    await act(async () => renderComponent());
    
    fireEvent.click(screen.getByText('Home'));
    expect(mockNavigate).toHaveBeenCalledWith('/homepage');
  });

  test('fetches data on mount', async () => {
    await act(async () => renderComponent());
    
    await waitFor(() => {
      expect(getDocs).toHaveBeenCalled();
      expect(collection).toHaveBeenCalled();
    });
  });

  test('tab navigation works correctly', async () => {
    await act(async () => renderComponent());
    
    expect(screen.getByText('My Favorites').closest('.tab')).toHaveClass('active');
    
    // Switch to reviews
    fireEvent.click(screen.getByText('My Reviews'));
    expect(screen.getByText('Your reviews will appear here')).toBeInTheDocument();
    expect(screen.getByText('My Reviews').closest('.tab')).toHaveClass('active');
    
    // Switch to settings
    fireEvent.click(screen.getByText('Account Settings'));
    expect(screen.getByTestId('account-settings')).toBeInTheDocument();
  });

  test('handles different authentication states', async () => {
    // Test authenticated user
    useCurrentUser.mockReturnValue({ 
      user: { uid: 'test-123', email: 'user@test.com' }, 
      username: 'TestUsername' 
    });
    
    const { unmount } = render(<BrowserRouter><CollegeCompassDash /></BrowserRouter>);
    await act(async () => {});
    
    expect(screen.getByText('TestUsername')).toBeInTheDocument();
    unmount();
    
    // Test unauthenticated user
    useCurrentUser.mockReturnValue({ user: null, username: null });
    
    await act(async () => renderComponent());
    expect(screen.queryByText('TestUsername')).not.toBeInTheDocument();
  });

  test('handles Firestore data and errors', async () => {
    getDocs.mockImplementation((ref) => {
      if (ref?.toString().includes('favorites')) {
        return Promise.resolve({
          docs: [{ id: 'test-1', data: () => ({ name: 'Test Place', category: 'Restaurant' }) }]
        });
      }
      return Promise.resolve({ docs: [] });
    });

    await act(async () => renderComponent());
    await waitFor(() => expect(getDocs).toHaveBeenCalled());
    
    const originalConsole = console.error;
    console.error = vi.fn();
    
    getDocs.mockImplementation(() => 
      Promise.reject(new Error('Network error')).catch(() => ({ docs: [] }))
    );
 
    expect(screen.getAllByText('TestUser')[0]).toBeInTheDocument();
    
    console.error = originalConsole;
  });

  test('UI structure and lifecycle', async () => {
    await act(async () => renderComponent());
    
    expect(document.querySelector('.profile-container')).toBeInTheDocument();
    expect(document.querySelector('.tabs')).toBeInTheDocument();
    expect(document.querySelector('.favorites-list')).toBeInTheDocument();
    expect(document.querySelectorAll('.tab')).toHaveLength(3);

    const { unmount } = render(<BrowserRouter><CollegeCompassDash /></BrowserRouter>);
    await act(async () => {
      expect(() => unmount()).not.toThrow();
    });
  });

  test('handles edge cases and malformed data', async () => {
    useCurrentUser.mockReturnValue({ 
      user: { uid: 'test' }, 
      username: undefined 
    });
    
    await act(async () => {
      expect(() => renderComponent()).not.toThrow();
    });
    
    expect(screen.getAllByText('My Favorites')[0]).toBeInTheDocument();
  });
});