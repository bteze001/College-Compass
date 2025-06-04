import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PlacesList from './PlacesList';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, getDocs, setDoc, deleteDoc, doc as firestoreDoc } from 'firebase/firestore';

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(() => vi.fn()),
}));

vi.mock('../firebase', () => ({
    auth: { currentUser: { uid: 'user1' } },
    db: {},
}));

vi.mock('firebase/firestore', async () => {
    const actual = await vi.importActual('firebase/firestore');
    return {
        ...actual,
        getDocs: vi.fn(() => Promise.resolve({
            forEach: (fn) => fn({ id: 'mockPlaceId' }),
        })),
        setDoc: vi.fn(() => Promise.resolve()),
        deleteDoc: vi.fn(() => Promise.resolve()),
        collection: vi.fn(),
        doc: vi.fn(() => 'doc-ref'),
    };
});

const baseMockPlace = {
    name: 'Mock Place',
    fsq_id: '999',
    rating: 4.5,
    categories: [{ name: 'Generic' }],
    location: { address: '123 Main St' },
    photos: [{ prefix: 'http://img/', suffix: '.jpg' }],
    geocodes: { main: { latitude: 0, longitude: 0 } }
};

const SearchFilter = {
    applyDistanceFilter: (places) => places,
    applyBudgetFilter: (places) => places,
};

const foodPlaces = [
    {
        name: 'Starbucks',
        fsq_id: '1',
        categories: [{ name: 'Coffee Shop' }],
        location: { address: '123 Brew St' },
        photos: [{ prefix: 'https://img/', suffix: '.jpg' }],
        geocodes: { main: {} }
    },
    {
        name: 'McDonald\'s',
        fsq_id: '2',
        categories: [{ name: 'Fast Food' }],
        location: { address: '456 Burger Ave' },
        photos: [{ prefix: 'https://img/', suffix: '.jpg' }],
        geocodes: { main: {} }
    }
];

const activityPlaces = [
    {
        name: 'Central Park',
        fsq_id: '1',
        categories: [{ name: 'Public Park' }],
        location: { address: 'Park Lane' },
        photos: [{ prefix: 'https://img/', suffix: '.jpg' }],
        geocodes: { main: {} }
    },
    {
        name: 'AMC Theatres',
        fsq_id: '2',
        categories: [{ name: 'Movie Theater' }],
        location: { address: 'Film St' },
        photos: [{ prefix: 'https://img/', suffix: '.jpg' }],
        geocodes: { main: {} }
    },

    {
        name: 'Hiking park',
        fsq_id: '3',
        categories: [{ name: 'Hiking Trail' }],
        location: { address: 'Park Lane' },
        photos: [{ prefix: 'https://img/', suffix: '.jpg' }],
        geocodes: { main: {} }
    },
];

const housingPlaces = [
    {
        name: 'Campus Dorm A',
        fsq_id: '1',
        categories: [{ name: 'College Hall' }],
        location: { address: 'Dorm Lane' },
        photos: [{ prefix: 'https://img/', suffix: '.jpg' }],
        distance: 0.5 * 1609, // 0.5 miles in meters
        geocodes: { main: {} }
    },
    {
        name: 'Sunset Apartments',
        fsq_id: '2',
        categories: [{ name: 'Apartment Complex' }],
        location: { address: 'Sunset Blvd' },
        photos: [{ prefix: 'https://img/', suffix: '.jpg' }],
        distance: 2 * 1609, // 2 miles in meters
        geocodes: { main: {} }
    }
];


