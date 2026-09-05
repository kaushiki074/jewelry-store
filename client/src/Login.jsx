import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      localStorage.setItem("token", data.token);

      setMessage("Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      console.log("Login error:", error);
      setError("Unable to connect to server.");
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">
          <h1>Welcome Back</h1>

          <p>
            Sign in to your jewelry store account
          </p>
        </div>


        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <div className="form-group">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>


          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="forgot-password-container">
            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>


        {message && (
          <p className="login-message">
            {message}
          </p>
        )}

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}


        <div className="signup-link">
          <span>
            Don't have an account?
          </span>

          <Link to="/signup">
            Signup
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Login;