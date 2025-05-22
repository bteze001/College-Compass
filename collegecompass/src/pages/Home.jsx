import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to College Compass</h1>
      <button onClick={() => navigate("/login?register=true")}>
        Register
      </button>
      <br /><br />
      <button onClick={() => navigate("/login")}>
        Login
      </button>
    </div>
  );
}
