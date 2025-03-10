
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AppointmentContext from "../../context/appointment/AppointmentContext";
import DoctorContext from "../../context/doctor/DoctorContext";
import Card from "../common/Card";
import Button from "../common/Button";
import Loader from "../common/Loader";
import { formatDate, formatTime } from "../../utils/dateUtils";

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    today: 0,
  });
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const appointmentContext = useContext(AppointmentContext);
  const doctorContext = useContext(DoctorContext);
  const { appointments, getDoctorAppointments, loading } = appointmentContext;
  const { currentDoctor } = doctorContext;

  useEffect(() => {
    if (currentDoctor) {
      getDoctorAppointments(currentDoctor._id);
    }
    // eslint-disable-next-line
  }, [currentDoctor]);

  useEffect(() => {
    if (appointments.length > 0) {
      calculateStats();
    }
    // eslint-disable-next-line
  }, [appointments]);

  const calculateStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = appointments.filter(
      (app) =>
        new Date(app.appointmentDate) >= today && app.status === "scheduled"
    ).length;

    const completed = appointments.filter(
      (app) => app.status === "completed"
    ).length;

    const cancelled = appointments.filter(
      (app) => app.status === "cancelled"
    ).length;

    const todayApps = appointments.filter((app) => {
      const appDate = new Date(app.appointmentDate);
      return (
        appDate.getDate() === today.getDate() &&
        appDate.getMonth() === today.getMonth() &&
        appDate.getFullYear() === today.getFullYear() &&
        app.status === "scheduled"
      );
    }).length;

    setStats({
      upcoming,
      completed,
      cancelled,
      today: todayApps,
    });
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter appointments based on filter and search term
  const filteredAppointments = appointments.filter((app) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "today" &&
        new Date(app.appointmentDate).toDateString() ===
          new Date().toDateString()) ||
      app.status === filter;

    const matchesSearch =
      app.patientId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.symptoms &&
        app.symptoms.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  // Sort appointments by date (newest first)
  const sortedAppointments = [...filteredAppointments].sort(
    (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="doctor-dashboard">
      {/* Stats Cards */}
      <div className="stats-container">
        <Card className="stats-card">
          <div className="stats-icon today">
            <i className="fas fa-calendar-day"></i>
          </div>
          <div className="stats-info">
            <h3>{stats.today}</h3>
            <p>Today's Appointments</p>
          </div>
        </Card>
        <Card className="stats-card">
          <div className="stats-icon upcoming">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="stats-info">
            <h3>{stats.upcoming}</h3>
            <p>Upcoming Appointments</p>
          </div>
        </Card>
        <Card className="stats-card">
          <div className="stats-icon completed">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stats-info">
            <h3>{stats.completed}</h3>
            <p>Completed Appointments</p>
          </div>
        </Card>
        <Card className="stats-card">
          <div className="stats-icon cancelled">
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="stats-info">
            <h3>{stats.cancelled}</h3>
            <p>Cancelled Appointments</p>
          </div>
        </Card>
      </div>

      {/* Appointments List */}
      <Card title="Appointments">
        <div className="filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by patient name or symptoms"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="status-filter">
            <select value={filter} onChange={handleFilterChange}>
              <option value="all">All Appointments</option>
              <option value="today">Today</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>
        </div>

        {sortedAppointments.length === 0 ? (
          <div className="no-data">
            <p>No appointments found</p>
          </div>
        ) : (
          <div className="appointments-table-container">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedAppointments.map((appointment) => (
                  <tr
                    key={appointment._id}
                    className={`status-${appointment.status}`}
                  >
                    <td>{appointment.patientId.name}</td>
                    <td>{formatDate(appointment.appointmentDate)}</td>
                    <td>
                      {formatTime(appointment.slot.startTime)} -{" "}
                      {formatTime(appointment.slot.endTime)}
                    </td>
                    <td>
                      <span className={`status-badge ${appointment.status}`}>
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/doctor/dashboard/appointments/${appointment._id}`}
                      >
                        <Button text="View" variant="outline" size="small" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DoctorDashboard;
