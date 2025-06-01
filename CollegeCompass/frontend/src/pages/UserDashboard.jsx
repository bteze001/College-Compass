import React, { useState, useEffect } from 'react';
import { Trash, Home, Utensils, MapPin } from 'lucide-react';
import { db, auth } from '../firebase';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import './UserDashboard.css';
import AccountSettings from './AccountSettings';
import useCurrentUser from './useCurrentUser';
import logo from '../assets/logo.png';

const CollegeCompassDash = () => {
  const [activeTab, setActiveTab] = useState('favorites');

  // const [favorites, setFavorites] = useState([
  //   { id: 1, name: 'Place Name', rating: 3 },
  //   { id: 2, name: 'Place Name', rating: 4 },
  //   { id: 3, name: 'Place Name', rating: 3 }
  // ]);

  const [favorites, setFavorites] = useState([]);
  const { user, username } = useCurrentUser();

  useEffect(() => {

    const fetchFavorites = async () => {

      if (!user) return;

      const snapshot = await getDocs(collection(db, 'favorites', user.uid, 'places'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('Fetched favorites:', data);
      setFavorites(data);
    };

    fetchFavorites();
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
  


  // const handleDelete = (id) => {
  //   setFavorites(favorites.filter(place => place.id !== id));
  // };

  const handleDelete = async (fsqId) => {

    if (!user) return;

    await deleteDoc(doc(db, 'favorites', user.uid, 'places', fsqId));
    setFavorites(prev => prev.filter(place => place.id !== fsqId));
  };

  return (
    <div className="profile-container">

      {/* Logo and Edit Profile button */}
      <div className="dashboard-header">
        <img src={logo} alt="College Compass Logo" className="dashboard-logo" />
        {/* <Link to="/edit-profile">
          <button className="edit-profile-button">Edit Profile</button>
        </Link> */}
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
            <div key={place.id} className="favorite-item">
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
                        {i < Math.floor((place.rating || 0) / 2) ? '★' : '☆'}
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
