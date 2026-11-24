import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("provider_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error.config?.url?.includes("/auth/provider/login") ||
      error.config?.url?.includes("/auth/operator/login") ||
      error.config?.url?.includes("/auth/provider/register") ||
      error.config?.url?.includes("/auth/register") ||
      error.config?.url?.includes("/auth/login");

    if (error.response && error.response.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("provider_token");
      localStorage.removeItem("provider_user");
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

// Staff (HR) API endpoints
export const createStaffApi = (data) => api.post("/provider/staff", data);
export const getStaffApi = () => api.get("/provider/staff");
export const deleteStaffApi = (id) => api.delete(`/provider/staff/${id}`);

// Bus Operator (Driver / Conductor) API endpoints
export const createOperatorApi = (data) => api.post("/provider/operators", data);
export const getOperatorsApi = () => api.get("/provider/operators");
export const deleteOperatorApi = (id) => api.delete(`/provider/operators/${id}`);

export default api;
