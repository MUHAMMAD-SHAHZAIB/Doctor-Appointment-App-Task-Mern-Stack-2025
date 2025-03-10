import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";
import Loader from "./Loader";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, loading, user } = authContext;

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check if user has the required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect based on user role
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else if (user.role === "doctor") {
      return <Navigate to="/doctor/dashboard" />;
    } else {
      return <Navigate to="/patient/dashboard" />;
    }
  }

  return children;
};

export default ProtectedRoute;
