
import React, { useState, useEffect, useContext } from "react";
import DoctorContext from "../../context/doctor/DoctorContext";
import DepartmentContext from "../../context/department/DepartmentContext";
import AlertContext from "../../context/alert/AlertContext";
import Card from "../common/Card";
import Button from "../common/Button";
import Loader from "../common/Loader";

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    specialization: "",
    bio: "",
    experience: "",
    qualifications: [""],
    consultationFee: "",
  });

  const doctorContext = useContext(DoctorContext);
  const departmentContext = useContext(DepartmentContext);
  const alertContext = useContext(AlertContext);

  const { currentDoctor, updateDoctor, loading } = doctorContext;
  const {
    departments,
    getDepartments,
    loading: deptLoading,
  } = departmentContext;
  const { setAlert } = alertContext;

  useEffect(() => {
    getDepartments();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (currentDoctor) {
      setFormData({
        departmentId: currentDoctor.departmentId._id,
        specialization: currentDoctor.specialization || "",
        bio: currentDoctor.bio || "",
        experience: currentDoctor.experience || "",
        qualifications: currentDoctor.qualifications.length
          ? currentDoctor.qualifications
          : [""],
        consultationFee: currentDoctor.consultationFee || "",
      });
    }
  }, [currentDoctor]);

  const {
    departmentId,
    specialization,
    bio,
    experience,
    qualifications,
    consultationFee,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const onSubmit = async (e) => {
    e.preventDefault();

    // Remove empty qualifications
    const filteredQualifications = qualifications.filter(
      (q) => q.trim() !== ""
    );

    if (filteredQualifications.length === 0) {
      setAlert("Please add at least one qualification", "danger");
      return;
    }

    const updatedData = {
      ...formData,
      qualifications: filteredQualifications,
    };

    const success = await updateDoctor(currentDoctor._id, updatedData);

    if (success) {
      setAlert("Profile updated successfully", "success");
    }
  };

  if (loading || deptLoading) {
    return <Loader />;
  }

  return (
    <Card title="Update Doctor Profile">
      <form onSubmit={onSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="departmentId">Department</label>
          <select
            name="departmentId"
            id="departmentId"
            value={departmentId}
            onChange={onChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="specialization">Specialization</label>
          <input
            type="text"
            name="specialization"
            id="specialization"
            value={specialization}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience">Years of Experience</label>
          <input
            type="number"
            name="experience"
            id="experience"
            value={experience}
            onChange={onChange}
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Qualifications</label>
          {qualifications.map((qualification, index) => (
            <div key={index} className="qualification-input">
              <input
                type="text"
                value={qualification}
                onChange={(e) =>
                  handleQualificationChange(index, e.target.value)
                }
                placeholder="e.g. MD, MBBS, MS"
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
          <button type="button" onClick={addQualification} className="add-btn">
            <i className="fas fa-plus"></i> Add Qualification
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="consultationFee">Consultation Fee ($)</label>
          <input
            type="number"
            name="consultationFee"
            id="consultationFee"
            value={consultationFee}
            onChange={onChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            name="bio"
            id="bio"
            value={bio}
            onChange={onChange}
            rows="5"
            required
          ></textarea>
        </div>

        <Button type="submit" text="Update Profile" variant="primary" />
      </form>
    </Card>
  );
};

export default ProfileForm;
