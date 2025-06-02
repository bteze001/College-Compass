import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import login from "./LogIn"
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  updateProfile
} from 'firebase/auth';

jest.mock('firebase/auth');

beforeEach(() => {
  jest.clearAllMocks();
});


//test case 1
test("Successful registration", async () => {
  createUserWithEmailAndPassword.mockResolvedValue({ user: {} });
  updateProfile.mockResolvedValue();
  render(<Login />);

  fireEvent.click(screen.getByText(/New user\? Register/i));
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
  fireEvent.change(screen.getByLabelText(/School Email/i), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "123456" } });
  fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "123456" } });
  fireEvent.click(screen.getByText("Register"));

  await waitFor(() => {
    expect(createUserWithEmailAndPassword).toHaveBeenCalled();
    expect(updateProfile).toHaveBeenCalled();
    expect(screen.queryByText(/Passwords do not match/i)).not.toBeInTheDocument();
  });
});
 
//test case 2
test("Passwords must match during registration", async () => {
  render(<Login />);

  fireEvent.click(screen.getByText(/New user\? Register/i));
  fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
  fireEvent.change(screen.getByLabelText(/School Email/i), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "123456" } });
  fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "654321" } });
  fireEvent.click(screen.getByText("Register"));

  expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
});

// Test case 3
test("Successful login with correct credentials", async () => {
  signInWithEmailAndPassword.mockResolvedValue({})
  render(<Login />);

  fireEvent.change(screen.getByLabelText(/School Email/i), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "123456" } });
  fireEvent.click(screen.getByText("Login"));

  await waitFor(() => {
    expect(signInWithEmailAndPassword).toHaveBeenCalled();
    expect(screen.queryByText(/Invalid Login/i)).not.toBeInTheDocument();
  });
});

// Test case 4
test("Invalid login shows error", async () => {
  signInWithEmailAndPassword.mockRejectedValue({ code: "auth/invalid-credential" });
  render(<Login />);

  fireEvent.change(screen.getByLabelText(/School Email/i), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "wrongpass" } });
  fireEvent.click(screen.getByText("Login"));

  expect(await screen.findByText(/Invalid Login/i)).toBeInTheDocument();
});

// Test case 5
test("Guest login works", async () => {
  signInAnonymously.mockResolvedValue({});
  render(<Login />);

  fireEvent.click(screen.getByText(/Continue as Guest/i));

  await waitFor(() => {
    expect(signInAnonymously).toHaveBeenCalled();
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });
});