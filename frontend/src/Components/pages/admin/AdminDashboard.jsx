import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Sidebar from "../../Sidebar";

const AdminDashboard = () => {
    const { token, logout } = useContext(AuthContext);

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-6">
                <h1 className="text-3xl">Welcome, Admin</h1>
                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 mt-4">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