describe('PlacesList Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders a food place and handles favorite click', () => {
        const place = { ...baseMockPlace, categories: [{ name: 'Coffee Shop' }] };
        render(
            <PlacesList
                category="food"
                foodPlaces={[place]}
                housingPlaces={[]}
                activityPlaces={[]}
                currentLat={0}
                currentLon={0}
                distance={10}
                budget={100}
                SearchFilter={SearchFilter}
                selectedFoodType="all"
                selectedHousingType=""
                selectedActivityType=""
                schoolName="UCLA"
            />
        );
        expect(screen.getByText('Mock Place')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('img', { hidden: true }));
    });

    it('renders a housing place and handles favorite click', () => {
        const place = { ...baseMockPlace, categories: [{ name: 'Apartment' }] };
        render(
            <PlacesList
                category="housing"
                foodPlaces={[]}
                housingPlaces={[place]}
                activityPlaces={[]}
                currentLat={0}
                currentLon={0}
                distance={10}
                budget={100}
                SearchFilter={SearchFilter}
                selectedFoodType=""
                selectedHousingType="all"
                selectedActivityType=""
                schoolName="UCR"
            />
        );
        expect(screen.getByText('Mock Place')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('img', { hidden: true }));
    });

    it('renders an activity place and handles favorite click', () => {
        const place = { ...baseMockPlace, categories: [{ name: 'Park' }] };
        render(
            <PlacesList
                category="activity"
                foodPlaces={[]}
                housingPlaces={[]}
                activityPlaces={[place]}
                currentLat={0}
                currentLon={0}
                distance={10}
                budget={100}
                SearchFilter={SearchFilter}
                selectedFoodType=""
                selectedHousingType=""
                selectedActivityType="parks"
                schoolName="UCR"
            />
        );
        expect(screen.getByText('Mock Place')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('img', { hidden: true }));
    });

    it('returns fallback message if no category is selected', () => {
        render(
            <PlacesList
                category=""
                foodPlaces={[]}
                housingPlaces={[]}
                activityPlaces={[]}
                currentLat={0}
                currentLon={0}
                distance={10}
                budget={100}
                SearchFilter={SearchFilter}
                selectedFoodType=""
                selectedHousingType=""
                selectedActivityType=""
                schoolName="UCLA"
            />
        );
        expect(screen.getByText(/Click a category to see nearby places/i)).toBeInTheDocument();
    });

    it('handles place with no photos', () => {
        const place = { ...baseMockPlace, photos: [] };
        render(
            <PlacesList
                category="food"
                foodPlaces={[place]}
                housingPlaces={[]}
                activityPlaces={[]}
                currentLat={0}
                currentLon={0}
                distance={10}
                budget={100}
                SearchFilter={SearchFilter}
                selectedFoodType="all"
                selectedHousingType=""
                selectedActivityType=""
                schoolName="UCLA"
            />
        );
        expect(screen.getByAltText('Mock Place')).toBeInTheDocument();
    });

    it('handles place with no address', () => {
        const place = { ...baseMockPlace, location: {} };
        render(
            <PlacesList
                category="food"
                foodPlaces={[place]}
                housingPlaces={[]}
                activityPlaces={[]}
                currentLat={0}
                currentLon={0}
                distance={10}
                budget={100}
                SearchFilter={SearchFilter}
                selectedFoodType="all"
                selectedHousingType=""
                selectedActivityType=""
                schoolName="UCLA"
            />
        );
        expect(screen.getByText(/Address not available/)).toBeInTheDocument();
    });

    it('handles place with no categories', () => {
        const place = { ...baseMockPlace, categories: [] };
        render(
            <PlacesList
                category="food"
                foodPlaces={[place]}
                housingPlaces={[]}
                activityPlaces={[]}
                currentLat={0}
                currentLon={0}
                distance={10}
                budget={100}
                SearchFilter={SearchFilter}
                selectedFoodType="all"
                selectedHousingType=""
                selectedActivityType=""
                schoolName="UCLA"
            />
        );
        expect(screen.getByText('Mock Place')).toBeInTheDocument();
    });
});

it('filters food places by subcategory "coffee"', () => {
    render(
        <PlacesList
            category="food"
            foodPlaces={foodPlaces}
            housingPlaces={[]}
            activityPlaces={[]}
            currentLat={0}
            currentLon={0}
            distance={10}
            budget={100}
            SearchFilter={SearchFilter}
            selectedFoodType="coffee"
            selectedHousingType=""
            selectedActivityType=""
            schoolName="UCLA"
        />
    );

    // Should show only coffee places
    expect(screen.getByText('Starbucks')).toBeInTheDocument();
    expect(screen.queryByText("McDonald's")).not.toBeInTheDocument();
});

it('filters food places by subcategory "fastfood"', () => {
    render(
        <PlacesList
            category="food"
            foodPlaces={foodPlaces}
            housingPlaces={[]}
            activityPlaces={[]}
            currentLat={0}
            currentLon={0}
            distance={10}
            budget={100}
            SearchFilter={SearchFilter}
            selectedFoodType="fastfood"
            selectedHousingType=""
            selectedActivityType=""
            schoolName="UCLA"
        />
    );

    // Should show only coffee places
    expect(screen.queryByText('Starbucks')).not.toBeInTheDocument();
    expect(screen.getByText("McDonald's")).toBeInTheDocument();
});

it('filters by subcategory "parks"', () => {
    render(
        <PlacesList
            category="activity"
            foodPlaces={[]}
            housingPlaces={[]}
            activityPlaces={activityPlaces}
            currentLat={0}
            currentLon={0}
            distance={10}
            budget={100}
            SearchFilter={SearchFilter}
            selectedFoodType=""
            selectedHousingType=""
            selectedActivityType="parks"
            schoolName="UCLA"
        />
    );

    expect(screen.getByText('Central Park')).toBeInTheDocument();
    expect(screen.queryByText('AMC Theatres')).not.toBeInTheDocument();
    expect(screen.queryByText('Hiking park')).not.toBeInTheDocument();
});

