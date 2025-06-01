import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  onSnapshot 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { firestore, auth } from '../firebase';
import axios from 'axios';
import logo from '../assets/logo.png';
import './PlaceDetail.css'; 

export default function PlaceDetail() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [user, setUser] = useState(null); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [ratings, setRatings] = useState([]);
  const [userExistingRating, setUserExistingRating] = useState(null);

  const location = useLocation();
  const selectedSchool = location.state?.schoolName || "UCR";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoggedIn(!!currentUser);
      console.log("Auth state changed:", currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
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
    
    //real-time listener for ratings
    const unsubscribe = loadRatingsFromFirestore();
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [placeId]);

  useEffect(() => {
    if (user && placeId) {
      loadUserRating();
    } else {
      setUserRating(0);
      setComment('');
      setUserExistingRating(null);
    }
  }, [user, placeId]);

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

  // Load all ratings for this place - from Firestore
  const loadRatingsFromFirestore = () => {
    if (!placeId) return;
    
    try {
      const ratingsRef = collection(firestore, 'ratings');
      
      // Try with orderBy first - then fall back to simple query if index doesn't exist(I made it so it should)
      let q;
      try {
        q = query(
          ratingsRef, 
          where('placeId', '==', placeId),
          orderBy('createdAt', 'desc')
        );
      } catch (indexError) {
        console.log("Index not ready, using simple query:", indexError);
        q = query(ratingsRef, where('placeId', '==', placeId));
      }
      
      console.log("Setting up real-time listener for placeId:", placeId);
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const ratingsData = [];
        querySnapshot.forEach((doc) => {
          ratingsData.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort manually if no orderBy was used
        ratingsData.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
          return dateB - dateA; 
        });
        
        console.log("Firestore listener triggered - ratings count:", ratingsData.length);
        console.log("Loaded ratings from Firestore:", ratingsData);
        setRatings(ratingsData);
        
        // Calculate average rating
        if (ratingsData.length > 0) {
          const sum = ratingsData.reduce((acc, curr) => acc + curr.rating, 0);
          setRating(sum / ratingsData.length);
        } else {
          setRating(0);
        }
      }, (error) => {
        console.error("Error in Firestore listener:", error);
        if (error.code === 'failed-precondition' && error.message.includes('index')) {
          console.log("Index required. Please create the index using the link in the error message.");
          
          const simpleQuery = query(ratingsRef, where('placeId', '==', placeId));
          const fallbackUnsubscribe = onSnapshot(simpleQuery, (querySnapshot) => {
            const ratingsData = [];
            querySnapshot.forEach((doc) => {
              ratingsData.push({ id: doc.id, ...doc.data() });
            });
            
            // Sort manually
            ratingsData.sort((a, b) => {
              const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
              const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
              return dateB - dateA;
            });
            
            setRatings(ratingsData);
            
            if (ratingsData.length > 0) {
              const sum = ratingsData.reduce((acc, curr) => acc + curr.rating, 0);
              setRating(sum / ratingsData.length);
            } else {
              setRating(0);
            }
          });
          
          return fallbackUnsubscribe;
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error setting up Firestore listener:', error);
    }
  };

  const loadUserRating = async () => {
    if (!user || !placeId) return;
    
    try {
      const ratingsRef = collection(firestore, 'ratings');
      const q = query(
        ratingsRef, 
        where('placeId', '==', placeId),
        where('userId', '==', user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userRatingDoc = querySnapshot.docs[0];
        const userData = userRatingDoc.data();
        setUserRating(userData.rating);
        setComment(userData.comment || '');
        setUserExistingRating({ id: userRatingDoc.id, ...userData });
        console.log("Found existing user rating:", userData);
      } else {
        console.log("No existing rating found for user");
        setUserRating(0);
        setComment('');
        setUserExistingRating(null);
      }
    } catch (error) {
      console.error('Error loading user rating:', error);
    }
  };

  const handleRatingSubmit = async (selectedRating) => {
    if (!user) {
      setMessage('Please log in to submit a rating');
      return;
    }

    if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
      setMessage('Please select a valid rating (1-5 stars)');
      return;
    }

    console.log("Submitting rating:", selectedRating);
    setIsSubmitting(true);
    
    try {
      const ratingData = {
        placeId,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userEmail: user.email,
        rating: selectedRating,
        comment: comment.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (userExistingRating) {
        // Update existing rating
        const ratingDocRef = doc(firestore, 'ratings', userExistingRating.id);
        await updateDoc(ratingDocRef, {
          ...ratingData,
          updatedAt: new Date()
        });
        console.log("Updated existing rating");
        setMessage('Rating updated successfully!');
      } else {
        // Create new rating
        await addDoc(collection(firestore, 'ratings'), ratingData);
        console.log("Created new rating");
        setMessage('Rating submitted successfully!');
      }
      
      setUserRating(selectedRating);
      
    } catch (error) {
      console.error('Error saving rating to Firestore:', error);
      setMessage('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // If website doesn't have the place info yet -> displays a loading message
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
          
          {/* Rating section */}
          <div className="user-rating-section">
            <h3>{userExistingRating ? 'Update your rating' : 'Rate this place'}</h3>
            {!isLoggedIn ? (
              <p>Please <span className="login-link" onClick={() => navigate('/login')}>log in</span> to rate this place</p>
            ) : (
              <>
                <div className="user-info">
                  <p>Signed in as: {user?.displayName || user?.email}</p>
                </div>
                
                <div className="user-rating">
                  <div className="stars interactive">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`star ${i < userRating ? 'filled' : 'empty'} ${i < hover ? 'hover' : ''}`}
                        onClick={() => setUserRating(i + 1)}
                        onMouseEnter={() => setHover(i + 1)}
                        onMouseLeave={() => setHover(0)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  {userRating > 0 && <span className="rating-text">{userRating}/5 stars</span>}
                </div>
                
                {/* Comment section */}
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
                  onClick={() => handleRatingSubmit(userRating)}
                  disabled={isSubmitting || userRating === 0}
                >
                  {isSubmitting ? 'Submitting...' : (userExistingRating ? 'Update Rating' : 'Submit Rating')}
                </button>
              </>
            )}
            
            {message && <div className="rating-message">{message}</div>}
          </div>
          
          <div className="reviews-section">
            <h3>Reviews ({ratings.length})</h3>
            <div className="debug-info" style={{fontSize: '12px', color: '#666', marginBottom: '10px'}}>
              Debug: placeId = {placeId}, ratings.length = {ratings.length}
            </div>
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
                        {review.createdAt?.toDate ? 
                          review.createdAt.toDate().toLocaleDateString() : 
                          new Date(review.createdAt).toLocaleDateString()
                        }
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