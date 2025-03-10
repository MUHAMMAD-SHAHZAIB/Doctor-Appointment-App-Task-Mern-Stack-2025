
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DoctorContext from "../../context/doctor/DoctorContext";
import DepartmentContext from "../../context/department/DepartmentContext";
import AuthContext from "../../context/auth/AuthContext";
import AlertContext from "../../context/alert/AlertContext";
import Card from "../common/Card";
import Button from "../common/Button";
import Loader from "../common/Loader";

const DoctorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    userId: "",
    departmentId: "",
    specialization: "",
    experience: "",
    qualifications: [""],
    bio: "",
    consultationFee: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [doctorUsers, setDoctorUsers] = useState([]);

  const doctorContext = useContext(DoctorContext);
  const departmentContext = useContext(DepartmentContext);
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const {
    getDoctor,
    createDoctor,
    updateDoctor,
    loading: doctorLoading,
  } = doctorContext;
  const {
    departments,
    getDepartments,
    loading: departmentLoading,
  } = departmentContext;
  const { getAllUsers, loading: userLoading } = authContext;
  const { setAlert } = alertContext;

  useEffect(() => {
    const fetchInitialData = async () => {
      getDepartments();

      // Get all users
      const users = await getAllUsers();

      // Filter users with role 'doctor' or patients that can be converted to doctors
      if (users) {
        const eligibleUsers = users.filter(
          (user) => user.role === "doctor" || user.role === "patient"
        );
        setDoctorUsers(eligibleUsers);
      }

      // If editing, fetch doctor data
      if (isEditMode) {
        await getDoctor(id);
      }
    };

    fetchInitialData();
    // eslint-disable-next-line
  }, [isEditMode, id]);

  useEffect(() => {
    if (isEditMode && doctorContext.currentDoctor) {
      const {
        userId,
        departmentId,
        specialization,
        experience,
        qualifications,
        bio,
        consultationFee,
      } = doctorContext.currentDoctor;

      setFormData({
        userId: userId._id,
        departmentId: departmentId._id,
        specialization: specialization || "",
        experience: experience || "",
        qualifications: qualifications.length ? qualifications : [""],
        bio: bio || "",
        consultationFee: consultationFee || "",
      });
    }
  }, [isEditMode, doctorContext.currentDoctor]);

  const {
    userId,
    departmentId,
    specialization,
    experience,
    qualifications,
    bio,
    consultationFee,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear error when field is changed
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  };

  const handleQualificationChange = (index, value) => {
    const updatedQualifications = [...qualifications];
    updatedQualifications[index] = value;
    setFormData({ ...formData, qualifications: updatedQualifications });
  };

  const addQualification = () => {
    setFormData({ ...formData, qualifications: [...qualifications, ""] });
  };

  const removeQualification = (index) => {
    const updatedQualifications = [...qualifications];
    updatedQualifications.splice(index, 1);
    setFormData({ ...formData, qualifications: updatedQualifications });
  };

  const validateFormData = () => {
    const errors = {};

    if (!userId) {
      errors.userId = "User is required";
    }

    if (!departmentId) {
      errors.departmentId = "Department is required";
    }

    if (!specialization.trim()) {
      errors.specialization = "Specialization is required";
    }

    if (!bio.trim()) {
      errors.bio = "Bio is required";
    }

    if (!consultationFee) {
      errors.consultationFee = "Consultation fee is required";
    } else if (isNaN(consultationFee) || Number(consultationFee) <= 0) {
      errors.consultationFee = "Consultation fee must be a positive number";
    }

    // Ensure at least one qualification is provided
    const validQualifications = qualifications.filter((q) => q.trim() !== "");
    if (validQualifications.length === 0) {
      errors.qualifications = "At least one qualification is required";
    }

    return errors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateFormData();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Remove empty qualifications
    const filteredQualifications = qualifications.filter(
      (q) => q.trim() !== ""
    );

    const doctorData = {
      ...formData,
      qualifications: filteredQualifications,
    };

    let success;

    if (isEditMode) {
      success = await updateDoctor(id, doctorData);

      if (success) {
        setAlert("Doctor profile updated successfully", "success");
        navigate("/admin/dashboard/doctors");
      }
    } else {
      success = await createDoctor(doctorData);

      if (success) {
        setAlert("Doctor profile created successfully", "success");
        navigate("/admin/dashboard/doctors");
      }
    }
  };

  const loading = doctorLoading || departmentLoading || userLoading;

  if (loading && isEditMode) {
    return <Loader />;
  }

  return (
    <div className="doctor-form-page">
      <div className="page-header">
        <h2>{isEditMode ? "Edit Doctor Profile" : "Add New Doctor"}</h2>
        <Button
          text="Back to Doctors"
          variant="outline"
          onClick={() => navigate("/admin/dashboard/doctors")}
          icon={<i className="fas fa-arrow-left"></i>}
        />
      </div>

      <Card>
        <form onSubmit={onSubmit} className="form-grid">
          <div className="form-group">
            <label htmlFor="userId">
              User <span className="required">*</span>
            </label>
            <select
              id="userId"
              name="userId"
              value={userId}
              onChange={onChange}
              className={formErrors.userId ? "error" : ""}
              disabled={isEditMode} // Can't change user once doctor profile is created
            >
              <option value="">Select User</option>
              {doctorUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email}) - {user.role}
                </option>
              ))}
            </select>
            {formErrors.userId && (
              <div className="error-message">{formErrors.userId}</div>
            )}
            {isEditMode && (
              <div className="form-note">
                User cannot be changed after creation
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="departmentId">
              Department <span className="required">*</span>
            </label>
            <select
              id="departmentId"
              name="departmentId"
              value={departmentId}
              onChange={onChange}
              className={formErrors.departmentId ? "error" : ""}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {formErrors.departmentId && (
              <div className="error-message">{formErrors.departmentId}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="specialization">
              Specialization <span className="required">*</span>
            </label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={specialization}
              onChange={onChange}
              className={formErrors.specialization ? "error" : ""}
              placeholder="e.g. Cardiologist, Pediatric Surgeon"
            />
            {formErrors.specialization && (
              <div className="error-message">{formErrors.specialization}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="experience">Years of Experience</label>
            <input
              type="number"
              id="experience"
              name="experience"
              value={experience}
              onChange={onChange}
              min="0"
              placeholder="Years of professional experience"
            />
          </div>

          <div className="form-group full-width">
            <label>
              Qualifications <span className="required">*</span>
            </label>
            {qualifications.map((qualification, index) => (
              <div key={index} className="qualification-input">
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) =>
                    handleQualificationChange(index, e.target.value)
                  }
                  placeholder="e.g. MD, MBBS, MS"
                  className={
                    formErrors.qualifications && index === 0 ? "error" : ""
                  }
                />
                {qualifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQualification(index)}
                    className="remove-btn"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addQualification}
              className="add-btn"
            >
              <i className="fas fa-plus"></i> Add Qualification
            </button>
            {formErrors.qualifications && (
              <div className="error-message">{formErrors.qualifications}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="consultationFee">
              Consultation Fee ($) <span className="required">*</span>
            </label>
            <input
              type="number"
              id="consultationFee"
              name="consultationFee"
              value={consultationFee}
              onChange={onChange}
              className={formErrors.consultationFee ? "error" : ""}
              min="0"
              step="0.01"
              placeholder="Enter consultation fee"
            />
            {formErrors.consultationFee && (
              <div className="error-message">{formErrors.consultationFee}</div>
            )}
          </div>

          <div className="form-group full-width">
            <label htmlFor="bio">
              Bio <span className="required">*</span>
            </label>
            <textarea
              id="bio"
              name="bio"
              value={bio}
              onChange={onChange}
              rows="5"
              className={formErrors.bio ? "error" : ""}
              placeholder="Professional bio and background"
            ></textarea>
            {formErrors.bio && (
              <div className="error-message">{formErrors.bio}</div>
            )}
          </div>

          <div className="form-actions">
            <Button
              type="button"
              text="Cancel"
              variant="outline"
              onClick={() => navigate("/admin/dashboard/doctors")}
            />
            <Button
              type="submit"
              text={
                isEditMode ? "Update Doctor Profile" : "Create Doctor Profile"
              }
              variant="primary"
              disabled={loading}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default DoctorForm;
