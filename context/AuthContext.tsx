import React, { createContext, useContext, useState, useEffect } from "react";
import { TokenStorage } from "../services/tokenStorage";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  checkTokenValidity: () => Promise<boolean>;
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
        "https://backend-deployment-li-2.onrender.com/api/token/",
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

  // Check if the current access token is valid
  const checkTokenValidity = async (): Promise<boolean> => {
    try {
      const token = await TokenStorage.getAccessToken();
      if (!token) {
        return false;
      }

      // Make a simple request to check if the token is valid
      await axios.get(
        "https://backend-deployment-li-2.onrender.com/api/profile/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return true;
    } catch (error) {
      console.log("Token validation failed:", error);
      return false;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = await TokenStorage.getRefreshToken();
      if (!refreshToken) {
        console.log("No refresh token found");
        return false;
      }

      console.log(
        "Attempting to refresh token with refresh token:",
        refreshToken.substring(0, 10) + "..."
      );

      const response = await axios.post(
        "https://backend-deployment-li-2.onrender.com/api/token/refresh/",
        { refresh: refreshToken }
      );

      if (response.data.access) {
        console.log("Token refresh successful, new access token received");
        await TokenStorage.setTokens(response.data.access, refreshToken);
        return true;
      }

      console.log("Token refresh response did not contain access token");
      return false;
    } catch (error: any) {
      console.error("Error refreshing token:", error);

      // Log more detailed error information
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }

      // If the refresh token is invalid, clear all tokens
      if (error.response && error.response.status === 401) {
        console.log("Refresh token is invalid, clearing all tokens");
        await TokenStorage.clearTokens();
        setIsAuthenticated(false);
      }

      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await TokenStorage.getAccessToken();
        if (token) {
          // Verify the token is still valid
          const isValid = await checkTokenValidity();
          setIsAuthenticated(isValid);

          // If token exists but is invalid, try to refresh it
          if (!isValid) {
            console.log("Token exists but is invalid, attempting to refresh");
            const refreshSuccess = await refreshToken();
            setIsAuthenticated(refreshSuccess);
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
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
        checkTokenValidity,
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
