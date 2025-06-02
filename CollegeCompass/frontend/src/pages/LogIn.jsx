import React, { useRef, useState, useEffect } from "react";
import { auth } from "../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInAnonymously,
} from "firebase/auth";
import logo from '../assets/logo_1.png';
import "./Login.css";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const usernameRef = useRef();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Automatically switch to register form if ?register=true is in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const isRegister = params.get("register") === "true";
    const success = params.get("registerSuccess") === "true";
    setIsRegistering(isRegister);
    setRegisterSuccess(success);
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      if (isRegistering) {
        const confirmPassword = confirmPasswordRef.current.value;
        const username = usernameRef.current.value;

        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username });

        setError("");
        setIsRegistering(false);
        navigate('/login?registerSuccess=true');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setError("");
        navigate('/homepage', {state: location.state});
      }
    } catch (err) {
      if (!isRegistering && err.code === "auth/invalid-credential") {
        setError("Invalid Login. Please try again.");
      } else {
        setError(err.message);
      }
    }
  };

  const handleGuestLogin = async () => {
    try {
      //await signInAnonymously(auth);
      setError("");
      navigate('/homepage', {state: location.state});
    } catch (err) {
      setError(err.message);
    }
  };


  const emptyForm = () => {
    if (emailRef.current) {
      emailRef.current.value = "";
    }

    if (passwordRef.current) {
      passwordRef.current.value = "";
    }

    if (confirmPasswordRef.current) {
      confirmPasswordRef.current.value = "";
    }

    if (usernameRef.current) {
      usernameRef.current.value = "";
    }
  };

  return (
    <div className="loginBox">
      <img src={logo} alt="Logo" className="CCImage" />
      <form onSubmit={handleSubmit} className="loginForm">
        <h2>{isRegistering ? "Register" : "Login"}</h2>

        {isRegistering && (
          <>
            <label htmlFor="username">Username</label>
            <input id='username' type="text" ref={usernameRef} required />
          </>
        )}

        <label htmlFor="email">School Email</label>
        <input id="email" type="email" ref={emailRef} required />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" ref={passwordRef} required />

        {isRegistering && (
          <>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" ref={confirmPasswordRef} required />
          </>
        )}

        <button type="submit">{isRegistering ? "Register" : "Login"}</button>

        {error && <p className="SentError">{error}</p>}
      </form>

      <div className="Reg/Guest">
        {!isRegistering && (
          <button
            className="guestButton"
            onClick={(e) => {
              e.preventDefault();
              handleGuestLogin();
            }}
          >
            Continue as Guest
          </button>
        )}
        <button
          className="regButton"
          onClick={(e) => {
            e.preventDefault();
            setIsRegistering((prev) => {
              const next = !prev;
              setTimeout(() => {
                emptyForm();
              }, 0);
              return next;
            });
            setError("");
          }}
        >
          {isRegistering ? "Already have an account? Login" : "New user? Register"}
        </button>
      </div>
    </div>
  );
}