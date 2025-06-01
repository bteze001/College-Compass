import { describe, test, expect, vi, beforeEach} from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlacesList from './PlacesList';

const mockNavigate = vi.fn();

//when a component uses useNavigate() from react-router-dom 
// return the mock function above instead 
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}), { virtual: true });

vi.mock('../../../backend/SearchFilter', () => {

    return {
        default: {
            applyDistanceFilter: vi.fn((places) => places),
            applyBudgetFilter: vi.fn((places) => places),
        }
    };
});

describe ('PlacesList', () => {

    // Fake place data
    const mockPlaces = [
        {
            fsq_id: '1',
            name: 'Starbucks',
            location: {address: '123 Street'},
            categories: [{name: 'Coffee Shop'}],
            price: 1,
            distance: 100,
        },

        {
            fsq_id: '2',
            name: 'Chick-fil-a',
            location: {address: '124 Street'},
            categories: [{name: 'Fast Food'}],
            price: 1,
            distance: 200,
        },
    ];

    beforeEach(() => {

        vi.clearAllMocks();
        localStorage.clear();

        //SearchFilter.applyDistanceFilter.mockImplementation(() => mockPlaces);
        //SearchFilter.applyBudgetFilter.mockImplementation(() => mockPlaces);
        //mockApplyDistanceFilter.mockImplementation(() => mockPlaces);
        //mockApplyBudgetFilter.mockImplementation((places) => places);
        
    });

    //Test Case 1: Checking if a place is displayed and when clicked goes to place details

    test('Displays and Navigates when clicking', () => {

        render (
            <PlacesList
                category="food"
                foodPlaces={mockPlaces}
                housingPlaces={[]}
                activityPlaces={[]}
                currentLat={0}
                currentLon={0}
                distance={10}
                budget={100}
                //SearchFilter={require('../../../backend/SearchFilter')}
                selectedFoodType="all"
                selectedHousingType="all"
                selectedActivityType="all"
            />
        );

        expect(screen.getByText(/starbucks/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText(/starbucks/i));

        const stored = JSON.parse(localStorage.getItem('selectedPlace'));
        expect(stored.name).toBe('Starbucks');
        expect(mockNavigate).toHaveBeenCalledWith('/place/1');

    });

    //Test Case 2: Check if it filters by subcategory correctly 
    test('Displays and Navigates when clicking', () => {

        render (
            <PlacesList
                category="food"
                foodPlaces={mockPlaces}
                housingPlaces={[]}
                activityPlaces={[]}
                currentLat={0}
                currentLon={0}
                distance={10}
                budget={100}
                //SearchFilter={require('../../../backend/SearchFilter')}
                selectedFoodType="fastfood"
                selectedHousingType="all"
                selectedActivityType="all"
            />
        );

        expect(screen.queryByText(/chick-fil-a/i)).toBeInTheDocument();
        expect(screen.queryByText(/starbucks/i)).not.toBeInTheDocument();
    });

});
