import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash, Home, Utensils, MapPin } from 'lucide-react';
import { db, auth } from '../firebase';
import { getDocs, collection, deleteDoc, doc, query, where } from 'firebase/firestore';
import './UserDashboard.css';
import AccountSettings from './AccountSettings';
import useCurrentUser from './useCurrentUser';
import logo from '../assets/logo.png';

const CollegeCompassDash = () => {
  const [activeTab, setActiveTab] = useState('favorites');

  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const { user, username } = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;

      const snapshot = await getDocs(collection(db, 'favorites', user.uid, 'places'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const dataWithRatings = await Promise.all(data.map(async (place) => {
        const ratingsSnapshot = await getDocs(collection(db, 'ratings'));
        const relevantRatings = ratingsSnapshot.docs
          .map(doc => doc.data())
          .filter(r => r.placeId === place.fsq_id || r.placeId === place.id);

          if (relevantRatings.length > 0) {
            const sum = relevantRatings.reduce((acc, r) => acc + r.rating, 0);
            const avgRating = sum / relevantRatings.length;
            console.log("Ratings from database: ", {avgRating})
            return { ...place, rating: avgRating };
          }
          
          console.log("No ratings for this place")
          return { ...place, rating: null || 0};
      }));

      console.log('Fetched favorites:', data);
      setFavorites(dataWithRatings);
    };

    const fetchReviews = async () => {
      if (!user) return;

      try {
        const reviewsQuery = query(
          collection(db, 'ratings'),
          where('userId', '==', user.uid)
        );
        
        const snapshot = await getDocs(reviewsQuery);
        const reviewsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log('Fetched reviews:', reviewsData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchFavorites();
    fetchReviews();
  }, [user]);

  const getCategoryIcon = (category) => {
    const lower = category?.toLowerCase() || '';
  
    if (
      lower.includes('apartment') ||
      lower.includes('housing') ||
      lower.includes('condo') ||
      lower.includes('residence') ||
      lower.includes('complex') ||
      lower.includes('hall') ||
      lower.includes('college')
    ) {
      return <Home size={50} />;
    }
  
    if (
      lower.includes('food') ||
      lower.includes('restaurant') ||
      lower.includes('café') ||
      lower.includes('coffee') ||
      lower.includes('bubble tea') ||
      lower.includes('burger') ||
      lower.includes('deli') ||
      lower.includes('chicken') ||
      lower.includes('sandwich') ||
      lower.includes('steak') ||
      lower.includes('joint') ||
      lower.includes('diner')
    ) {
      return <Utensils size={50} />;
    }
  
    if (
      lower.includes('park') ||
      lower.includes('trail') ||
      lower.includes('museum') ||
      lower.includes('cineam') ||
      lower.includes('hiking') ||
      lower.includes('theater')
    ) {
      return <MapPin size={50} />;
    }
  
    return <Home size={50} />; // fallback
  };

  const getRatings = (place) => {
    return place.rating || 0;
  };
  
  const handleDelete = async (fsqId) => {
    if (!user) return;

    await deleteDoc(doc(db, 'favorites', user.uid, 'places', fsqId));
    setFavorites(prev => prev.filter(place => place.id !== fsqId));
  };

  const handleDeleteReview = async (reviewId) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'ratings', reviewId));
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Date not available';
    
    // Handle Firebase timestamp
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString();
    }
    
    // Handle regular date
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="profile-container">

      {/* Logo and Edit Profile button */}
      <div className="dashboard-header">
        <img src={logo} alt="College Compass Logo" className="dashboard-logo" />
        <button className='back' onClick={() => {
          const savedSchool = JSON.parse(localStorage.getItem('selectedSchool')) || {};
          navigate('/homepage', {
            state: {
              lat: savedSchool.lat,
              lng: savedSchool.lon,
              schoolName: savedSchool.name
            }
          });
        }} > Home </button>
      </div>

      {/* User info section */}
      <div className="user-info">
        <div className="user-left">
          <div className="user-container">
            <div className="user">
              <div className="user-head"></div>
              <div className="user-body"></div>
            </div>
          </div>
          <div className="user-details">
            <div className="username_dashboard">{username}</div>
            <div className="user-email">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tabs">
        <div className="tab-buttons">
          <div
            className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <span className="tab-label">My Favorites</span>
          </div>
          <div
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <span className="tab-label">My Reviews</span>
          </div>
          <div
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="tab-label">Account Settings</span>
          </div>
        </div>
      </div>

      {/* My Favorites */}
      {activeTab === 'favorites' && (
        <div className="favorites-list">
          {favorites.map((place) => (
            <div key={place.id || place.fsq_id} className="favorite-item">
              <div className="place-info">
                <div className="place-icon">
                  {getCategoryIcon(place.category)}
                </div>
                <div>
                  <div className="place-name">{place.name}</div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)} ${place.address || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='place-address'
                  >  
                    <p> {place.address || "Address not available"}</p>
                  </a>
                  <div className="stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="star">
                        {i < Math.floor(getRatings(place)) ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={() => handleDelete(place.id)} className="delete-button">
                <Trash color="#B91C1C" size={24} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* My Reviews */}
      {activeTab === 'reviews' && (
        <div className="reviews-list">
          {reviews.length === 0 ? (
            <div className="reviews-placeholder">
              Your reviews will appear here
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="place-info">
                  <div className="place-icon">
                    {getCategoryIcon(review.category)}
                  </div>
                  <div className="review-details">
                    <div className="place-name">{review.placeName || 'Unknown Place'}</div>
                    <div className="review-rating">
                      <div className="stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="star">
                            {i < review.rating ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <span className="rating-number">({review.rating}/5)</span>
                    </div>
                    {review.comment && (
                      <div className="review-comment">"{review.comment}"</div>
                    )}
                    <div className="review-date">
                      {formatDate(review.createdAt || review.timestamp)}
                    </div>
                  </div>
                </div>
                <button onClick={() => handleDeleteReview(review.id)} className="delete-button">
                  <Trash color="#B91C1C" size={24} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Account Settings */}
      {activeTab === 'settings' && (
        <AccountSettings />
      )}
    </div>
  );
};

export default CollegeCompassDash;