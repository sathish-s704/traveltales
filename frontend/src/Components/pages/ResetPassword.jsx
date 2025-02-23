import { useState } from "react";
import axios from "axios";
import "./ResetPassword.css";
import Header from "../Header";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Send OTP, Step 2: Reset Password

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:3000/api/auth/reset-otp", { email });
      if (data.success) {
        alert("OTP sent to your email");
        setStep(2); // Move to next step
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:3000/api/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      if (data.success) {
        alert("Password has been reset successfully!");
        window.location.href = "/login"; // Redirect to login
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="reset-container">
      <Header/>
      <div className="reset-form">
        <h2>Reset Password</h2>
        
        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit">Reset Password</button>
          </form>
        )}

        <p className="login-link">
          Remembered your password? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
