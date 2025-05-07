// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CollegeCompassDash from './pages/UserDashboard';
import MyNewPage from './pages/MyNewPage'; // <-- your new page

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Dashboard */}
        <Route path="/" element={<CollegeCompassDash />} />

        {/* New Page */}
        <Route path="/my-new-page" element={<MyNewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
