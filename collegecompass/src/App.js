import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import SearchSchool from "./pages/searchSchool";
import Login from "./pages/Login"; // if it exists
import SchoolData from "./Data.json"; // if it exists

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<SearchSchool placeholder="Find a school..." data={SchoolData} />}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
