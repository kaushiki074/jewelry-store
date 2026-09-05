import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setResetToken("");

    try {
      const response = await fetch(
        "http://localhost:3000/users/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setMessage(data.message);
      setResetToken(data.resetToken);
    } catch (error) {
      console.log(error);
      setError("Unable to connect to the server");
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">

        <h1>Forgot Password?</h1>

        <p>
          Enter your email address and we'll help you reset your password.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">
            Reset Password
          </button>

        </form>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {resetToken && (
          <div className="reset-token-box">
            <p>Your reset token:</p>

            <code>{resetToken}</code>

            <Link
              to={`/reset-password/${resetToken}`}
              className="reset-link"
            >
              Continue to Reset Password
            </Link>
          </div>
        )}

        <Link to="/login" className="back-login">
          ← Back to Login
        </Link>

      </div>
    </div>
  );
}

export default ForgotPassword;