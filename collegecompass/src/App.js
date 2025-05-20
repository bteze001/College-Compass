import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SearchSchool from './pages/searchSchool'; // your landing page
import Login from './pages/Login';
import SchoolData from './Data.json';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<SearchSchool placeholder="Find a school..." data={SchoolData} />}
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
