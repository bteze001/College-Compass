// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CollegeCompassDash from './pages/UserDashboard';
import EditProfile from './pages/EditProfile';


function App() {
  return (
    <Router>
      <Routes>
        {/* Default Dashboard */}
        <Route path="/" element={<CollegeCompassDash />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
