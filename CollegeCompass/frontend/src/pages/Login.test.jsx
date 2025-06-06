import { describe, test, expect, vi, beforeEach } from 'vitest';
import { waitFor, render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './LogIn'; 

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ search: '' }),
    Link: ({ to, children }) => <a href={to}>{children}</a>
  };
});

vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual('firebase/auth');
  return {
    ...actual,
    signInWithEmailAndPassword: vi.fn(() => Promise.resolve({ user: { uid: '12345', email: 'test@ucr.edu' } })),
    createUserWithEmailAndPassword: vi.fn(() => Promise.resolve({ user: { uid: '12345' } })),
    updateProfile: vi.fn(() => Promise.resolve()),
    signInAnonymously: vi.fn(() => Promise.resolve({ user: { uid: 'tester' } })),
  };
});

describe('Login Page', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

    test('renders login form with inputs and buttons', () => {
    render(<Login />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();

    const emailInput = screen.getByRole('textbox');
    expect(emailInput).toBeInTheDocument();

    const passwordInput = document.querySelector('input[type="password"]');
    expect(passwordInput).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue as guest/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new user\? register/i })).toBeInTheDocument();
  });


  test('switches to registration mode when clicking register toggle', () => {
    render(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /new user\? register/i }));
    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^register$/i })).toBeInTheDocument();
  });

  test('shows error when passwords do not match on register', async () => {
    render(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /new user\? register/i }));

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'testuser' } });
    fireEvent.change(inputs[1], { target: { value: 'test@edu.com' } });

    const passwordFields = document.querySelectorAll('input[type="password"]');
    fireEvent.change(passwordFields[0], { target: { value: 'pass123' } });
    fireEvent.change(passwordFields[1], { target: { value: 'mismatch' } });

    fireEvent.click(screen.getByRole('button', { name: /^register$/i }));
    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  test('submits login credentials and navigates', async () => {
    render(<Login />);

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'test@ucr.edu' } }); 

    const passwordFields = document.querySelectorAll('input[type="password"]');
    fireEvent.change(passwordFields[0], { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/homepage', { state: undefined });
    });
  });

  test('allows guest login and navigates to homepage', async () => {
    render(<Login />);
    fireEvent.click(screen.getByRole('button', { name: /continue as guest/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/homepage', { state: undefined });
  });
});
