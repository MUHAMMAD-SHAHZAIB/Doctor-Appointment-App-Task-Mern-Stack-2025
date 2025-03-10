
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppointmentContext from "../../context/appointment/AppointmentContext";
import AlertContext from "../../context/alert/AlertContext";
import Card from "../common/Card";
import Button from "../common/Button";
import Loader from "../common/Loader";
import { formatDate, formatTime } from "../../utils/dateUtils";

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    status: "",
    prescription: "",
    diagnosis: "",
    remarks: "",
  });

  const appointmentContext = useContext(AppointmentContext);
  const alertContext = useContext(AlertContext);
  const { currentAppointment, getAppointment, updateAppointment, loading } =
    appointmentContext;
  const { setAlert } = alertContext;

  useEffect(() => {
    getAppointment(id);
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (currentAppointment) {
      setFormData({
        status: currentAppointment.status,
        prescription: currentAppointment.prescription || "",
        diagnosis: currentAppointment.diagnosis || "",
        remarks: currentAppointment.remarks || "",
      });
    }
  }, [currentAppointment]);

  const { status, prescription, diagnosis, remarks } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const result = await updateAppointment(id, formData);

    if (result) {
      setAlert("Appointment updated successfully", "success");
    }
  };

  const goBack = () => {
    navigate("/doctor/dashboard/appointments");
  };

  if (loading || !currentAppointment) {
    return <Loader />;
  }

  return (
    <div className="appointment-details">
      <Button
        text="Back to Appointments"
        variant="outline"
        onClick={goBack}
        icon={<i className="fas fa-arrow-left"></i>}
      />

      <Card title="Appointment Details">
        <div className="appointment-info">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Patient Name:</span>
              <span className="info-value">
                {currentAppointment.patientId.name}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Patient Email:</span>
              <span className="info-value">
                {currentAppointment.patientId.email}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Patient Phone:</span>
              <span className="info-value">
                {currentAppointment.patientId.phone || "N/A"}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Appointment Date:</span>
              <span className="info-value">
                {formatDate(currentAppointment.appointmentDate)}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Appointment Time:</span>
              <span className="info-value">
                {formatTime(currentAppointment.slot.startTime)} -{" "}
                {formatTime(currentAppointment.slot.endTime)}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className={`status-badge ${currentAppointment.status}`}>
                {currentAppointment.status.charAt(0).toUpperCase() +
                  currentAppointment.status.slice(1)}
              </span>
            </div>
          </div>

          {currentAppointment.symptoms && (
            <div className="symptoms-section">
              <h3>Patient Symptoms</h3>
              <p>{currentAppointment.symptoms}</p>
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="appointment-update-form">
          <h3>Update Appointment</h3>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              name="status"
              id="status"
              value={status}
              onChange={onChange}
              required
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="diagnosis">Diagnosis</label>
            <textarea
              name="diagnosis"
              id="diagnosis"
              value={diagnosis}
              onChange={onChange}
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="prescription">Prescription</label>
            <textarea
              name="prescription"
              id="prescription"
              value={prescription}
              onChange={onChange}
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="remarks">Remarks</label>
            <textarea
              name="remarks"
              id="remarks"
              value={remarks}
              onChange={onChange}
              rows="3"
            ></textarea>
          </div>

          <Button type="submit" text="Update Appointment" variant="primary" />
        </form>
      </Card>
    </div>
  );
};

export default AppointmentDetails;
