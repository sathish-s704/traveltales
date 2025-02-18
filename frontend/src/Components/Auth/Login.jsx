import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      alert("User logged in successfully!");
      // navigate("/dashboard");
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input type="email" name="email" placeholder="Email" required onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        <input type="password" name="password" placeholder="Password" required onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        <button type="submit">Login</button>
        <div className="login-link">
          Don't have an account? <a href="/register">Register here</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
