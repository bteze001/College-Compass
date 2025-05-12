import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
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

        <button className="food-spots-button" onClick={() => navigate('/food')}>
          Food 
        </button>

        <button className="activities-button" onClick={() => navigate('/activities')}>
          Activites
        </button>

        <button className="housing-button" onClick={() => navigate('/housing')}>
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

      <button className="filter-button" onClick={() => navigate('/filter')}>
          Filter
      </button>

    </div>
      
      <div className="content">
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
        

        <div className="places-container">

          <div className="places-box">
            <button className="places-button" onClick={() => navigate('/coffeeshop')}>
              <img src={coffeeShop} className="places-button-icon" />
              <span className="places-button-text">Coffee Shop</span>
            </button>

            <button className="places-location-button" onClick={() => navigate('coffeeshop/location')}>
              <span className="location-button-text">Location</span>
            </button>
          </div>

          <div className="places-box">
            <button className="places-button" onClick={() => navigate('/pizzaplace')}>
              <img src={pizzaPlace} className="places-button-icon" />
              <span className="places-button-text">Pizza Place</span>
            </button>

            <button className="places-location-button" onClick={() => navigate('pizzaplace/location')}>
              <span className="location-button-text">Location</span>
            </button>
          </div>

          <div className="places-box">
              <button className="places-button" onClick={() => navigate('/breakfastspot')}>
                <img src={breakfastSpot} className="places-button-icon" />
                <span className="places-button-text">Breakfast Spot</span>
              </button>

              <button className="places-location-button" onClick={() => navigate('breakfastspot/location')}>
                <span className="location-button-text">Location</span>
              </button>     
          </div>

        </div>

      </div>
    </>
  );
}


