// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import login from "./LogIn"
// import { auth } from '../firebase';
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signInAnonymously,
//   updateProfile
// } from 'firebase/auth';

// jest.mock('firebase/auth');

// beforeEach(() => {
//   jest.clearAllMocks();
// });


// //test case 1
// test("Successful registration", async () => {
//   createUserWithEmailAndPassword.mockResolvedValue({ user: {} });
//   updateProfile.mockResolvedValue();
//   render(<Login />);

//   fireEvent.click(screen.getByText(/New user\? Register/i));
//   fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
//   fireEvent.change(screen.getByLabelText(/School Email/i), { target: { value: "test@example.com" } });
//   fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "123456" } });
//   fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "123456" } });
//   fireEvent.click(screen.getByText("Register"));

//   await waitFor(() => {
//     expect(createUserWithEmailAndPassword).toHaveBeenCalled();
//     expect(updateProfile).toHaveBeenCalled();
//     expect(screen.queryByText(/Passwords do not match/i)).not.toBeInTheDocument();
//   });
// });

// //test case 2
// test("Passwords must match during registration", async () => {
//   render(<Login />);

//   fireEvent.click(screen.getByText(/New user\? Register/i));
//   fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
//   fireEvent.change(screen.getByLabelText(/School Email/i), { target: { value: "test@example.com" } });
//   fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "123456" } });
//   fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "654321" } });
//   fireEvent.click(screen.getByText("Register"));

//   expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
// });

// // Test case 3
// test("Successful login with correct credentials", async () => {
//   signInWithEmailAndPassword.mockResolvedValue({})
//   render(<Login />);

//   fireEvent.change(screen.getByLabelText(/School Email/i), { target: { value: "test@example.com" } });
//   fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "123456" } });
//   fireEvent.click(screen.getByText("Login"));

//   await waitFor(() => {
//     expect(signInWithEmailAndPassword).toHaveBeenCalled();
//     expect(screen.queryByText(/Invalid Login/i)).not.toBeInTheDocument();
//   });
// });

// // Test case 4
// test("Invalid login shows error", async () => {
//   signInWithEmailAndPassword.mockRejectedValue({ code: "auth/invalid-credential" });
//   render(<Login />);

//   fireEvent.change(screen.getByLabelText(/School Email/i), { target: { value: "test@example.com" } });
//   fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "wrongpass" } });
//   fireEvent.click(screen.getByText("Login"));

//   expect(await screen.findByText(/Invalid Login/i)).toBeInTheDocument();
// });

// // Test case 5
// test("Guest login works", async () => {
//   signInAnonymously.mockResolvedValue({});
//   render(<Login />);

//   fireEvent.click(screen.getByText(/Continue as Guest/i));

//   await waitFor(() => {
//     expect(signInAnonymously).toHaveBeenCalled();
//     expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
//   });
// });

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './LogIn';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
} from 'firebase/auth';

vi.mock('firebase/auth');

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

// Helper to render Login with router
function renderWithRouter(ui, { route = '/login' } = {}) {
  window.history.pushState({}, 'Test page', route);
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

// test 1: successful registration
test('Successful registration', async () => {
  createUserWithEmailAndPassword.mockResolvedValue({ user: {} });
  updateProfile.mockResolvedValue();

  renderWithRouter(<Login />, { route: '/login?register=true' });

  fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText('School Email'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123456' } });
  fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: '123456' } });

  fireEvent.click(screen.getByRole('button', { name: 'Register' }));

  await waitFor(() => {
    expect(createUserWithEmailAndPassword).toHaveBeenCalled();
    expect(updateProfile).toHaveBeenCalled();
    expect(screen.queryByText(/Passwords do not match/i)).not.toBeInTheDocument();
  });
});

// test 2: password mismatch
test('Passwords must match during registration', async () => {
  renderWithRouter(<Login />, { route: '/login?register=true' });

  fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText('School Email'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123456' } });
  fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: '654321' } });

  fireEvent.click(screen.getByRole('button', { name: 'Register' }));

  expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
});

// test 3: login success
test('Successful login with correct credentials', async () => {
  signInWithEmailAndPassword.mockResolvedValue({});

  renderWithRouter(<Login />);

  fireEvent.change(screen.getByLabelText('School Email'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123456' } });

  fireEvent.click(screen.getByRole('button', { name: 'Login' }));

  await waitFor(() => {
    expect(signInWithEmailAndPassword).toHaveBeenCalled();
    expect(screen.queryByText(/Invalid Login/i)).not.toBeInTheDocument();
  });
});

// test 4: login error
test('Invalid login shows error', async () => {
  signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/invalid-credential' });

  renderWithRouter(<Login />);

  fireEvent.change(screen.getByLabelText('School Email'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpass' } });

  fireEvent.click(screen.getByRole('button', { name: 'Login' }));

  expect(await screen.findByText(/Invalid Login/i)).toBeInTheDocument();
});

// test 5: guest login
test('Guest login navigates to homepage without calling signInAnonymously', async () => {
  const navigateMock = vi.fn();
  useNavigate.mockReturnValue(navigateMock); // mock the navigate function

  renderWithRouter(<Login />);

  fireEvent.click(screen.getByRole('button', { name: /continue as guest/i }));

  await waitFor(() => {
    expect(navigateMock).toHaveBeenCalledWith('/homepage');
  });
});

