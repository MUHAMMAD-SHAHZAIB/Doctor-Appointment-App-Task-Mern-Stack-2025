
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";
import DoctorContext from "../../context/doctor/DoctorContext";
import DepartmentContext from "../../context/department/DepartmentContext";
import AppointmentContext from "../../context/appointment/AppointmentContext";
import Card from "../common/Card";
import Button from "../common/Button";
import Loader from "../common/Loader";

const AdminHome = () => {
  const [stats, setStats] = useState({
    users: 0,
    doctors: 0,
    departments: 0,
    appointments: {
      total: 0,
      scheduled: 0,
      completed: 0,
      cancelled: 0,
    },
  });

  const authContext = useContext(AuthContext);
  const doctorContext = useContext(DoctorContext);
  const departmentContext = useContext(DepartmentContext);
  const appointmentContext = useContext(AppointmentContext);

  const { getAllUsers, loading: usersLoading } = authContext;
  const { getDoctors, doctors, loading: doctorsLoading } = doctorContext;
  const {
    getDepartments,
    departments,
    loading: departmentsLoading,
  } = departmentContext;
  const {
    getAllAppointments,
    appointments,
    loading: appointmentsLoading,
  } = appointmentContext;

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all required data
      const users = await getAllUsers();
      getDoctors();
      getDepartments();
      getAllAppointments();
    };

    fetchData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Calculate stats when data is loaded
    if (doctors && departments && appointments) {
      const scheduled = appointments.filter(
        (app) => app.status === "scheduled"
      ).length;
      const completed = appointments.filter(
        (app) => app.status === "completed"
      ).length;
      const cancelled = appointments.filter(
        (app) => app.status === "cancelled"
      ).length;

      setStats({
        users: 0, // We'll update this when users are fetched
        doctors: doctors.length,
        departments: departments.length,
        appointments: {
          total: appointments.length,
          scheduled,
          completed,
          cancelled,
        },
      });
    }
  }, [doctors, departments, appointments]);

  const loading =
    usersLoading || doctorsLoading || departmentsLoading || appointmentsLoading;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="admin-home">
      <h2>Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="stats-grid">
        <Card className="stats-card">
          <div className="stats-icon users">
            <i className="fas fa-users"></i>
          </div>
          <div className="stats-info">
            <h3>{stats.users}</h3>
            <p>Total Users</p>
          </div>
          <Link to="/admin/dashboard/users">
            <Button text="Manage" variant="outline" size="small" />
          </Link>
        </Card>

        <Card className="stats-card">
          <div className="stats-icon doctors">
            <i className="fas fa-user-md"></i>
          </div>
          <div className="stats-info">
            <h3>{stats.doctors}</h3>
            <p>Total Doctors</p>
          </div>
          <Link to="/admin/dashboard/doctors">
            <Button text="Manage" variant="outline" size="small" />
          </Link>
        </Card>

        <Card className="stats-card">
          <div className="stats-icon departments">
            <i className="fas fa-hospital"></i>
          </div>
          <div className="stats-info">
            <h3>{stats.departments}</h3>
            <p>Departments</p>
          </div>
          <Link to="/admin/dashboard/departments">
            <Button text="Manage" variant="outline" size="small" />
          </Link>
        </Card>

        <Card className="stats-card">
          <div className="stats-icon appointments">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stats-info">
            <h3>{stats.appointments.total}</h3>
            <p>Total Appointments</p>
          </div>
          <Link to="/admin/dashboard/appointments">
            <Button text="View" variant="outline" size="small" />
          </Link>
        </Card>
      </div>

      {/* Appointment Stats */}
      <Card title="Appointment Statistics">
        <div className="appointment-stats">
          <div className="stat-item">
            <div className="stat-value scheduled">
              {stats.appointments.scheduled}
            </div>
            <div className="stat-label">Scheduled</div>
          </div>
          <div className="stat-item">
            <div className="stat-value completed">
              {stats.appointments.completed}
            </div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-item">
            <div className="stat-value cancelled">
              {stats.appointments.cancelled}
            </div>
            <div className="stat-label">Cancelled</div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="quick-actions">
          <Link to="/admin/dashboard/users/add">
            <Button
              text="Add User"
              variant="primary"
              icon={<i className="fas fa-user-plus"></i>}
            />
          </Link>
          <Link to="/admin/dashboard/doctors/add">
            <Button
              text="Add Doctor"
              variant="primary"
              icon={<i className="fas fa-user-md"></i>}
            />
          </Link>
          <Link to="/admin/dashboard/departments/add">
            <Button
              text="Add Department"
              variant="primary"
              icon={<i className="fas fa-hospital-alt"></i>}
            />
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default AdminHome;
