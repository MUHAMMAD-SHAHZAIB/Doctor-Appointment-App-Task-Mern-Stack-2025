
import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import AppointmentContext from "../../context/appointment/AppointmentContext";
import AuthContext from "../../context/auth/AuthContext";
import Card from "../common/Card";
import Button from "../common/Button";
import Loader from "../common/Loader";
import { formatDate, formatTime } from "../../utils/dateUtils";

const PatientDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
  });

  const appointmentContext = useContext(AppointmentContext);
  const authContext = useContext(AuthContext);
  const { appointments, getPatientAppointments, loading } = appointmentContext;
  const { user } = authContext;

  useEffect(() => {
    if (user) {
      getPatientAppointments(user._id);
    }
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (appointments.length > 0) {
      calculateStats();
    }
    // eslint-disable-next-line
  }, [appointments]);

  const calculateStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const total = appointments.length;

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

    setStats({
      total,
      upcoming,
      completed,
      cancelled,
    });
  };

  // Get upcoming appointments
  const upcomingAppointments = appointments
    .filter((app) => {
      const appDate = new Date(app.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return appDate >= today && app.status === "scheduled";
    })
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 3); // Get only 3 upcoming appointments

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="patient-dashboard">
      {/* Welcome Section */}
      <Card className="welcome-card">
        <h2>Welcome, {user.name}!</h2>
        <p>Here's an overview of your appointments and healthcare journey.</p>
        <Link to="/patient/dashboard/book">
          <Button
            text="Book New Appointment"
            variant="primary"
            icon={<i className="fas fa-calendar-plus"></i>}
          />
        </Link>
      </Card>

      {/* Stats Section */}
      <div className="stats-container">
        <Card className="stats-card">
          <div className="stats-icon total">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="stats-info">
            <h3>{stats.total}</h3>
            <p>Total Appointments</p>
          </div>
        </Card>
        <Card className="stats-card">
          <div className="stats-icon upcoming">
            <i className="fas fa-calendar-day"></i>
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

      {/* Upcoming Appointments */}
      <Card title="Upcoming Appointments ">
        {upcomingAppointments.length === 0 ? (
          <div className="no-data">
            <p>No upcoming appointments</p>
            <Link to="/patient/dashboard/book">
              <Button text="Book Now" variant="primary" size="small" />
            </Link>
          </div>
        ) : (
          <div className="upcoming-appointments">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment._id} className="appointment-card">
                {console.log(appointment)}
                <div className="appointment-date">
                  <div className="date-box">
                    <span className="date-day">
                      {new Date(appointment.appointmentDate).getDate()}
                    </span>
                    <span className="date-month">
                      {new Date(appointment.appointmentDate).toLocaleString(
                        "default",
                        { month: "short" }
                      )}
                    </span>
                  </div>
                  <div className="time-box">
                    {formatTime(appointment.slot.startTime)} -{" "}
                    {formatTime(appointment.slot.endTime)}
                  </div>
                </div>
                <div className="appointment-details">
                  <h4>Dr. {appointment.doctorId.userId.name}</h4>
                  <p>{appointment.doctorId.specialization}</p>
                </div>
                <Link to={`/appointments/${appointment._id}`}>
                  <Button text="View Details " variant="outline" size="small" />
                </Link>
              </div>
            ))}
            <div className="view-all">
              <Link to="/patient/dashboard/appointments">
                View All Appointments
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default PatientDashboard;