it('filters by subcategory "theater"', () => {
    render(
        <PlacesList
            category="activity"
            foodPlaces={[]}
            housingPlaces={[]}
            activityPlaces={activityPlaces}
            currentLat={0}
            currentLon={0}
            distance={10}
            budget={100}
            SearchFilter={SearchFilter}
            selectedFoodType=""
            selectedHousingType=""
            selectedActivityType="theater"
            schoolName="UCLA"
        />
    );

    expect(screen.getByText('AMC Theatres')).toBeInTheDocument();
    expect(screen.queryByText('Central Park')).not.toBeInTheDocument();
    expect(screen.queryByText('Hiking park')).not.toBeInTheDocument();
});

it('filters by subcategory "hiking"', () => {
    render(
        <PlacesList
            category="activity"
            foodPlaces={[]}
            housingPlaces={[]}
            activityPlaces={activityPlaces}
            currentLat={0}
            currentLon={0}
            distance={10}
            budget={100}
            SearchFilter={SearchFilter}
            selectedFoodType=""
            selectedHousingType=""
            selectedActivityType="hiking"
            schoolName="UCLA"
        />
    );

    expect(screen.getByText('Hiking park')).toBeInTheDocument();
    expect(screen.queryByText('Central Park')).not.toBeInTheDocument();
    expect(screen.queryByText('AMC Theaters')).not.toBeInTheDocument();
});

it('filters by subcategory "dorms"', () => {
    render(
        <PlacesList
            category="housing"
            foodPlaces={[]}
            housingPlaces={housingPlaces}
            activityPlaces={[]}
            currentLat={0}
            currentLon={0}
            distance={10}
            budget={100}
            SearchFilter={SearchFilter}
            selectedFoodType=""
            selectedHousingType="dorms"
            selectedActivityType=""
            schoolName="UCLA"
        />
    );

    expect(screen.getByText('Campus Dorm A')).toBeInTheDocument();
    expect(screen.queryByText('Sunset Apartments')).not.toBeInTheDocument();
});

it('filters by subcategory "apartments"', () => {
    render(
        <PlacesList
            category="housing"
            foodPlaces={[]}
            housingPlaces={housingPlaces}
            activityPlaces={[]}
            currentLat={0}
            currentLon={0}
            distance={10}
            budget={100}
            SearchFilter={SearchFilter}
            selectedFoodType=""
            selectedHousingType="apartments"
            selectedActivityType=""
            schoolName="UCLA"
        />
    );

    expect(screen.getByText('Sunset Apartments')).toBeInTheDocument();
    expect(screen.queryByText('Campus Dorm A')).not.toBeInTheDocument();
});

it('filters out places beyond the selected distance', () => {
    const nearby = { ...baseMockPlace, name: 'Near Place', distance: 1 * 1609 };
    const far = { ...baseMockPlace, name: 'Far Place', distance: 11 * 1609 }; // 11 miles
  
    render(
      <PlacesList
        category="housing"
        foodPlaces={[]}
        housingPlaces={[nearby, far]}
        activityPlaces={[]}
        currentLat={0}
        currentLon={0}
        distance={10} // limit: 10 miles
        budget={100}
        SearchFilter={{
          applyDistanceFilter: (places) =>
            places.filter((p) => p.distance / 1609 <= 10),
          applyBudgetFilter: (places) => places,
        }}
        selectedFoodType=""
        selectedHousingType="all"
        selectedActivityType=""
        schoolName="UCLA"
      />
    );
  
    expect(screen.getByText('Near Place')).toBeInTheDocument();
    expect(screen.queryByText('Far Place')).not.toBeInTheDocument();
  });
  
  it('filters out places beyond selected budget', () => {
    const cheap = { ...baseMockPlace, name: 'Cheap Place', price: 2 };
    const expensive = { ...baseMockPlace, name: 'Expensive Place', price: 5 };
  
    render(
      <PlacesList
        category="food"
        foodPlaces={[cheap, expensive]}
        housingPlaces={[]}
        activityPlaces={[]}
        currentLat={0}
        currentLon={0}
        distance={10}
        budget={75} // translates to max price level 3
        SearchFilter={{
          applyDistanceFilter: (places) => places,
          applyBudgetFilter: (places) =>
            places.filter((p) => p.price != null && p.price <= 3),
        }}
        selectedFoodType="all"
        selectedHousingType=""
        selectedActivityType=""
        schoolName="UCLA"
      />
    );
  
    expect(screen.getByText('Cheap Place')).toBeInTheDocument();
    expect(screen.queryByText('Expensive Place')).not.toBeInTheDocument();
  });
  