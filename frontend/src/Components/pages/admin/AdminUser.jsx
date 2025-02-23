import React, { useEffect, useState, useContext } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../../../api/api";
import { AuthContext } from "../../../context/AuthContext";
import "./AdminUser.css";

const AdminUsers = () => {
    const { token } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ fullName: "", email: "", password: "" });
    const [editUser, setEditUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const response = await getUsers(token);
        if (response.success) setUsers(response.users);
    };

    const handleCreateUser = async () => {
        const response = await createUser(newUser, token);
        if (response.success) {
            fetchUsers();
            setNewUser({ fullName: "", email: "", password: "" });
        }
    };

    const handleUpdateUser = async (id) => {
        const response = await updateUser(id, editUser, token);
        if (response.success) {
            fetchUsers();
            setEditUser(null);
        }
    };

    const handleDelete = async (id) => {
        await deleteUser(id, token);
        fetchUsers();
    };

    return (
        
        <div className="admin-container">
           <h2>User Management</h2>
            <div className="user-form">
                <input type="text" placeholder="Full Name" value={newUser.fullName} onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })} />
                <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                <input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                <button onClick={handleCreateUser} className="create-btn">Create User</button>
            </div>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{editUser?._id === user._id ? <input type="text" value={editUser.fullName} onChange={(e) => setEditUser({ ...editUser, fullName: e.target.value })} /> : user.fullName}</td>
                            <td>{editUser?._id === user._id ? <input type="email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} /> : user.email}</td>
                            <td>
                                {editUser?._id === user._id ? (
                                    <button onClick={() => handleUpdateUser(user._id)} className="update-btn">Save</button>
                                ) : (
                                    <button onClick={() => setEditUser(user)} className="update-btn">Update</button>
                                )}
                                <button onClick={() => handleDelete(user._id)} className="delete-btn">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;
