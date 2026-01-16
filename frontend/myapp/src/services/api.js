// src/services/api.js - UPGRADED VERSION
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - attach token
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;

      // Only redirect to login if not already on login/register pages
      if (
        currentPath !== "/login" &&
        currentPath !== "/register" &&
        currentPath !== "/"
      ) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    // Handle 403 Forbidden (insufficient permissions)
    if (error.response?.status === 403) {
      console.error("Access denied:", error.response.data.message);
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error("Resource not found:", error.response.data.message);
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      console.error("Server error:", error.response.data.message);
    }

    return Promise.reject(error);
  }
);

export default API;
