
import React, { useState, useContext } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../context/auth/AuthContext";
import PatientDashboard from "../components/patient/PatientDashboard";
import AppointmentHistory from "../components/patient/AppointmentHistory";
import AppointmentBooking from "../components/patient/AppointmentBooking";
import DoctorDetail from "../components/patient/DoctorDetail";
import Loader from "../components/common/Loader";

const PatientDashboardPage = () => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const authContext = useContext(AuthContext);
  const { user, loading } = authContext;

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${sidebarActive ? "active" : ""}`}>
        <div className="sidebar-header">
          <h3>Patient Dashboard</h3>
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
              <p>{user.email}</p>
            </div>
          </div>
          <ul className="sidebar-menu">
            <li onClick={() => navigate("/patient/dashboard")}>
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </li>
            <li onClick={() => navigate("/patient/dashboard/appointments")}>
              <i className="fas fa-calendar-check"></i> My Appointments
            </li>
            <li onClick={() => navigate("/patient/dashboard/book")}>
              <i className="fas fa-calendar-plus"></i> Book Appointment
            </li>
            <li onClick={() => navigate("/doctors")}>
              <i className="fas fa-user-md"></i> Find Doctors
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
            <h2>Patient Dashboard </h2>
          </div>
        </div>

        <div className="dashboard-body">
          <Routes>
            <Route index element={<PatientDashboard />} />
            <Route path="appointments" element={<AppointmentHistory />} />
            <Route path="book" element={<AppointmentBooking />} />
            <Route path="book/:doctorId" element={<DoctorDetail />} />
            <Route path="*" element={<Navigate to="/patient/dashboard" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboardPage;
