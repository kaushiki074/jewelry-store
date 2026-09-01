import { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3000/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      setMessage("Signup successful! You can now login.");

      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {
      console.log("Signup error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signup-page">

      <div className="signup-card">

        <div className="signup-header">
          <h1>Create Account</h1>

          <p>
            Create your jewelry store account
          </p>
        </div>


        <form
          className="signup-form"
          onSubmit={handleSignup}
        >

          <div className="signup-form-group">

            <label htmlFor="signup-name">
              Name
            </label>

            <input
              id="signup-name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

          </div>


          <div className="signup-form-group">

            <label htmlFor="signup-email">
              Email
            </label>

            <input
              id="signup-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>


          <div className="signup-form-group">

            <label htmlFor="signup-password">
              Password
            </label>

            <input
              id="signup-password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

          </div>


          <button
            type="submit"
            className="signup-button"
          >
            Create Account
          </button>

        </form>


        {message && (
          <p className="signup-message">
            {message}
          </p>
        )}


        {error && (
          <p className="signup-error">
            {error}
          </p>
        )}


        <div className="login-link">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Signup;