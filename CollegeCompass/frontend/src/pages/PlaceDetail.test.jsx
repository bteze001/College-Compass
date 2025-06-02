import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import PlaceDetail from './PlaceDetail';

vi.mock('axios');
vi.mock('../firebase', () => ({
  firestore: {},
  auth: { currentUser: null }
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: vi.fn()
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn()
}));

const mockNavigate = vi.fn();
const mockUseParams = vi.fn();
const mockUseLocation = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
    useLocation: () => mockUseLocation()
  };
});

import { onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, getDocs } from 'firebase/firestore';
import axios from 'axios';

describe('PlaceDetail Component - Simplified Tests', () => {
  const mockPlace = {
    name: 'Test Restaurant',
    categories: [{ name: 'Restaurant' }],
    location: {
      address: '123 Test St',
      locality: 'Test City',
      region: 'CA',
      postcode: '12345'
    },
    photos: [{
      prefix: 'https://example.com/',
      suffix: '.jpg'
    }]
  };

  const mockUser = {
    uid: 'test-user-id',
    displayName: 'Test User',
    email: 'test@example.com'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseParams.mockReturnValue({ placeId: 'test-place-id' });
    mockUseLocation.mockReturnValue({
      state: { schoolName: 'UCR', lat: 33.9737, lng: -117.3281 }
    });
    
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null); // Default - no user
      return vi.fn(); 
    });
    
    onSnapshot.mockImplementation((query, callback) => {
      callback({ forEach: vi.fn() }); 
      return vi.fn(); 
    });
    
    getDocs.mockResolvedValue({ empty: true, docs: [] });
    localStorage.clear();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/place/test-place-id']}>
        <PlaceDetail />
      </MemoryRouter>
    );
  };

  describe('Basic Functionality', () => {
    test('renders loading state initially', () => {
      renderComponent();
      expect(screen.getByText(/Loading place details/)).toBeInTheDocument();
      expect(screen.getByText(/Place ID: test-place-id/)).toBeInTheDocument();
    });

    test('displays place info from localStorage', () => {
      localStorage.setItem('selectedPlace', JSON.stringify(mockPlace));
      renderComponent();
      
      expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
      expect(screen.getByText('Restaurant')).toBeInTheDocument();
      expect(screen.getByText('123 Test St')).toBeInTheDocument();
    });

    test('fetches place details from API when localStorage is empty', async () => {
      axios.get.mockResolvedValue({ data: mockPlace });
      renderComponent();
      
      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith(
          'https://api.foursquare.com/v3/places/test-place-id',
          expect.objectContaining({
            headers: expect.objectContaining({
              Accept: 'application/json',
              Authorization: expect.any(String)
            })
          })
        );
      });
    });

    test('displays place photo when available', () => {
      localStorage.setItem('selectedPlace', JSON.stringify(mockPlace));
      renderComponent();
      
      const image = screen.getByAltText('Test Restaurant');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/original.jpg');
    });

    test('shows no photo message when photos unavailable', () => {
      const placeWithoutPhotos = { ...mockPlace, photos: [] };
      localStorage.setItem('selectedPlace', JSON.stringify(placeWithoutPhotos));
      
      renderComponent();
      
      expect(screen.getByText('No photos available')).toBeInTheDocument();
    });
  });

  describe('Authentication States', () => {
    test('shows login prompt when user not authenticated', () => {
      localStorage.setItem('selectedPlace', JSON.stringify(mockPlace));
      renderComponent();
      
      expect(screen.getByText((content, element) => {
        return element?.textContent === 'Please log in to rate this place';
      })).toBeInTheDocument();
    });

    test('shows user info when authenticated', () => {
      localStorage.setItem('selectedPlace', JSON.stringify(mockPlace));
      
      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser);
        return vi.fn();
      });
      
      renderComponent();
      
      expect(screen.getByText('Signed in as: Test User')).toBeInTheDocument();
      expect(screen.getByText('Rate this place')).toBeInTheDocument();
    });
  });

  describe('Rating System', () => {
    beforeEach(() => {
      localStorage.setItem('selectedPlace', JSON.stringify(mockPlace));
      onAuthStateChanged.mockImplementation((auth, callback) => {
        callback(mockUser);
        return vi.fn();
      });
    });

    test('displays star rating interface', () => {
      renderComponent();
      
      // Should have 10 stars total (5 for display, 5 for interaction)
      const stars = screen.getAllByText('★');
      expect(stars.length).toBeGreaterThanOrEqual(5);
    });

    test('allows user to click stars', () => {
      renderComponent();
      
      const stars = screen.getAllByText('★');
      // Click on a star (find interactive ones)
      fireEvent.click(stars[7]); // Try clicking on one of the later stars
      
      // Check if rating text appears
      expect(screen.getByText(/\d\/5 stars/)).toBeInTheDocument();
    });

    test('shows submit button for authenticated users', () => {
      renderComponent();
      
      expect(screen.getByText('Submit Rating')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    test('back button navigates to homepage', () => {
      localStorage.setItem('selectedPlace', JSON.stringify(mockPlace));
      renderComponent();
      
      const backButton = screen.getByText('Back to Home');
      fireEvent.click(backButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/homepage', expect.any(Object));
    });

    test('logo click navigates to homepage', () => {
      localStorage.setItem('selectedPlace', JSON.stringify(mockPlace));
      renderComponent();
      
      const logo = screen.getByAltText('collegeCompass');
      fireEvent.click(logo);
      
      expect(mockNavigate).toHaveBeenCalledWith('/homepage');
    });
  });

  describe('Reviews Section', () => {
    test('shows empty reviews message', () => {
      localStorage.setItem('selectedPlace', JSON.stringify(mockPlace));
      renderComponent();
      
      expect(screen.getByText('No reviews yet. Be the first to review!')).toBeInTheDocument();
    });

    test('displays reviews count', () => {
      localStorage.setItem('selectedPlace', JSON.stringify(mockPlace));
      renderComponent();
      
      expect(screen.getByText('Reviews (0)')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles API errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      axios.get.mockRejectedValue(new Error('API Error'));
      
      renderComponent();
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching place details:', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });

    test('handles invalid localStorage data', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem('selectedPlace', 'invalid-json');
      
      renderComponent();
      
      expect(consoleSpy).toHaveBeenCalledWith('Error parsing place from localStorage:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});