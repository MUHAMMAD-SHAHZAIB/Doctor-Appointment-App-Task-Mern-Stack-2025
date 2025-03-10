
import React from "react";
import { Link } from "react-router-dom";
import Button from "../common/Button";

const DoctorCard = ({ doctor, bookingMode = false }) => {
  return (
    <div className="doctor-card">
      <div className="doctor-image">
        {doctor.userId.profilePicture ? (
          <img src={doctor.userId.profilePicture} alt={doctor.userId.name} />
        ) : (
          <div className="avatar-placeholder">
            {doctor.userId.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="doctor-info">
        <h3>Dr. {doctor.userId.name}</h3>
        <p className="doctor-specialization">{doctor.specialization}</p>
        <p className="doctor-department">{doctor.departmentId.name}</p>
        <div className="doctor-qualification">
          {doctor.qualifications.slice(0, 3).map((qualification, index) => (
            <span key={index} className="qualification-tag">
              {qualification}
            </span>
          ))}
        </div>
        <div className="doctor-stats">
          <div className="stat">
            <i className="fas fa-user-md"></i>
            <span>{doctor.experience || 0} Years</span>
          </div>
          <div className="stat">
            <i className="fas fa-dollar-sign"></i>
            <span>${doctor.consultationFee}</span>
          </div>
          <div className="stat">
            <i className="fas fa-star"></i>
            <span>{doctor.averageRating || 0}</span>
          </div>
        </div>
      </div>
      <div className="doctor-actions">
        {bookingMode ? (
          <Link to={`/patient/dashboard/book/${doctor._id}`}>
            <Button text="Book Appointment" variant="primary" fullWidth />
          </Link>
        ) : (
          <Link to={`/patient/dashboard/book/${doctor._id}`}>
            <Button text="View Profile" variant="outline" fullWidth />
          </Link>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;
