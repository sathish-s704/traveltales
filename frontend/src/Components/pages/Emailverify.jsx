import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./VerifyEmail.css";
import Header from "../Header";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("token");
      console.log("Retrieved Token from localStorage:", token);

      if (!token) {
        setMessage("User not authenticated. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/is-auth",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        console.log("Auth API Response:", response.data);

        if (response.data.success) {
          setIsAuthenticated(true);
        } else {
          setMessage("Session expired. Redirecting to login...");
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error) {
        console.error("Authentication Error:", error.response?.data || error.message);
        setMessage("Session expired. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    checkAuthentication();
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!otp) {
      setMessage("Please enter OTP.");
      setLoading(false);
      return;
    }

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setMessage("Authentication error. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      console.log("🔄 Sending Request With:", { userId, otp });

      const response = await axios.post(
        "http://localhost:3000/api/auth/verify-email",
        { userId, otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("API Response:", response.data);

      if (response.data.success) {
        setMessage("Email verified successfully!");
        localStorage.setItem("isAccountVerified", "true");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(response.data.message || "Verification failed.");
      }
    } catch (error) {
      console.error(" Verification Error:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-email-container">
      <Header/>
      <h2>Email Verification</h2>
      {isAuthenticated ? (
        <form onSubmit={handleVerify}> {/* ✅ Form for OTP submission */}
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="otp-input"
          />
          <button type="submit" disabled={loading} className="verify-btn">
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      ) : (
        <p className="message">{message}</p>
      )}
    </div>
  );
};

export default VerifyEmail;
