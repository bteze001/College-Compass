import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders the site homepage', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // Check that the "Log In" button appears
  expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();

  // Check that the input appears
  expect(screen.getByPlaceholderText(/find a school/i)).toBeInTheDocument();
  
});
