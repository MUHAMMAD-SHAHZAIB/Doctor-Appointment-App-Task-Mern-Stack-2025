// src/utils/api.js
import axios from "axios";

// Set base URL for API calls
axios.defaults.baseURL = "http://localhost:5000";

// Export API configuration function
export const configureApi = () => {
  // Add a request interceptor for logging
  axios.interceptors.request.use(
    (config) => {
      // You can add logging here
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor for handling common errors
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle common errors
      if (error.response && error.response.status === 401) {
        // Unauthorized - could redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};
