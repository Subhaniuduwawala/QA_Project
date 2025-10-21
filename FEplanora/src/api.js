import axios from "axios";

// Create a reusable Axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api", // my backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to requests if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it
      localStorage.removeItem("adminToken");
      // Redirect to login if needed
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export default API; 