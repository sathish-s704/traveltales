

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Footer from "../Footer";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // State to handle errors
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token); // Store token in localStorage
        alert("User logged in successfully!");
        navigate("/");
      } else {
        setError(response.data.message); // Show backend error messages
      }
    } catch (error) {
      console.error("Login error:", error.response ? error.response.data : error.message);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <div className="forgot-password-link">
          <a href="/reset-password">Forgot Password?</a>
        </div>
        <button type="submit">Login</button>
        <div className="login-link">
          Don't have an account? <a href="/register">Register here</a>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default Login;
