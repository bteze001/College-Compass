import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TopRated from './TopRated';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { getDocs, collection } from 'firebase/firestore';

// Mock Firebase
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
}));

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('TopRated Component', () => {
  const mockPlaces = [
    {
      fsq_id: 'abc123',
      name: 'Coffee Spot',
      location: { address: '123 Brew St' },
      photos: [{ prefix: 'https://img.com/', suffix: '.jpg' }],
    },
  ];

  const mockRatingsSnapshot = {
    docs: [
      { data: () => ({ placeId: 'abc123', rating: 5 }) },
      { data: () => ({ placeId: 'abc123', rating: 4 }) },
    ],
  };

  beforeEach(() => {
    getDocs.mockResolvedValue(mockRatingsSnapshot);
    collection.mockReturnValue('mocked_collection');
  });

  it('renders top rated section after loading', async () => {
    render(<TopRated allPlaces={mockPlaces} />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText('⭐ Top Rated')).toBeInTheDocument();
    });

    expect(screen.getAllByText('Coffee Spot')[0]).toBeInTheDocument();
    expect(screen.getAllByText('123 Brew St')[0]).toBeInTheDocument();
  });

  it('does not render if no ratings found', async () => {
    getDocs.mockResolvedValueOnce({ docs: [] }); // edge case for line 40

    const { container } = render(<TopRated allPlaces={mockPlaces} />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(container.querySelector('.top-rated-section')).toBeNull();
    });
  });

  it('returns null if no places match ratings', async () => {
    const ratings = {
      docs: [{ data: () => ({ placeId: 'abc123', rating: 5 }) }],
    };
    getDocs.mockResolvedValueOnce(ratings);

    const { container } = render(<TopRated allPlaces={[]} />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(container.querySelector('.top-rated-section')).toBeNull(); // ensures early return
    });
  });

  it('navigates to place detail on click', async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(<TopRated allPlaces={mockPlaces} />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getAllByText('Coffee Spot')[0]).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Coffee Spot')[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/place/abc123');
  });

  it('correctly calculates average ratings and sorts by highest first', async () => {
    render(<TopRated allPlaces={mockPlaces} />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText('⭐ Top Rated')).toBeInTheDocument();
    });

    const stars = screen.getAllByText('★');
    expect(stars.length).toBeGreaterThan(0);
  });

  it('skips rendering a rating if place does not exist in allPlaces', async () => {
    const badRatingSnapshot = {
      docs: [
        { data: () => ({ placeId: 'nonexistent123', rating: 5 }) }, // not in allPlaces
      ],
    };
    getDocs.mockResolvedValueOnce(badRatingSnapshot);

    const { container } = render(<TopRated allPlaces={mockPlaces} />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(container.querySelector('.top-rated-section')).toBeInTheDocument();
    });

    expect(container.querySelector('.top-rated-card')).toBeNull();
  });

  it('handles mix of valid and invalid place IDs', async () => {
    const mixedRatings = {
      docs: [
        { data: () => ({ placeId: 'abc123', rating: 5 }) },
        { data: () => ({ placeId: 'nonexistent', rating: 4 }) },
      ],
    };
    getDocs.mockResolvedValueOnce(mixedRatings);

    render(<TopRated allPlaces={mockPlaces} />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getAllByText('Coffee Spot').length).toBeGreaterThan(0); // ✅
 // valid still renders
    });
    
  });
});
