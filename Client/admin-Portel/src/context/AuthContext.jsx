import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("admin_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("admin_token") || null);
  const [loading, setLoading] = useState(true);

  // Verify auth on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const currentToken = localStorage.getItem("admin_token");
      if (!currentToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        if (response.data?.success && response.data?.user) {
          setUser(response.data.user);
          localStorage.setItem("admin_user", JSON.stringify(response.data.user));
        } else {
          logout();
        }
      } catch (err) {
        console.error("Token verification failed:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/admin/login", { email, password });
      if (response.data?.success) {
        const { token: receivedToken, user: receivedUser } = response.data;
        localStorage.setItem("admin_token", receivedToken);
        localStorage.setItem("admin_user", JSON.stringify(receivedUser));
        setToken(receivedToken);
        setUser(receivedUser); 
        return { success: true, user: receivedUser };
      }
      return { success: false, message: response.data?.message || "Login failed" };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.message === "Network Error"
          ? "Cannot connect to server. Ensure backend is running on port 5000."
          : "Invalid credentials or login failed.");
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && (user?.role === "admin" || user?.role === "platform_employee"),
        login,
        logout,
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

