import React, { useState } from 'react';
import { Trash } from 'lucide-react';
import './UserDashboard.css';

const CollegeCompassDash = () => {

  //active tab will keep track of which tab the user is on - default is favorites
  const [activeTab, setActiveTab] = useState('favorites');
  //temp vals, we will need to get them from the database eventually 
  const [favorites, setFavorites] = useState([
    { id: 1, name: 'Place Name', rating: 3 },
    { id: 2, name: 'Place Name', rating: 4 },
    { id: 3, name: 'Place Name', rating: 3 }
  ]);

  //delete func, for the trash button
  const handleDelete = (id) => {
    setFavorites(favorites.filter(place => place.id !== id));
  };

  return (
    <div className="profile-container">
       {/* User info section with placeholder person -  name/email */}
      <div className="user-info">
        <div className="user-container">
          <div className="user">
            <div className="user-head"></div>
            <div className="user-body"></div>
          </div>
        </div>
        <div>
          <div className="username">Username</div>
          <div className="user-email">visitor@ucr.edu</div>
        </div>
      </div>
     {/*Tab buttons: 3 tabs: favorites/reviews and the account settings*/}
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
        </div>
      </div>
        {/* Favorites, only shown if the favorites is the active tab*/}
      {activeTab === 'favorites' && (
        <div className="favorites-list">
          {/* Render each fav place */}
          {favorites.map((place) => (
            <div key={place.id} className="favorite-item">
                {/* add icon, name, and star rating */}
              <div className="place-info">
                <div className="place-icon">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <div className="place-name">{place.name}</div>
                   {/* Display star rating*/}
                  <div className="stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="star">
                        {i < place.rating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Delete button to remove the place from favorites */}
              <button onClick={() => handleDelete(place.id)} className="delete-button">
                <Trash color="#B91C1C" size={24} />
              </button>
            </div>
          ))}
        </div>
      )}
       {/* Same thing we did for favorites:  Reviews content, only shown if reviews tab is the active one*/}
      {activeTab === 'reviews' && (
        <div className="reviews-placeholder">
          Your reviews will appear here
        </div>
      )}
    </div>
  );
};

export default CollegeCompassDash;
