
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppointmentContext from "../context/appointment/AppointmentContext";
import AuthContext from "../context/auth/AuthContext";
import AlertContext from "../context/alert/AlertContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import Modal from "../components/common/Modal";
import { formatDate, formatTime } from "../utils/dateUtils";

const AppointmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: "",
    diagnosis: "",
    prescription: "",
    remarks: "",
  });

  const appointmentContext = useContext(AppointmentContext);
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const {
    getAppointment,
    updateAppointment,
    cancelAppointment,
    currentAppointment,
    loading,
  } = appointmentContext;
  const { user } = authContext;
  const { setAlert } = alertContext;

  // Using useRef to prevent infinite loop
  const fetchedRef = React.useRef(false);

  useEffect(() => {
    // Only fetch if we haven't already fetched or if id changes
    if (id && (!fetchedRef.current || fetchedRef.current !== id)) {
      getAppointment(id);
      fetchedRef.current = id;
    }
  }, [id]);

  useEffect(() => {
    if (currentAppointment) {
      setUpdateData({
        status: currentAppointment.status || "",
        diagnosis: currentAppointment.diagnosis || "",
        prescription: currentAppointment.prescription || "",
        remarks: currentAppointment.remarks || "",
      });
    }
  }, [currentAppointment]);

  if (loading || !currentAppointment) {
    return <Loader />;
  }

  const { status, diagnosis, prescription, remarks } = updateData;

  // Determine if the current user is the patient, doctor, or admin
  const isPatient =
    user &&
    user.role === "patient" &&
    user._id === currentAppointment.patientId?._id;
  const isDoctor =
    user &&
    user.role === "doctor" &&
    user._id === currentAppointment.doctorId?.userId?._id;
  const isAdmin = user && user.role === "admin";

  // Determine if appointment is upcoming (can be cancelled)
  const appointmentDate = new Date(currentAppointment.appointmentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isUpcoming =
    appointmentDate >= today && currentAppointment.status === "scheduled";

  const openCancelModal = () => {
    setCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setCancelModalOpen(false);
  };

  const handleCancelAppointment = async () => {
    const success = await cancelAppointment(id);

    if (success) {
      setAlert("Appointment cancelled successfully", "success");

      // Redirect based on user role
      if (isPatient) {
        navigate("/patient/dashboard/appointments");
      } else if (isDoctor) {
        navigate("/doctor/dashboard/appointments");
      } else if (isAdmin) {
        navigate("/admin/dashboard/appointments");
      }
    }

    closeCancelModal();
  };

  const onChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const onSubmitUpdate = async (e) => {
    e.preventDefault();

    const success = await updateAppointment(id, updateData);

    if (success) {
      setAlert("Appointment updated successfully", "success");
      // Refresh the appointment data
      getAppointment(id);
    }
  };

  const getDashboardLink = () => {
    if (isPatient) {
      return "/patient/dashboard/appointments";
    } else if (isDoctor) {
      return "/doctor/dashboard/appointments";
    } else if (isAdmin) {
      return "/admin/dashboard/appointments";
    }
    return "/dashboard";
  };

  // Safe access to nested properties
  const getDoctorName = () => {
    try {
      return currentAppointment.doctorId?.userId?.name || "Unknown";
    } catch (error) {
      return "Unknown";
    }
  };

  const getDoctorSpecialization = () => {
    try {
      return currentAppointment.doctorId?.specialization || "Unknown";
    } catch (error) {
      return "Unknown";
    }
  };

  const getDepartmentName = () => {
    try {
      return currentAppointment.doctorId?.departmentId?.name || "Unknown";
    } catch (error) {
      return "Unknown";
    }
  };

  const getConsultationFee = () => {
    try {
      return currentAppointment.doctorId?.consultationFee || "Unknown";
    } catch (error) {
      return "Unknown";
    }
  };

  const getPatientName = () => {
    try {
      return currentAppointment.patientId?.name || "Unknown";
    } catch (error) {
      return "Unknown";
    }
  };

  const getPatientEmail = () => {
    try {
      return currentAppointment.patientId?.email || "Unknown";
    } catch (error) {
      return "Unknown";
    }
  };

  const getPatientPhone = () => {
    try {
      return currentAppointment.patientId?.phone;
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="appointment-detail-page">
      <div className="container">
        <div className="page-header">
          <h2>Appointment Details</h2>
          <Button
            text="Back to Appointments"
            variant="outline"
            onClick={() => navigate(getDashboardLink())}
            icon={<i className="fas fa-arrow-left"></i>}
          />
        </div>

        <Card>
          <div className="appointment-header">
            <div className="appointment-status">
              <span className={`status-badge ${currentAppointment.status}`}>
                {currentAppointment.status.charAt(0).toUpperCase() +
                  currentAppointment.status.slice(1)}
              </span>
            </div>
            <div className="appointment-id">
              <span>Appointment ID: {currentAppointment._id}</span>
            </div>
          </div>

          <div className="appointment-details">
            <div className="detail-section">
              <h3>Date & Time</h3>
              <div className="detail-row">
                <div className="detail-label">Date:</div>
                <div className="detail-value">
                  {formatDate(currentAppointment.appointmentDate)}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Time:</div>
                <div className="detail-value">
                  {formatTime(currentAppointment.slot?.startTime)} -{" "}
                  {formatTime(currentAppointment.slot?.endTime)}
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Doctor Information</h3>
              <div className="detail-row">
                <div className="detail-label">Doctor:</div>
                <div className="detail-value">Dr. {getDoctorName()}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Specialization:</div>
                <div className="detail-value">{getDoctorSpecialization()}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Department:</div>
                <div className="detail-value">{getDepartmentName()}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Fee:</div>
                <div className="detail-value">${getConsultationFee()}</div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Patient Information</h3>
              <div className="detail-row">
                <div className="detail-label">Name:</div>
                <div className="detail-value">{getPatientName()}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Email:</div>
                <div className="detail-value">{getPatientEmail()}</div>
              </div>
              {getPatientPhone() && (
                <div className="detail-row">
                  <div className="detail-label">Phone:</div>
                  <div className="detail-value">{getPatientPhone()}</div>
                </div>
              )}
            </div>

            {currentAppointment.symptoms && (
              <div className="detail-section">
                <h3>Symptoms</h3>
                <div className="detail-text">{currentAppointment.symptoms}</div>
              </div>
            )}

            {(currentAppointment.diagnosis ||
              currentAppointment.prescription) && (
              <div className="medical-details">
                {currentAppointment.diagnosis && (
                  <div className="detail-section">
                    <h3>Diagnosis</h3>
                    <div className="detail-text">
                      {currentAppointment.diagnosis}
                    </div>
                  </div>
                )}

                {currentAppointment.prescription && (
                  <div className="detail-section">
                    <h3>Prescription</h3>
                    <div className="detail-text">
                      {currentAppointment.prescription}
                    </div>
                  </div>
                )}

                {currentAppointment.remarks && (
                  <div className="detail-section">
                    <h3>Doctor's Remarks</h3>
                    <div className="detail-text">
                      {currentAppointment.remarks}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cancel Button for Patients */}
            {isPatient && isUpcoming && (
              <div className="action-section">
                <Button
                  text="Cancel Appointment"
                  variant="danger"
                  onClick={openCancelModal}
                  icon={<i className="fas fa-times-circle"></i>}
                />
              </div>
            )}

            {/* Update Form for Doctors */}
            {(isDoctor || isAdmin) && (
              <div className="doctor-update-section">
                <h3>Update Appointment</h3>
                <form onSubmit={onSubmitUpdate} className="update-form">
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={status}
                      onChange={onChange}
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
                      id="diagnosis"
                      name="diagnosis"
                      value={diagnosis}
                      onChange={onChange}
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="prescription">Prescription</label>
                    <textarea
                      id="prescription"
                      name="prescription"
                      value={prescription}
                      onChange={onChange}
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="remarks">Remarks</label>
                    <textarea
                      id="remarks"
                      name="remarks"
                      value={remarks}
                      onChange={onChange}
                      rows="3"
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    text="Update Appointment"
                    variant="primary"
                  />
                </form>
              </div>
            )}
          </div>
        </Card>
      </div>

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
        <div className="appointment-summary">
          <p>
            <strong>Doctor:</strong> Dr. {getDoctorName()}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {formatDate(currentAppointment.appointmentDate)}
          </p>
          <p>
            <strong>Time:</strong>{" "}
            {formatTime(currentAppointment.slot?.startTime)} -{" "}
            {formatTime(currentAppointment.slot?.endTime)}
          </p>
        </div>
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default AppointmentPage;
