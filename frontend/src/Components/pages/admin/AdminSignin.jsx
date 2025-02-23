import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from "../../../context/AuthContext";
import { adminSignin } from "../../../api/api"; // Import API function
import "./AdminSignin.css";
import Header from "../../Header";

const AdminSignin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await adminSignin(email, password); // Use API function

        if (response.success) {
            Cookies.set("token", response.token, { expires: 7, secure: true, sameSite: "Strict" });
            setToken(response.token);
            alert("Login successful!");
            navigate("/admin/dashboard");
        } else {
            alert(response.message);
        }
    };

    return (
        <div className="login-container">
            <Header />
            <div className="login-form">
                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default AdminSignin;
