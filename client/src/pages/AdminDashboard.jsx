
import React, { useState, useContext } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AuthContext from "../context/auth/AuthContext";
import Loader from "../components/common/Loader";
import UserList from "../components/admin/UserList";
import UserForm from "../components/admin/UserForm";
import DoctorList from "../components/admin/DoctorList";
import DoctorForm from "../components/admin/DoctorForm";
import DepartmentList from "../components/admin/DepartmentList";
import DepartmentForm from "../components/admin/DepartmentForm";
import AdminHome from "../components/admin/AdminHome";

const AdminDashboard = () => {
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
          <h3>Admin Dashboard</h3>
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
              <p>Administrator</p>
            </div>
          </div>
          <ul className="sidebar-menu">
            <li onClick={() => navigate("/admin/dashboard")}>
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </li>
            <li onClick={() => navigate("/admin/dashboard/users")}>
              <i className="fas fa-users"></i> Users
            </li>
            <li onClick={() => navigate("/admin/dashboard/doctors")}>
              <i className="fas fa-user-md"></i> Doctors
            </li>
            <li onClick={() => navigate("/admin/dashboard/departments")}>
              <i className="fas fa-hospital"></i> Departments
            </li>
            <li onClick={() => navigate("/admin/dashboard/appointments")}>
              <i className="fas fa-calendar-check"></i> Appointments
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
            <h2>Admin Dashboard</h2>
          </div>
        </div>

        <div className="dashboard-body">
          <Routes>
            <Route index element={<AdminHome />} />
            <Route path="users" element={<UserList />} />
            <Route path="users/add" element={<UserForm />} />
            <Route path="users/edit/:id" element={<UserForm />} />
            <Route path="doctors" element={<DoctorList />} />
            <Route path="doctors/add" element={<DoctorForm />} />
            <Route path="doctors/edit/:id" element={<DoctorForm />} />
            <Route path="departments" element={<DepartmentList />} />
            <Route path="departments/add" element={<DepartmentForm />} />
            <Route path="departments/edit/:id" element={<DepartmentForm />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
