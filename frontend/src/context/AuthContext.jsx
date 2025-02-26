import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    const saveToken = (newToken) => {
        setToken(newToken);
        localStorage.setItem("token", newToken);
    };

    return (
        <AuthContext.Provider value={{ token, setToken: saveToken }}>
            {children}
        </AuthContext.Provider>
    );
};
