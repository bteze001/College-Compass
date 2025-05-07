import React, { useState } from 'react';
import { Trash } from 'lucide-react';
import './UserDashboard.css';
import AccountSettings from './AccountSettings';

const CollegeCompassDash = () => {
  const [activeTab, setActiveTab] = useState('favorites');

  const [favorites, setFavorites] = useState([
    { id: 1, name: 'Place Name', rating: 3 },
    { id: 2, name: 'Place Name', rating: 4 },
    { id: 3, name: 'Place Name', rating: 3 }
  ]);

  const handleDelete = (id) => {
    setFavorites(favorites.filter(place => place.id !== id));
  };

  return (
    <div className="profile-container">

      {/* Logo and Edit Profile button */}
      <div className="dashboard-header">
        <img src="/college-compasslogo.png" alt="College Compass Logo" className="dashboard-logo" />
        <button className="edit-profile-button">Edit Profile</button>
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
            <div className="username">Username</div>
            <div className="user-email">visitor@ucr.edu</div>
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
            <div key={place.id} className="favorite-item">
              <div className="place-info">
                <div className="place-icon">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <div className="place-name">{place.name}</div>
                  <div className="stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="star">
                        {i < place.rating ? '★' : '☆'}
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
        <div className="reviews-placeholder">
          Your reviews will appear here
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
