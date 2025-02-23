import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";  // Import Sidebar CSS

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Admin Panel</h2>
            <ul>
                <li>
                    <Link to="/admin/manage-users">Manage Users</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
