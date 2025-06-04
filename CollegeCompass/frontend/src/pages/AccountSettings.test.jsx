import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AccountSettings from './AccountSettings';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { auth } from '../firebase';
import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';

// Mock Firebase Auth methods
vi.mock('firebase/auth', () => ({
  updateProfile: vi.fn(() => Promise.resolve()),
  updateEmail: vi.fn(() => Promise.resolve()),
  updatePassword: vi.fn(() => Promise.resolve()),
}));

vi.mock('../firebase', () => ({
  auth: {
    currentUser: {
      displayName: 'John Doe',
      email: 'john@example.com',
    }
  }
}));

describe('AccountSettings Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user info on load', () => {
    render(<AccountSettings />);
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
  });

  it('allows editing and saving the username', async () => {
    render(<AccountSettings />);

    fireEvent.click(screen.getByLabelText('edit username'));

    const input = screen.getByDisplayValue('John Doe');
    fireEvent.change(input, { target: { value: 'Jane Doe' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(updateProfile).toHaveBeenCalledWith(auth.currentUser, {
        displayName: 'Jane Doe',
      })
    );
  });

  it('allows editing and saving the email', async () => {
    render(<AccountSettings />);

    fireEvent.click(screen.getByLabelText('edit email'));

    const input = screen.getByDisplayValue('john@example.com');
    fireEvent.change(input, { target: { value: 'jane@example.com' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(updateEmail).toHaveBeenCalledWith(auth.currentUser, 'jane@example.com')
    );
  });

  it('allows editing and saving the password', async () => {
    render(<AccountSettings />);

    fireEvent.click(screen.getByLabelText('edit password'));

    const input = screen.getByPlaceholderText(/enter new password/i);
    fireEvent.change(input, { target: { value: 'newpass123' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() =>
      expect(updatePassword).toHaveBeenCalledWith(auth.currentUser, 'newpass123')
    );
  });
});
