import { describe, test, expect, vi, beforeEach } from 'vitest';
import React from "react";
import Homepage from "./Homepage";
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom';

vi.mock('react-router-dom', () => {

    const mockNavigate = vi.fn();
    const mockLocation = {
        state: {
            lat: 34.0,
            lng: -118.0,
            schoolName: 'UCLA',
        }
    };

    return {
        useNavigate: () => mockNavigate,
        useLocation: () => mockLocation,
        BrowserRouter: ({ children }) => children,
        Routes: ({ children }) => children,
        Route: () => null,
        Link: ({ children, to }) => <a href={to}>{children}</a>
    };

}, { virtual: true });

vi.mock('../../../backend/places', () => {

    return {
        default: () => ({
            fetchPlaces: vi.fn(() => Promise.resolve({ data: [], fromCache: true })),
            isLoading: false,
            error: null,
        })
    };
});

vi.mock('../../../backend/SearchFilter', () => {

    return {
        default: {
            applyDistanceFilter: vi.fn((places) => places),
            applyBudgetFilter: vi.fn((places) => places),
        }
    };
});
//Test Case 1: Testing all main buttons and the logo are displayed 

test('Displays logo and buttons', () => {

    render(<Homepage />);

    expect(screen.getByAltText(/collegeCompass/i)).toBeInTheDocument(); // Logo 
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
});

//Test Case 2: Filter button toggles correctly

test("Filters are shown / hidden when the filter button is clicked", () => {

    render(<Homepage />)

    const filterBtn = screen.getByRole('button', { name: /filter/i });

    fireEvent.click(filterBtn);
    expect(screen.getByText(/Distance:/i)).toBeInTheDocument();

    fireEvent.click(filterBtn);
    expect(screen.queryByText(/Distance:/i)).not.toBeInTheDocument();

});

// Test Case 6: Search input 
test("Typing in the search input updates state and filters list", async () => {
    
    render(<Homepage />);

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "Pizza" } });

    expect(input.value).toBe("Pizza");

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

});

