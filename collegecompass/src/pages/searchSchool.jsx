import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./searchSchool.css";
import ExploreIcon from "@mui/icons-material/Explore";
import logo from "../assets/logo.png";

function SearchSchool({ placeholder, data }) {
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    const newFilter = data.filter(
      (value) =>
        value.fullName.toLowerCase().includes(searchWord.toLowerCase()) ||
        value.name.toLowerCase().includes(searchWord.toLowerCase())
    );
    setFilteredData(newFilter);
  };

  return (
    <div className="landingPage">
      {/* Top Bar with Auth Buttons */}
      <div className="topBar">
        <div></div>
        <div className="authButtons">
          <button className="authBtn" onClick={() => navigate("/login")}>
            Log In
          </button>
          <button
            className="authBtn dark"
            onClick={() => navigate("/login?register=true")}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Center Content */}
      <div className="centerContent">
        <img src={logo} alt="College Compass Logo" className="logoLarge" />

        <div className="searchPanel">
          <p className="instruction">
            Enter a <span className="boldWord">school</span> to explore
          </p>

          <div className="searchInputs">
            <div className="searchSchoolIcon">
              <ExploreIcon />
            </div>
            <input
              type="text"
              placeholder={placeholder}
              onChange={handleFilter}
            />
          </div>

          {filteredData.length !== 0 && (
            <div className="schoolSelection">
              {filteredData.map((value, key) => (
                <a
                  className="schoolData"
                  href={`https://www.google.com/maps?q=${value.latitude},${value.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={key}
                >
                  <p>{value.fullName}</p>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchSchool;
