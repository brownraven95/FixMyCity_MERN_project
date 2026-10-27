import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfileApi, loginApi, registerApi, logoutApi } from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [citizen, setCitizen] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on app load (Lab 2 requirement: verify /citizens/me with cookies)
  const checkAuth = async () => {
    try {
      const response = await getProfileApi();
      if (response.data.success) {
        setCitizen(response.data.citizen);
      } else {
        setCitizen(null);
      }
    } catch (error) {
      setCitizen(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await loginApi(credentials);
    if (response.data.success) {
      if (response.data.token) {
        localStorage.setItem("fmc_token", response.data.token);
      }
      setCitizen(response.data.citizen);
      return response.data;
    }
  };

  const register = async (userData) => {
    const response = await registerApi(userData);
    if (response.data.success) {
      if (response.data.token) {
        localStorage.setItem("fmc_token", response.data.token);
      }
      setCitizen(response.data.citizen);
      return response.data;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      // Proceed with local logout regardless
    }
    localStorage.removeItem("fmc_token");
    setCitizen(null);
  };

  const updateCitizen = (updatedData) => {
    setCitizen((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        citizen,
        loading,
        isAuthenticated: !!citizen,
        login,
        register,
        logout,
        checkAuth,
        updateCitizen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
