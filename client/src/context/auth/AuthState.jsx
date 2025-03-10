import { useReducer } from "react";
import axios from "axios";
import AuthContext from "./AuthContext";
import AuthReducer from "./AuthReducer";
import setAuthToken from "../../utils/authToken";

const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    user: null,
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const loadUser = async () => {
    // Only try to authenticate if we have a token
    if (localStorage.token) {
      setAuthToken(localStorage.token);

      try {
        const res = await axios.get("/api/auth/profile");
        dispatch({ type: "USER_LOADED", payload: res.data });
      } catch (err) {
        dispatch({
          type: "AUTH_ERROR",
          payload: err.response?.data?.message || "Authentication failed",
        });
      }
    } else {
      // If no token exists, just set loading to false without error
      dispatch({ type: "NO_TOKEN" });
    }
  };

  // Register User
  const register = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.post("/api/auth/register", formData, config);
      dispatch({ type: "REGISTER_SUCCESS", payload: res.data });
      loadUser();
    } catch (err) {
      dispatch({
        type: "REGISTER_FAIL",
        payload:
          err.response?.data?.message ||
          err.response?.data?.errors[0]?.msg ||
          "Registration failed",
      });
    }
  };

  // Login User
  const login = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.post("/api/auth/login", formData, config);

      // Save token to localStorage first
      localStorage.setItem("token", res.data.token);

      // Set the auth token in axios headers
      setAuthToken(res.data.token);

      // Then dispatch login success
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });

      // Load user data after a short delay to ensure token is set
      setTimeout(() => {
        loadUser();
      }, 100);
    } catch (err) {
      dispatch({
        type: "LOGIN_FAIL",
        payload: err.response?.data?.message || "Invalid credentials",
      });
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  // Update Profile
  const updateProfile = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.put("/api/auth/profile", formData, config);
      dispatch({ type: "USER_LOADED", payload: res.data });
      return true;
    } catch (err) {
      dispatch({
        type: "AUTH_ERROR",
        payload: err.response?.data?.message || "Failed to update profile",
      });
      return false;
    }
  };

  // Admin Functions
  // Get all users (admin only)
  const getAllUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users");
      return res.data;
    } catch (err) {
      dispatch({
        type: "AUTH_ERROR",
        payload: err.response?.data?.message || "Failed to get users",
      });
      return null;
    }
  };

  // Create new user (admin only)
  const createUser = async (userData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post("/api/admin/users", userData, config);
      return res.data;
    } catch (err) {
      dispatch({
        type: "AUTH_ERROR",
        payload: err.response?.data?.message || "Failed to create user",
      });
      return null;
    }
  };

  // Update user (admin only)
  const updateUser = async (id, userData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.put(`/api/admin/users/${id}`, userData, config);
      return res.data;
    } catch (err) {
      dispatch({
        type: "AUTH_ERROR",
        payload: err.response?.data?.message || "Failed to update user",
      });
      return null;
    }
  };

  // Delete user (admin only)
  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/admin/users/${id}`);
      return true;
    } catch (err) {
      dispatch({
        type: "AUTH_ERROR",
        payload: err.response?.data?.message || "Failed to delete user",
      });
      return false;
    }
  };

  // Clear Errors
  const clearErrors = () => dispatch({ type: "CLEAR_ERRORS" });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        loading: state.loading,
        error: state.error,
        register,
        login,
        logout,
        loadUser,
        updateProfile,
        clearErrors,
        getAllUsers,
        createUser,
        updateUser,
        deleteUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
