import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await axios.post("http://localhost:3000/api/auth/reset-password", { token, newPassword });
      alert("Password reset successfully.");
      navigate("/login");
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="password" name="newPassword" placeholder="New Password" required onChange={(e) => setNewPassword(e.target.value)} />
      <input type="password" name="confirmPassword" placeholder="Confirm New Password" required onChange={(e) => setConfirmPassword(e.target.value)} />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPassword;