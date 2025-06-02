import { describe, test, expect, vi, beforeEach } from 'vitest';
import React from "react";
import Homepage from './Homepage';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';

const mockNavigate = vi.fn();
const mockSignOut = vi.fn(() => Promise.resolve());
const mockFetchPlaces = vi.fn(() =>
    Promise.resolve({
        data: [{
            name: 'Mock Place',
            categories: [{
                name: 'Food'
            }],
            location: {},
            photos: [],
            fsq_id: '1',
        }],
        fromCache: false
    })
);

vi.mock('react-router-dom', () => ({

    // const mockNavigate = vi.fn();
    useNavigate: () => mockNavigate,
    // const mockLocation = {
    useLocation: () => ({
        state: {
            lat: 34.0,
            lng: -118.0,
            schoolName: 'UCLA',
        },
    }),
}));

vi.mock('../../../backend/places', () => ({
    __esModule: true,
    default: () => ({
        fetchPlaces: mockFetchPlaces,
        isLoading: false,
        error: null,
        clearCache: vi.fn(),
    }),
}));

vi.mock('../../../backend/SearchFilter', () => ({
    __esModule: true,
    default: {
        applyDistanceFilter: vi.fn((places) => places),
        applyBudgetFilter: vi.fn((places) => places),
    },
}));

vi.mock('./useCurrentUser', () => ({
    __esModule: true,
    default: () => ({
        user: null,
        username: null,
    }),
}));

describe('Homepage Component Tests', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetModules(); 
    });
 
    test('Displays logo and buttons', () => {

        render(<Homepage />);

        expect(screen.getByAltText(/collegeCompass/i)).toBeInTheDocument(); // Logo 
        expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
    });

    test("Filters are shown / hidden when the filter button is clicked", () => {

        render(<Homepage />)

        const filterBtn = screen.getByRole('button', { name: /filter/i });

        fireEvent.click(filterBtn);
        expect(screen.getByText(/Distance:/i)).toBeInTheDocument();

        fireEvent.click(filterBtn);
        expect(screen.queryByText(/Distance:/i)).not.toBeInTheDocument();

    });

    test("Typing in the search input updates state and filters list", async () => {

        render(<Homepage />);

        const input = screen.getByPlaceholderText(/search/i);
        fireEvent.change(input, { target: { value: "Pizza" } });

        expect(input.value).toBe("Pizza");

        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    });

    test('Clicking logo navigates to homepage', () => {
        render(<Homepage />);
        fireEvent.click(screen.getByAltText(/collegeCompass/i));
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('Clicking Dashboard while logged out redirects to login', () => {
        render(<Homepage />);
        fireEvent.click(screen.getAllByRole('button', { name: /dashboard/i })[0]);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    test('Clicking Food button fetches food places', async () => {
        render(<Homepage />);
        fireEvent.click(screen.getByRole('button', { name: /food/i }));
        await waitFor(() => expect(mockFetchPlaces).toHaveBeenCalledWith('food', '', 10, 100, 'all'));
    });

    test('Clicking Housing button fetches housing places', async () => {
        render(<Homepage />);
        fireEvent.click(screen.getByRole('button', { name: /housing/i }));
        await waitFor(() => expect(mockFetchPlaces).toHaveBeenCalledWith('housing', '', 10, 100, 'all'));
    });

    test('Clicking Activities button fetches activity places', async () => {
        render(<Homepage />);
        fireEvent.click(screen.getByRole('button', { name: /activites/i }));
        await waitFor(() => expect(mockFetchPlaces).toHaveBeenCalledWith('activity', '', 10, 100, 'all'));
    });

    test('Search button triggers search', () => {
        render(<Homepage />);
        const input = screen.getByPlaceholderText(/search/i);
        fireEvent.change(input, { target: { value: 'Boba' } });
        const button = screen.getByRole('button', { name: /search/i });
        fireEvent.click(button);
    });

});
