import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMessage("User not authenticated. Please log in again.");
    }
  }, []);

  const handleVerify = async () => {
    setLoading(true);
    setMessage("");

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setMessage("User not authenticated. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      console.log("🔹 Sending request with:", { userId, otp });

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
        setMessage("🎉 Email verified successfully!");
        localStorage.setItem("isAccountVerified", "true"); // Update verification status
        setTimeout(() => navigate("/"), 2000); // Redirect after 2s
      } else {
        setMessage(response.data.message || "Verification failed.");
      }
    } catch (error) {
      console.error("🚨 Verification Error:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Email Verification</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerify} disabled={loading}>
        {loading ? "Verifying..." : "Verify Email"}
      </button>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;
