import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';
import coffeeShops from '../assets/coffee_shop.webp';
import compass from '../assets/compass.png';
import locationIcon from '../assets/location_on.png';
import coffeeShop from '../assets/coffee_shop_inside.jpg';
import pizzaPlace from '../assets/pizza_place.jpg';
import breakfastSpot from '../assets/breakfast_spot.jpg';
import ucrCampus from '../assets/ucr_campus.png'
import './Homepage.css';
import { Slider } from '@mui/material';

export default function Homepage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [distance, setDistance] = useState(10);
  const [budget, setBudget] = useState(25);
  const [showFilters, setshowFilters] = useState(false);
  const [foodPlaces, setFoodPlaces] = useState([]);
  const [housingPlaces, setHousingPlaces] = useState([]);
  const [activityPlaces, setActivityPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');
  const cacheRef = useRef({});


  // Store the places fetched from API into the cache 
  useEffect(() => {

    try {
      const storedCache = localStorage.getItem('placesCache');
      if (storedCache) {
        const parsedCache = JSON.parse(storedCache);
        cacheRef.current = parsedCache;
      }
    }
    catch (error) {
      console.error("Error loading cache from localStorage:", error);
    }
  }, []);

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

  const toggleFilters = () => {
    setshowFilters(!showFilters);
  };

  const filterRestaurants = () => {
    setShowRestaurants(!showResturants)
  }

  const filterFastFoods = () => {
    setShowFastFoods(!showFastFoods)
  }

  const fetchHousing = useCallback(async () => {

    setCategory('housing');
    setIsLoading(true);
    setError(null);

    const cacheKey = `housing-${query || 'all'}-${distance}-${budget}`;

    if (cacheRef.current[cacheKey]) {
      console.log("Loaded places from cache");
      setHousingPlaces(cacheRef.current[cacheKey]);
      setIsLoading(false);
      return;
    }

    try {
      console.log("Fetching from API...");
      const response = await axios.get('https://api.foursquare.com/v3/places/search', {
        headers: {
          Accept: 'application/json',
          Authorization: `${import.meta.env.VITE_API_KEY}`,
        },

        params: {
          ll: '33.9741,-117.3281',
          query: query || '',
          categories: '12035,12094,12122',
          radius: distance * 1609,
          limit: 40,
          fields: 'fsq_id,name,location,categories,geocodes,photos',
        },
      });

      const places = response.data.results;

      cacheRef.current[cacheKey] = places;

      try {
        localStorage.setItem('placesCache', JSON.stringify(cacheRef.current));
      }
      catch (error) {
        console.error("Error saving to localstorage", error);
      }

      setHousingPlaces(places);

    }

    catch (error) {
      console.error("Error fetching housing places:", error);
      setError(error?.response?.data?.message || "Failed to fetch places");

      if (error.response?.status === 401) {
        setError("API key authentication failed. Please check your credentials.");
      } else if (!navigator.onLine) {
        setError("You appear to be offline. Please check your internet connection.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [query, distance, budget]);

  const fetchActivities = useCallback(async () => {

    setCategory('activity');
    setIsLoading(true);
    setError(null);

    const cacheKey = `activity-${query || 'all'}-${distance}-${budget}`;

    // Check if the places are stored in the cache before fetching from API
    if (cacheRef.current[cacheKey]) {
      console.log("Loaded places from cache");
      setActivityPlaces(cacheRef.current[cacheKey]);
      setIsLoading(false);
      return;
    }

    try {
      console.log("Fetching from API...");
      const response = await axios.get('https://api.foursquare.com/v3/places/search', {
        headers: {
          Accept: 'application/json',
          Authorization: `${import.meta.env.VITE_API_KEY}`,
        },

        params: {
          ll: '33.9741,-117.3281',
          query: query || '',
          categories: '10001,10003,10006,10004,10015,10017,10023,10024,10027,10054,10055,10061,14000,16003,16004,16005,16019,16032',
          radius: distance * 1609,
          limit: 50,
          fields: 'fsq_id,name,location,categories,geocodes,photos',
        },
      });

      const places = response.data.results;

      cacheRef.current[cacheKey] = places;

      try {
        localStorage.setItem('placesCache', JSON.stringify(cacheRef.current));
      }
      catch (error) {
        console.error("Error saving to localstorage", error);
      }

      setActivityPlaces(places);

    }

    catch (error) {
      console.error("Error fetching housing places:", error);
      setError(error?.response?.data?.message || "Failed to fetch places");

      if (error.response?.status === 401) {
        setError("API key authentication failed. Please check your credentials.");
      } else if (!navigator.onLine) {
        setError("You appear to be offline. Please check your internet connection.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [query, distance, budget]);


  const fetchFoodPlaces = useCallback(async () => {

    setCategory('food');
    setIsLoading(true);
    setError(null);

    const cacheKey = `${query || 'all'}-${distance}-${budget}`;

    //Check in-memeory cache 
    if (cacheRef.current[cacheKey]) {
      console.log("Loaded places from cache");
      setFoodPlaces(cacheRef.current[cacheKey]);
      setIsLoading(false);
      return;
    }

    try {
      console.log("Fetching from API...");
      const response = await axios.get('https://api.foursquare.com/v3/places/search', {
        headers: {
          Accept: 'application/json',
          Authorization: `${import.meta.env.VITE_API_KEY}`,
        },

        params: {
          ll: '33.9741,-117.3281',
          query: query || '',
          categories: '13000',
          radius: distance * 1609,
          limit: 40,
          fields: 'fsq_id,name,location,categories,geocodes,photos',
        },
      });

      const places = response.data.results;

      cacheRef.current[cacheKey] = places;

      try {
        localStorage.setItem('placesCache', JSON.stringify(cacheRef.current));
      }
      catch (error) {
        console.error("Error saving to localstorage", error);
      }

      setFoodPlaces(places);

    }

    catch (error) {
      console.error("Error fetching food places:", error);
      setError(error?.response?.data?.message || "Failed to fetch places");

      if (error.response?.status === 401) {
        setError("API key authentication failed. Please check your credentials.");
      } else if (!navigator.onLine) {
        setError("You appear to be offline. Please check your internet connection.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [query, distance, budget]);

  const clearCache = () => {
    cacheRef.current = {};
    localStorage.removeItem('placesCache');
    alert("Cache cleared successfully");
  };

  const printCache = () => {
    console.log("Current Cache Contents:");
    console.log(cacheRef.current);

    // Calculate the total number of cached places
    let totalPlaces = 0;
    Object.values(cacheRef.current).forEach(places => {
      totalPlaces += places.length;
    });

    console.log(`Total cached queries: ${Object.keys(cacheRef.current).length}`);
    console.log(`Total cached places: ${totalPlaces}`);

    // Alert the user so they know to check console
    alert(`Cache printed to console. ${Object.keys(cacheRef.current).length} queries cached with ${totalPlaces} total places.`);
  };

  const displayPlaces = () => {

    if (isLoading) {
      return <div className="loading">Loading places ...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }


    //Takes the place object and converts to a string and saves to localstorage
    const handlePlaceClick = (place) => {
      localStorage.setItem('selectedPlace', JSON.stringify(place));
      navigate(`/place/${place.fsq_id}`);
    };

    if (category === 'food' && foodPlaces.length > 0) {
      return foodPlaces.map((place) => (
        <div 
          key={place.fsq_id} 
          className="places-box"
          onClick={() => handlePlaceClick(place)}
          style={{ cursor: 'pointer' }} // Add pointer cursor
        >
          <h3>{place.name}</h3>
          <p>{place.location.address || "Address not available"}</p>
          {place.categories && place.categories[0] && (
            <p className="category-tag">{place.categories[0].name}</p>
          )}
        </div>
      ));
    }

    if (category === 'housing' && housingPlaces.length > 0) {
      return housingPlaces.map((place) => (
        <div 
          key={place.fsq_id} 
          className="places-box housing-box"
          onClick={() => handlePlaceClick(place)}
          style={{ cursor: 'pointer' }}
        >
          <h3>{place.name}</h3>
          <p>{place.location.address || "Address not available"}</p>
          {place.categories && place.categories[0] && (
            <p className="category-tag">{place.categories[0].name}</p>
          )}
        </div>
      ));
    }

    if (category === 'activity' && activityPlaces.length > 0) {
      return activityPlaces.map((place) => (
        <div 
          key={place.fsq_id} 
          className="places-box activity-box"
          onClick={() => handlePlaceClick(place)}
          style={{ cursor: 'pointer' }}
        >
          <h3>{place.name}</h3>
          <p>{place.location.address || "Address not available"}</p>
          {place.categories && place.categories[0] && (
            <p className="category-tag">{place.categories[0].name}</p>
          )}
        </div>
      ));
    }

    return <p>Click a category to see nearby places.</p>;

  }

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

          <button className="food-spots-button" onClick={fetchFoodPlaces}>
            Food
          </button>

          <button className="activities-button" onClick={fetchActivities}>
            Activites
          </button>

          <button className="housing-button" onClick={fetchHousing}>
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

      <div className="content">
        {showFilters && (
          <div className="sliders-container">
            <div className="distance-slider-container">
              <label htmlFor="distance" className="distance-label">
                Distance: {distance} miles
              </label>

              <Slider
                id="distance"
                value={distance}
                onChange={handleDistanceChange}
                min={1}
                max={10}
                step={1}
                valueLabelDisplay="auto"
                className="slider"
              />

              <div className="slider-range-labels">
                <span>1 mi</span>
                <span>10 mi</span>
              </div>
            </div>

            <div className="budget-slider-container">
              <label htmlFor="budget" className="budget-label">
                Budget: ${budget}
              </label>

              <Slider
                id="distance"
                value={budget}
                onChange={handleBudgetChange}
                min={1}
                max={100}
                step={1}
                valueLabelDisplay="auto"
                className="slider"
              />

              <div className="slider-range-labels">
                <span>$1</span>
                <span>$100+</span>
              </div>
            </div>

          </div>
        )}

       <div className="places-container">
          {displayPlaces()}
        </div>

      </div>
    </>
  );
}


