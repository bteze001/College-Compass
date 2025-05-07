// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CollegeCompassDash from './pages/UserDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Dashboard */}
        <Route path="/" element={<CollegeCompassDash />} />
      </Routes>
    </Router>
  );
}

export default App;
