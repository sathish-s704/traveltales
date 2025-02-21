import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import Footer from "../Footer";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/auth/register", formData);
      alert("Registration successful.");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          required
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <div className="forgot-password-link">
          <a href="/reset-password">Forgot Password?</a>
        </div>
        <button type="submit">Register</button>
        <div className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default Register;
