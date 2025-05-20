import React, { useRef, useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile, signInAnonymously
} from "firebase/auth";
import "./Login.css";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const usernameRef = useRef();
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState("");

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
          
        } else {
          await signInWithEmailAndPassword(auth, email, password);
        }

        setError("");
      } catch (err) {
        if (!isRegistering && err.code === "auth/invalid-credential") {
          setError("Invalid Login. Please try again.");
        } else {
          setError(err.message);
        }
      }
    };

    const handleGuestLogin = async () => {
      try{
          await signInAnonymously(auth);
          setError("");
      } catch (err) {
          setError("");
      }
    };

    const emptyForm = () => {
      if (emailRef.current) {
          emailRef.current.value ="";
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
          <img src="im.png" alt="Logo" className="CCImage" />
          <form onSubmit={handleSubmit} className="loginForm">
              <h2>{isRegistering ? "Register" : "Login"}</h2>

              {isRegistering && (
              <>
                  <label>Username</label>
                  <input type="text" ref={usernameRef} required />
              </>
              )}

              <label>School Email</label>
              <input type="email" ref={emailRef} required />

              <label>Password</label>
              <input type="password" ref={passwordRef} required />

              {isRegistering && (
              <>
                  <label>Confirm Password</label>
                  <input type="password" ref={confirmPasswordRef} required />
              </>
              )}

              <button type="submit">
              {isRegistering ? "Register" : "Login"}
              </button>
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

