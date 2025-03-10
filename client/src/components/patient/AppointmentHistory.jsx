
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AppointmentContext from "../../context/appointment/AppointmentContext";
import AuthContext from "../../context/auth/AuthContext";
import AlertContext from "../../context/alert/AlertContext";
import Card from "../common/Card";
import Button from "../common/Button";
import Loader from "../common/Loader";
import Modal from "../common/Modal";
import { formatDate, formatTime } from "../../utils/dateUtils";

const AppointmentHistory = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  const appointmentContext = useContext(AppointmentContext);
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { appointments, getPatientAppointments, cancelAppointment, loading } =
    appointmentContext;
  const { user } = authContext;
  const { setAlert } = alertContext;

  useEffect(() => {
    if (user) {
      getPatientAppointments(user._id);
    }
    // eslint-disable-next-line
  }, [user]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openCancelModal = (appointment) => {
    setAppointmentToCancel(appointment);
    setCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setCancelModalOpen(false);
    setAppointmentToCancel(null);
  };

  const handleCancelAppointment = async () => {
    if (appointmentToCancel) {
      const success = await cancelAppointment(appointmentToCancel._id);
      if (success) {
        setAlert("Appointment cancelled successfully", "success");
      }
      closeCancelModal();
    }
  };

  // Filter appointments based on filter and search term
  const filteredAppointments = appointments.filter((app) => {
    const matchesFilter = filter === "all" || app.status === filter;

    const matchesSearch =
      app.doctorId.userId.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.doctorId.specialization
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

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
    <div className="appointment-history">
      <Card title="My Appointments">
        <div className="filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by doctor name or specialization"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="status-filter">
            <select value={filter} onChange={handleFilterChange}>
              <option value="all">All Appointments</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {sortedAppointments.length === 0 ? (
          <div className="no-data">
            <p>No appointments found</p>
            <Link to="/patient/dashboard/book">
              <Button text="Book an Appointment" variant="primary" />
            </Link>
          </div>
        ) : (
          <div className="appointments-table-container">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Specialization</th>
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
                    <td>Dr. {appointment.doctorId.userId.name}</td>
                    <td>{appointment.doctorId.specialization}</td>
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
                      <div className="action-buttons">
                        <Link to={`/appointments/${appointment._id}`}>
                          <Button text="View" variant="outline" size="small" />
                        </Link>
                        {appointment.status === "scheduled" && (
                          <Button
                            text="Cancel"
                            variant="danger"
                            size="small"
                            onClick={() => openCancelModal(appointment)}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={closeCancelModal}
        title="Cancel Appointment"
        footer={
          <>
            <Button
              text="No, Keep It"
              variant="outline"
              onClick={closeCancelModal}
            />
            <Button
              text="Yes, Cancel It"
              variant="danger"
              onClick={handleCancelAppointment}
            />
          </>
        }
      >
        <p>Are you sure you want to cancel this appointment?</p>
        {appointmentToCancel && (
          <div className="appointment-summary">
            <p>
              <strong>Doctor:</strong> Dr.{" "}
              {appointmentToCancel.doctorId.userId.name}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {formatDate(appointmentToCancel.appointmentDate)}
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {formatTime(appointmentToCancel.slot.startTime)} -{" "}
              {formatTime(appointmentToCancel.slot.endTime)}
            </p>
          </div>
        )}
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default AppointmentHistory;
