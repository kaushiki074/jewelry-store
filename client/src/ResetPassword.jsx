import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./ResetPassword.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/users/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to reset password.");
        return;
      }

      setMessage("Password reset successfully!");

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      console.log("Reset password error:", error);
      setError("Unable to connect to server.");
    }
  };

  return (
    <div className="reset-password-page">

      <div className="reset-password-card">

        <div className="reset-password-header">
          <h1>Reset Password</h1>

          <p>
            Create a new password for your jewelry store account.
          </p>
        </div>

        <form
          className="reset-password-form"
          onSubmit={handleResetPassword}
        >

          <div className="form-group">
            <label htmlFor="password">
              New Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm New Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="reset-password-button"
          >
            Reset Password
          </button>

        </form>

        {message && (
          <p className="reset-success">
            {message}
          </p>
        )}

        {error && (
          <p className="reset-error">
            {error}
          </p>
        )}

        <Link
          to="/login"
          className="back-login"
        >
          ← Back to Login
        </Link>

      </div>

    </div>
  );
}

export default ResetPassword;