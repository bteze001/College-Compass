import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Dashboard from './pages/UserDashboard';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import PlaceDetail from './pages/PlaceDetail';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/place/:placeId" element={<PlaceDetail />} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}
