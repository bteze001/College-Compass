import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addFavorite } from './favorites';
import { setDoc, doc } from 'firebase/firestore';
import { auth } from '../firebase';

vi.mock('../firebase', () => ({
  auth: { currentUser: { uid: 'test-user' } },
  db: {},
}));

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    setDoc: vi.fn(),
    doc: vi.fn(() => 'mock-doc-ref'),
  };
});

const mockPlace = {
  name: 'Mock Place',
  fsq_id: 'abc123',
  rating: 4.5,
  userRating: 5,
  categories: [{ name: 'Coffee Shop' }],
  location: { address: '123 Brew St' },
  photos: [{ prefix: 'https://img/', suffix: '.jpg' }]
};

describe('addFavorite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.currentUser = { uid: 'test-user' }; // reset user before each test
  });

  it('adds a favorite if user is logged in', async () => {
    await addFavorite(mockPlace);

    expect(setDoc).toHaveBeenCalledWith(
      'mock-doc-ref',
      expect.objectContaining({
        name: 'Mock Place',
        rating: 4.5,
        userRating: 5,
        category: 'Coffee Shop',
        address: '123 Brew St',
        photo: 'https://img/original.jpg',
        fsq_id: 'abc123',
      })
    );
  });

  it('uses fallback address and empty photo when missing', async () => {
    const noPhotoPlace = {
      ...mockPlace,
      photos: [],
      location: {},
    };

    await addFavorite(noPhotoPlace);

    expect(setDoc).toHaveBeenCalledWith(
      'mock-doc-ref',
      expect.objectContaining({
        photo: '',
        address: 'Address not available',
      })
    );
  });

  it('throws an error if user is not logged in', async () => {
    auth.currentUser = null;

    await expect(() => addFavorite(mockPlace)).rejects.toThrow('Not logged in');
  });
});
