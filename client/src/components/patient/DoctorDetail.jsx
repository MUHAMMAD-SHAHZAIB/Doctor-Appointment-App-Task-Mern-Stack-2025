
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DoctorContext from "../../context/doctor/DoctorContext";
import AppointmentContext from "../../context/appointment/AppointmentContext";
import AlertContext from "../../context/alert/AlertContext";
import Card from "../common/Card";
import Button from "../common/Button";
import Loader from "../common/Loader";
import {
  formatDate,
  getDayOfWeek,
  isPastDate,
  formatDateForInput,
} from "../../utils/dateUtils";

const DoctorDetail = () => {
  const { doctorId } = useParams();
  console.log("shshaziab :", doctorId);
  const navigate = useNavigate();

  const [appointmentDate, setAppointmentDate] = useState("");

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [symptoms, setSymptoms] = useState("");

  const doctorContext = useContext(DoctorContext);
  const appointmentContext = useContext(AppointmentContext);
  const alertContext = useContext(AlertContext);

  const { getDoctor, currentDoctor, loading: doctorLoading } = doctorContext;
  const { createAppointment, loading: appointmentLoading } = appointmentContext;
  const { setAlert } = alertContext;

  console.log(currentDoctor);

  // Set min date to today
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  // Set max date to 3 months from now
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  useEffect(() => {
    getDoctor(doctorId);
    // eslint-disable-next-line
  }, [doctorId]);

  useEffect(() => {
    if (appointmentDate && currentDoctor && currentDoctor.availability) {
      const dayOfWeek = getDayOfWeek(appointmentDate);
      const dayAvailability = currentDoctor.availability.find(
        (day) => day.day === dayOfWeek
      );

      if (dayAvailability) {
        // Filter slots to remove those that are already booked
        const availableSlots = dayAvailability.slots.filter(
          (slot) => !slot.isBooked
        );
        setAvailableSlots(availableSlots);
      } else {
        setAvailableSlots([]);
      }

      // Clear selected slot when date changes
      setSelectedSlot(null);
    }
  }, [appointmentDate, currentDoctor]);

  const handleDateChange = (e) => {
    setAppointmentDate(e.target.value);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleSymptomsChange = (e) => {
    setSymptoms(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!appointmentDate) {
      setAlert("Please select a date", "danger");
      return;
    }

    if (!selectedSlot) {
      setAlert("Please select a time slot", "danger");
      return;
    }

    const appointmentData = {
      doctorId: currentDoctor._id,
      appointmentDate,
      slot: {
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      },
      symptoms,
    };

    const result = await createAppointment(appointmentData);

    if (result) {
      setAlert("Appointment booked successfully", "success");
      navigate("/patient/dashboard/appointments");
    }
  };

  if (doctorLoading || !currentDoctor) {
    return <Loader />;
  }

  return (
    <div className="doctor-detail-page">
      <Button
        text="Back to Doctors"
        variant="outline"
        onClick={() => navigate("/patient/dashboard/book")}
        icon={<i className="fas fa-arrow-left"></i>}
      />

      <div className="doctor-profile-section">
        <Card className="doctor-profile-card">
          <div className="doctor-header">
            <div className="doctor-image">
              {currentDoctor.userId.profilePicture ? (
                <img
                  src={currentDoctor.userId.profilePicture}
                  alt={currentDoctor.userId.name}
                />
              ) : (
                <div className="avatar-placeholder">
                  {currentDoctor.userId.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="doctor-basic-info">
              <h2>Dr. {currentDoctor.userId.name}</h2>
              <p className="doctor-specialization">
                {currentDoctor.specialization}
              </p>
              <p className="doctor-department">
                {currentDoctor.departmentId.name}
              </p>

              <div className="doctor-stats">
                <div className="stat">
                  <i className="fas fa-user-md"></i>
                  <span>{currentDoctor.experience || 0} Years Experience</span>
                </div>
                <div className="stat">
                  <i className="fas fa-dollar-sign"></i>
                  <span>${currentDoctor.consultationFee} Consultation Fee</span>
                </div>
                <div className="stat">
                  <i className="fas fa-star"></i>
                  <span>{currentDoctor.averageRating || 0} Rating</span>
                </div>
              </div>
            </div>
          </div>

          <div className="doctor-qualifications">
            <h3>Qualifications</h3>
            <div className="qualification-tags">
              {currentDoctor.qualifications.map((qualification, index) => (
                <span key={index} className="qualification-tag">
                  {qualification}
                </span>
              ))}
            </div>
          </div>

          <div className="doctor-bio">
            <h3>About Doctor</h3>
            <p>{currentDoctor.bio}</p>
          </div>
        </Card>
      </div>

      <div className="booking-section">
        <Card title="Book an Appointment">
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label htmlFor="appointmentDate">Select Date</label>
              <input
                type="date"
                id="appointmentDate"
                value={appointmentDate}
                onChange={handleDateChange}
                min={minDate}
                max={maxDateStr}
                required
              />
            </div>

            {appointmentDate && (
              <div className="time-slots-section">
                <h3>Available Time Slots</h3>
                {availableSlots.length > 0 ? (
                  <div className="time-slots">
                    {availableSlots.map((slot, index) => (
                      <div
                        key={index}
                        className={`time-slot ${
                          selectedSlot === slot ? "selected" : ""
                        }`}
                        onClick={() => handleSlotSelect(slot)}
                      >
                        {slot.startTime} - {slot.endTime}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-slots-message">
                    No available slots for this date. Please try another date.
                  </p>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="symptoms">Symptoms (Optional)</label>
              <textarea
                id="symptoms"
                value={symptoms}
                onChange={handleSymptomsChange}
                placeholder="Describe your symptoms or reason for visit"
                rows="4"
              ></textarea>
            </div>

            <Button
              type="submit"
              text="Book Appointment"
              variant="primary"
              fullWidth
              disabled={!appointmentDate || !selectedSlot || appointmentLoading}
            />
          </form>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDetail;
