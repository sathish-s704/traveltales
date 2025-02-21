


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
    
      if (!token) {
        console.warn("No token found");
        setUser(null);
        return;
      }
    
      try {
        const response = await axios.get("http://localhost:3000/api/user/data", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
    
        console.log("API Response:", response.data); // Debugging
    
        if (response.data.success && response.data.userData) {
          setUser(response.data.userData);
        } else {
          console.error("Failed to fetch user data:", response.data.message);
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      }
    };

    fetchUserData();
  }, []);


  const handleLogout = async () => {
    await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    setUser(null);
    navigate("/");
  };

  
const handleVerifyEmail = async () => {
  console.log("User state:", user); // Debugging
  if (!user || !user._id) {
    console.error("User ID is missing!", user);
    alert("User ID is missing!");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:3000/api/auth/sent-verify-otp",
      { userId: user._id },
      { withCredentials: true }
    );

    if (response.data.success) {
      alert("OTP sent to your email!");
      navigate("/verify-email");
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
    alert("Failed to send OTP.");
  }
};

  
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Travel Tales</Link>
      </div>
      <div className="nav-links">
        {user ? (
          <div className="user-menu">
            <button className="user-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {!user.isAccountVerified && (
                  <button onClick={handleVerifyEmail} className="verify-email-btn">
                    Verify Email
                  </button>
                )}
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="login-button">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

