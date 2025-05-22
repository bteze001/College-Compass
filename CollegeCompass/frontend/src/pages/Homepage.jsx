import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import usePlacesFetcher from '../../../backend/places';
import FilterSliders from './FilterSliders';
import PlacesList from './PlacesList';
import SearchFilter from '../../../backend/SearchFilter';
import logo from '../assets/logo.png';
import compass from '../assets/compass.png';
import './Homepage.css';

export default function Homepage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [distance, setDistance] = useState(10);
  const [budget, setBudget] = useState(100);
  const [showFilters, setshowFilters] = useState(false);
  const [category, setCategory] = useState('');
  const [foodType, setFoodType] = useState('all');
  const [housingType, setHousingType] = useState('all');
  const [activityType, setActivityType] = useState('all');
  const [foodPlaces, setFoodPlaces] = useState([]);
  const [housingPlaces, setHousingPlaces] = useState([]);
  const [activityPlaces, setActivityPlaces] = useState([]);

  // Get coordinates from the landing page, if it fails use UCR as default 
  const { lat: passedLat, lng: passedLon, schoolName } = location.state || {};
  const defaultLat = 33.97372;
  const defaultLon = -117.32807;

  const currentLat = passedLat ?? defaultLat;
  const currentLon = passedLon ?? defaultLon;

  const { fetchPlaces, isLoading, error } = usePlacesFetcher({ currentLat, currentLon });

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleDistanceChange = (e, value) => {
    setDistance(value);
  };
    
  const handleBudgetChange = (e, value) => {
    setBudget(value);
  };

  const toggleFilters = () => setshowFilters(!showFilters);

  const handleFoodFetch = async () => {
    setCategory('food');
    const {data, fromCache} = await fetchPlaces('food', query, distance, budget, foodType);
    console.log(`Food Places Loaded from ${fromCache ? 'cache' :  'API'}`);
    setFoodPlaces(data);
  };

  const handleHousingFetch = async () => {
    setCategory("housing");
    const {data, fromCache} = await fetchPlaces('housing', query, distance, budget, housingType);
    console.log(`Housing Places Loaded from ${fromCache ? 'cache' :  'API'}`);
    setHousingPlaces(data);
  };

  const handleActivityFetch = async () => {
    setCategory('activity');
    const {data, fromCache} = await fetchPlaces('activity', query, distance, budget, activityType);
    console.log(`Activity Places Loaded from ${fromCache ? 'cache' :  'API'}`);
    setActivityPlaces(data);
  };

  return (
    <>
      <div className="fixed-header">
        <img src={logo} alt="collegeCompass" className="logo" />
        <button className="login-button" onClick={() => navigate('/login')}>
          Log In
        </button>
        <button className="sign-up-button" onClick={() => navigate('/signup')}>
          Sign Up
        </button>
        <button className="dashboard-button" onClick={() => navigate('/dashboard')}>
          Dashboard
        </button>

        <div className="category-buttons">
          <button className="food-spots-button" onClick={handleFoodFetch}>
            Food
          </button>
          <button className="activities-button" onClick={handleActivityFetch}>
            Activites
          </button>
          <button className="housing-button" onClick={handleHousingFetch}>
            Housing
          </button>
        </div>

        <div className="search-bar-wrapper">
          <img src={compass} alt="Search Icon" className="search-icon" />
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="search-input"
            placeholder="Search..."
          />
        </div>

        <button className="filter-button" onClick={toggleFilters}>
          {showFilters ? "Hide Filters" : "Filter"}
        </button>
      </div>

      <div className='content'> 
        {showFilters && (
          <FilterSliders
            distance={distance}
            budget={budget}
            onDistanceChange={handleDistanceChange}
            onBudgetChange={handleBudgetChange}
            selectedCategory={category}
            selectedFoodType={foodType}
            onFoodTypeSelect={setFoodType}
            selectedHousingType={housingType}
            onHousingTypeSelect={setHousingType}
            selectedActivityType={activityType}
            onActivityTypeSelect={setActivityType}
          />
        )}

        {isLoading && <div className='loading'> Loading Places ... </div>}
        {error && <div className='error-message'>{error}</div>}

        <div className='places-container'>
          <PlacesList
            category={category}
            foodPlaces={foodPlaces}
            housingPlaces={housingPlaces}
            activityPlaces={activityPlaces}
            currentLat={currentLat}
            currentLon={currentLon}
            distance={distance}
            budget={budget}
            SearchFilter={SearchFilter}
            selectedFoodType={foodType}
            selectedHousingType={housingType}
            selectedActivityType={activityType}
          />
        </div>
    </div>
    </>
  );
}

