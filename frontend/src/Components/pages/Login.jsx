

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Header from "../Header";


const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // State to handle errors
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData,
        { withCredentials: true } // Ensure cookies are included
      );
  
      console.log("Login API Response:", response.data);
  
      if (response.data.success && response.data.token) {
        console.log("Storing Token:", response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userData._id); // Store userId
  
        alert("User logged in successfully!");
        navigate("/");
      } else {
        setError(response.data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError("An error occurred. Please try again.");
    }
  };
  

  return (

    <div className="login-container">
      <Header/>
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
   
    </div>
  );
};

export default Login;