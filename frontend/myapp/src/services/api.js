// src/services/api.js
import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1",
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

// Response interceptor - handle errors globally with toast notifications
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message;

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
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
      }
    }

    // Handle 403 Forbidden (insufficient permissions)
    if (error.response?.status === 403) {
      toast.error(message || "You don't have permission to do that.");
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      toast.error(message || "The requested resource was not found.");
    }

    // Handle 429 Rate Limited
    if (error.response?.status === 429) {
      toast.error("Too many requests. Please wait a moment and try again.");
    }

    // Handle 500 Server Error
    if (error.response?.status === 500) {
      toast.error("Something went wrong. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default API;
