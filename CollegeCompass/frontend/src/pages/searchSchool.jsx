import React, { useState } from "react";
import "./searchSchool.css";
import ExploreIcon from "@mui/icons-material/Explore";
import logo from "../assets/logo_1.png" // adjust path to your logo
import { useNavigate } from "react-router-dom";

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
      <div className="topBar">
        <div></div>
        <div className="authButtons">
          <button className="authBtn">Log In</button>
          <button className="authBtn dark">Sign Up</button>
        </div>
      </div>

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

          {/* {filteredData.length !== 0 && (
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
          )} */}

          {filteredData.length !== 0 && (
            <div className="schoolSelection">
              {filteredData.map((value, key) => {
                return (
                  <div
                    className="schoolData"
                    onClick={() => {
                      console.log(`Selected School: ${value.fullName}`);
                      console.log(`Latitude: ${value.latitude}, Longitude: ${value.longitude}`);


                      navigate("/homepage", {
                        state: {
                          schoolName: value.fullName,
                          lat: value.latitude,
                          lng: value.longitude,
                        },
                      });
                    }}
                    key={key}
                  >
                    <p>{value.fullName}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchSchool;
