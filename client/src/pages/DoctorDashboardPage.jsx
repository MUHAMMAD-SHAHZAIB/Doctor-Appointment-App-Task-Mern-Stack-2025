
import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../context/auth/AuthContext";
import DoctorContext from "../context/doctor/DoctorContext";
import Loader from "../components/common/Loader";
import Header from "../components/common/Header";
import DoctorDashboard from "../components/doctor/DoctorDashboard";
import AppointmentDetails from "../components/doctor/AppointmentDetails";
import ProfileForm from "../components/doctor/ProfileForm";
import AvailabilityForm from "../components/doctor/AvailabilityForm";

const DoctorDashboardPage = () => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const authContext = useContext(AuthContext);
  const doctorContext = useContext(DoctorContext);
  const { user, loading: authLoading } = authContext;
  const {
    currentDoctor,
    getCurrentDoctorProfile,
    loading: doctorLoading,
  } = doctorContext;

  const navigate = useNavigate();

  useEffect(() => {
    if (user && user._id) {
      getCurrentDoctorProfile(user._id);
    }
    // eslint-disable-next-line
  }, [user]);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  if (authLoading || doctorLoading) {
    return <Loader />;
  }

  // If doctor profile doesn't exist, redirect to the user dashboard
  if (!doctorLoading && !currentDoctor) {
    return (
      <div className="container">
        <Header title="Doctor Profile Not Found" />
        <div className="alert alert-danger">
          Your doctor profile has not been created yet. Please contact the
          admin.
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${sidebarActive ? "active" : ""}`}>
        <div className="sidebar-header">
          <h3>Doctor Dashboard</h3>
          <button className="sidebar-close" onClick={toggleSidebar}>
            &times;
          </button>
        </div>
        <div className="sidebar-content">
          <div className="user-info">
            <div className="user-avatar">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="user-details">
              <h4>{user.name}</h4>
              <p>{currentDoctor.specialization}</p>
            </div>
          </div>
          <ul className="sidebar-menu">
            <li onClick={() => navigate("/doctor/dashboard")}>
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </li>
            <li onClick={() => navigate("/doctor/dashboard/appointments")}>
              <i className="fas fa-calendar-check"></i> Appointments
            </li>
            <li onClick={() => navigate("/doctor/dashboard/availability")}>
              <i className="fas fa-clock"></i> Availability
            </li>
            <li onClick={() => navigate("/doctor/dashboard/profile")}>
              <i className="fas fa-user-md"></i> Profile
            </li>
          </ul>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <div className="dashboard-title">
            <h2>Doctor Dashboard</h2>
          </div>
        </div>

        <div className="dashboard-body">
          <Routes>
            <Route index element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorDashboard />} />
            <Route path="appointments/:id" element={<AppointmentDetails />} />
            <Route path="profile" element={<ProfileForm />} />
            <Route path="availability" element={<AvailabilityForm />} />
            <Route path="*" element={<Navigate to="/doctor/dashboard" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
