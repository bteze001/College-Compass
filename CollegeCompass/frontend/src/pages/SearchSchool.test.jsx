import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchSchool from './SearchSchool';
import { MemoryRouter, useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()), // 👈 keep your custom mock
  };
});

describe('SearchSchool Component', () => {
  const mockData = [
    { fullName: 'University of California, Riverside', name: 'UC Riverside', latitude: 33.9737, longitude: -117.3281 },
    { fullName: 'University of California, Los Angeles', name: 'UCLA', latitude: 34.0689, longitude: -118.4452 }
  ];

  it('renders input field and instructions', () => {
    render(<SearchSchool placeholder="Search a school..." data={mockData} />, { wrapper: MemoryRouter });
    expect(screen.getByPlaceholderText(/search a school/i)).toBeInTheDocument();
    expect(screen.getByText((content, node) => {
      const hasText = (node) => node.textContent === 'Enter a school to explore';
      const nodeHasText = hasText(node);
      const childrenDontHaveText = Array.from(node?.children || []).every(
        (child) => !hasText(child)
      );
      return nodeHasText && childrenDontHaveText;
    })).toBeInTheDocument();
  });

  it('filters and displays matching schools', () => {
    render(<SearchSchool placeholder="Search a school..." data={mockData} />, { wrapper: MemoryRouter });
    fireEvent.change(screen.getByPlaceholderText(/search a school/i), { target: { value: 'uc riverside' } });
    expect(screen.getByText(/university of california, riverside/i)).toBeInTheDocument();
    expect(screen.queryByText(/university of california, los angeles/i)).not.toBeInTheDocument();
  });

  it('displays no school results if no match found', () => {
  render(<SearchSchool placeholder="Search a school..." data={mockData} />, { wrapper: MemoryRouter });
  fireEvent.change(screen.getByPlaceholderText(/search a school/i), { target: { value: 'xyz' } });
  expect(screen.queryByText(/university of california/i)).not.toBeInTheDocument();
  });

  it('navigates to homepage on school selection', () => {
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);
    render(<SearchSchool placeholder="Search a school..." data={mockData} />, { wrapper: MemoryRouter });
    fireEvent.change(screen.getByPlaceholderText(/search a school/i), { target: { value: 'uc riverside' } });
    fireEvent.click(screen.getByText(/university of california, riverside/i));
    expect(navigate).toHaveBeenCalled();
  });


  it('navigates to Log In page when Log In is clicked', () => {
  const navigate = vi.fn();
  vi.mocked(useNavigate).mockReturnValue(navigate);

  render(<SearchSchool placeholder="Search a school..." data={mockData} />, { wrapper: MemoryRouter });

  fireEvent.click(screen.getByText('Log In'));
  expect(navigate).toHaveBeenCalledWith('./LogIn');
  });

  it('navigates to Sign Up page when Sign Up is clicked', () => {
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);

    render(<SearchSchool placeholder="Search a school..." data={mockData} />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText('Sign Up'));
    expect(navigate).toHaveBeenCalledWith('/login?register=true');
  });

});
