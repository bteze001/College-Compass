import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import axios from 'axios';
import logo from '../assets/logo.png';
import './PlaceDetail.css'; 
import { addFavorite } from './favorites';

//Store all the data in these variables
export default function PlaceDetail() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [ratings, setRatings] = useState([]);

  // Fake user for testing 
  const mockUser = {
    uid: 'mock-user-1',
    displayName: 'Test User',
    email: 'test@example.com'
  };

  const location = useLocation();
  const selectedSchool = location.state?.schoolName || "UCR";

  //When the page opens, check if we already saved this place(in browser) 
  //If yes, then we use it. If not then go get it using the ID. 
  //Also load saved ratings.
  useEffect(() => {
    // First try to get place from localStorage
    const storedPlace = localStorage.getItem('selectedPlace');
    if (storedPlace) {
      try {
        const parsedPlace = JSON.parse(storedPlace);
        console.log("Loaded place from localStorage:", parsedPlace);
        setPlace(parsedPlace);
      } catch (error) {
        console.error("Error parsing place from localStorage:", error);
      }
    } else {
      console.log("No place in localStorage, fetching from API with ID:", placeId);
      fetchPlaceDetails();
    }
    loadRatingsFromLocalStorage();
  }, [placeId]);

 
  //This func talks to the Foursquare website, asks for details about a place using its ID
  const fetchPlaceDetails = async () => {
    try {
      console.log("Fetching place details for ID:", placeId);
      const response = await axios.get(`https://api.foursquare.com/v3/places/${placeId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `${import.meta.env.VITE_API_KEY}`,
        }
      });
      console.log("API response:", response.data);
      setPlace(response.data);
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const handleAddFavorite = async () => {
    try {
      if(!place) return;

      await addFavorite ({
        ...place,
        rating: rating || 0
      });

      setMessage('Added tp favorites!');
    }
    catch (err) {
      console.error('Error adding favorite:', err);
      setMessage('Failed to add favorite.');
    }
  };

  
  //This func checks if there are saved ratings for the place in the browser. 
  //If it finds them, it loads them, shows the average rating, and checks if our fake user already left a rating or comment.
  const loadRatingsFromLocalStorage = () => {
    try {
      const storageKey = `ratings-${placeId}`;
      console.log("Loading ratings with key:", storageKey);
      const storedRatings = localStorage.getItem(storageKey);
      if (storedRatings) {
        const parsedRatings = JSON.parse(storedRatings);
        console.log("Loaded ratings:", parsedRatings);
        setRatings(parsedRatings);
        
        if (parsedRatings.length > 0) {
          const sum = parsedRatings.reduce((acc, curr) => acc + curr.rating, 0);
          setRating(sum / parsedRatings.length);
        }
        //check if fake user already has rated
        const userRatingObj = parsedRatings.find(r => r.userId === mockUser.uid);
        if (userRatingObj) {
          setUserRating(userRatingObj.rating);
          setComment(userRatingObj.comment || '');
        }
      } else {
        console.log("No ratings found for this place");
      }
    } catch (error) {
      console.error('Error loading ratings from localStorage:', error);
    }
  };


  //This func saves the user's rating. If they already rated -> updates it. 
  // Then it saves everything, updates the average, and displays a message.
  const handleRatingSubmit = (selectedRating) => {
    console.log("Submitting rating:", selectedRating);
    setIsSubmitting(true);
    
    try {
      const storageKey = `ratings-${placeId}`;
      let existingRatings = [];
      const storedRatings = localStorage.getItem(storageKey);

      if (storedRatings) {
        existingRatings = JSON.parse(storedRatings);
      }
      const userRatingIndex = existingRatings.findIndex(r => r.userId === mockUser.uid);
      
      // Create new rating object
      const newRating = {
        id: userRatingIndex >= 0 ? existingRatings[userRatingIndex].id : `rating-${Date.now()}`,
        placeId,
        userId: mockUser.uid,
        userName: mockUser.displayName,
        userEmail: mockUser.email,
        rating: selectedRating,
        comment,
        createdAt: new Date().toISOString()
      };
      
      if (userRatingIndex >= 0) {
        existingRatings[userRatingIndex] = newRating;
      } else {
        existingRatings.push(newRating);
      }
      
      localStorage.setItem(storageKey, JSON.stringify(existingRatings));
      console.log("Saved ratings to localStorage:", existingRatings);
      setUserRating(selectedRating);
      setRatings(existingRatings);
      
      const sum = existingRatings.reduce((acc, curr) => acc + curr.rating, 0);
      setRating(sum / existingRatings.length);
      
      setMessage('Rating submitted successfully!');
    } catch (error) {
      console.error('Error saving rating to localStorage:', error);
      setMessage('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // If out websitre doesn’t have the place info yet -> displays a loading message
  if (!place) {
    return (
      <div className="place-detail-container">
        <div className="place-detail-header">
          <img 
            src={logo} 
            alt="collegeCompass" 
            className="logo" 
            onClick={() => navigate('/homepage')}
            style={{ cursor: 'pointer' }}
          />
          <button 
            className="back-button" 
            onClick={() => navigate('/homepage', {
              state: {
                schoolName: selectedSchool,
                lat: location.state?.lat,
                lng: location.state?.lng
              }
            })
          }>
            Back to Home
        </button>
        </div>
        <div className="loading">Loading place details... Place ID: {placeId}</div>
      </div>
    );
  }

  // Main render
  return (
    <div className="place-detail-container">
      <div className="place-detail-header">
        <img 
          src={logo} 
          alt="collegeCompass" 
          className="logo" 
          onClick={() => navigate('/homepage')}
          style={{ cursor: 'pointer' }}
        />
        
        <button 
          className="back-button" 
          onClick={() => navigate('/homepage', {
            state: {
              schoolName: selectedSchool,
              lat: location.state?.lat,
              lng: location.state?.lng
            }
            })
          }>
            Back to Home
        </button>
      </div>

      <div className="place-detail-content">
        <h1 className="place-name">{place.name}</h1>
        
        {place.categories && place.categories[0] && (
          <div className="place-category">
            <span className="category-tag">{place.categories[0].name}</span>
          </div>
        )}
        
        <div className="place-address">
          <p>{place.location?.address || "Address not available"}</p>
          {place.location?.locality && (
            <p>
              {place.location.locality}
              {place.location.region && `, ${place.location.region}`} 
              {place.location.postcode && ` ${place.location.postcode}`}
            </p>
          )}
        </div>

        
        {place.photos && place.photos.length > 0 ? (
          <div className="place-photos">
            <img 
              src={`${place.photos[0].prefix}original${place.photos[0].suffix}`} 
              alt={place.name} 
              className="place-main-photo"
            />
          </div>
        ) : (
          <div className="place-no-photo">No photos available</div>
        )}

        {/* Display average rating + total # of reviews */}
        <div className="rating-section">
          <h2>Ratings & Reviews</h2>
          
          <div className="average-rating">
            <span>Average Rating: {rating.toFixed(1)}/5</span>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`star ${i < Math.round(rating) ? 'filled' : 'empty'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span>({ratings.length} reviews)</span>
          </div>
          
          {/* rating section (only if user is logged in) */}
          <div className="user-rating-section">
            <h3>Rate this place</h3>
            {!isLoggedIn ? (
              <p>Please <span className="login-link" onClick={() => navigate('/login')}>log in</span> to rate this place</p>
            ) : (
              <>
                <div className="user-rating">
                  <div className="stars interactive">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`star ${i < userRating ? 'filled' : 'empty'} ${i < hover ? 'hover' : ''}`}
                        onClick={() => handleRatingSubmit(i + 1)}
                        onMouseEnter={() => setHover(i + 1)}
                        onMouseLeave={() => setHover(0)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                
                  {/* Small text space for user to add an optional comment */}
                <div className="comment-section">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment (optional)"
                    rows={4}
                    className="comment-input"
                  />
                </div>

               {/* Submit button */} 
                <button 
                  className="submit-rating-button" 
                  onClick={() => handleRatingSubmit(userRating || hover)}
                  disabled={isSubmitting || (!userRating && !hover)}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                </button>
              </>
            )}
            
            {message && <div className="rating-message">{message}</div>}
          </div>
          
          <div className="reviews-section">
            <h3>Reviews</h3>
            {ratings.length === 0 ? (
              <p>No reviews yet. Be the first to review!</p>
            ) : (
              <div className="reviews-list">
                {ratings.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <span className="reviewer-name">{review.userName || 'Anonymous'}</span>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`star ${i < review.rating ? 'filled' : 'empty'}`}>★</span>
                        ))}
                      </div>
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && <p className="review-comment">{review.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}