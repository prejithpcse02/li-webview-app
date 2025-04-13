import React, { createContext, useContext, useState, useEffect } from "react";
import { TokenStorage } from "../services/tokenStorage";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        "https://backend-listtra.onrender.com/api/token/",
        { email, password }
      );

      const { access, refresh } = response.data;
      await TokenStorage.setTokens(access, refresh);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await TokenStorage.clearTokens();
    setIsAuthenticated(false);
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = await TokenStorage.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      const response = await axios.post(
        "https://backend-listtra.onrender.com/api/token/refresh/",
        { refresh: refreshToken }
      );

      if (response.data.access) {
        await TokenStorage.setTokens(response.data.access, refreshToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await TokenStorage.getAccessToken();
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
