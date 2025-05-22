// import './App.css';
// import Landing from './pages/landing';

// function App() {
//   return (
//     <div className="App">
//       <Landing/>
//     </div>
//   );
// }

// export default App;

// import './App.css';
// import Login from './pages/Login';

// function App() {
//   return (
//     <div className="App">
//       <Login />
//     </div>
//   );
// }

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home'; // ⬅️ You’ll create this next

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />         {/* Home page */}
          <Route path="/login" element={<Login />} />   {/* Login/Register page */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
