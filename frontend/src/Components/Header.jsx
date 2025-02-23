import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"; 
import logo from "../assets/logo.png"; 

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" className="logo-img" /> {/* Add Logo Here */}
          Travel Tales
        </Link>
      </div>
    </header>
  );
};

export default Header;
