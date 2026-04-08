import { createContext, useContext, useState } from 'react';

// 1. Create the Auth Context (the container for our data)
const AuthContext = createContext();
/**
 * Helper function to parse the user role from a JWT token.
 * Extracted outside the component to keep things clean.
 */
const getRoleFromToken = (token) => {
    try {
        // Decode the JWT payload (the middle part) and parse it into a JSON object
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload.role || null;
    } catch (error) {
        console.error("Failed to parse role from token:", error);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [role, setRole] = useState(() => {
        const savedToken = localStorage.getItem('token');
        return savedToken ? getRoleFromToken(savedToken) : null;
    });

    // 🔐 Login function
    const login = (newToken) => {
        setToken(newToken);
        setRole(getRoleFromToken(newToken));
        localStorage.setItem('token', newToken); // Persistent storage in the browser
    };

    // 🚪 Logout function
    const logout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem('token'); // Cleanup storage
    };

    // ✅ Helper flags for easy checks in your UI components
    const isAuthenticated = !!token; // true if token exists, false if null
    const isAdmin = role?.toLowerCase() === 'admin';

    return (
        <AuthContext.Provider 
            value={{ token, role, login, logout, isAuthenticated, isAdmin }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// 2. Custom hook to easily access auth state anywhere in the app
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider!");
    }
    return context;
};