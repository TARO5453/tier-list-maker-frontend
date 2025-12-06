import React, {createContext, useState, useContext, useEffect} from "react";

// Singleton context object for sharing authentication data
const authContext = createContext();

// For accessing authen data in the components
export function useAuth() {
    return useContext(authContext);
}

// Provides authentication data to all children components
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  // Prevents UI from rendering before checking the data from localStorage
  const [loading, setLoading] = useState(true);
  // Check user data from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
      setCurrentUser({ username });
    }
    setLoading(false);
    },
     []);
  // Save username and placeholder for token.
  const login = (username) => {
    localStorage.setItem('token', 'authenticated');
    localStorage.setItem('username', username);
    setCurrentUser({ username }); // Update username for UI
  };
  // Clear user auth data
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setCurrentUser(null);
  };
  // Object for passing to all the components
  const value = {
    currentUser,
    login,
    logout,
    loading
  };
  // Make the value available to any component that uses AuthProvider wrapper
  return (
    <authContext.Provider value={value}>
      {children}
    </authContext.Provider>
  );
}