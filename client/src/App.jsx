import { useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";

// Layout Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Alert from "./components/common/Alert";

// Page Components
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import PatientDashboardPage from "./pages/PatientDashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import AppointmentPage from "./pages/AppointmentPage";
import NotFoundPage from "./pages/NotFoundPage";

// Authentication & Protected Routes
import ProtectedRoute from "./components/common/ProtectedRoute";
import AuthContext from "./context/auth/AuthContext";
import setAuthToken from "./utils/authToken";
import { configureApi } from "./utils/api";

// Configure API
configureApi();

// Check for token in localStorage
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  const authContext = useContext(AuthContext);
  const { loadUser, isAuthenticated, user } = authContext;

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  // Helper function to determine dashboard based on user role
  const getDashboardRoute = () => {
    if (!isAuthenticated) return <Navigate to="/login" />;

    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else if (user?.role === "doctor") {
      return <Navigate to="/doctor/dashboard" />;
    } else {
      return <Navigate to="/patient/dashboard" />;
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Alert />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/dashboard" element={getDashboardRoute()} />

            {/* Protected Routes */}
            <Route
              path="/admin/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "doctor", "patient"]}>
                  <AppointmentPage />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
