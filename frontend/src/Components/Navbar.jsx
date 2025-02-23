import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import logo from "../assets/logo.png"; 

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/api/user/data", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        if (response.data.success) {
          setUser(response.data.userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.response ? error.response.data : error.message);
    }
  };

  const handleAdminClick = () => {
    navigate("/admin/signin"); // Navigate to Admin Sign-in page
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" className="logo-img" />
          Travel Tales
        </Link>
      </div>
      
      <div className="nav-links">
        {/* Admin Button (Visible for Everyone) */}
        <button onClick={handleAdminClick} className="admin-button">
          Admin
        </button>

        {user ? (
          <div className="user-menu">
            <button className="user-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu">
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
