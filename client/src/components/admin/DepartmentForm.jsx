
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DepartmentContext from "../../context/department/DepartmentContext";
import AlertContext from "../../context/alert/AlertContext";
import Card from "../common/Card";
import Button from "../common/Button";
import Loader from "../common/Loader";

const DepartmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const departmentContext = useContext(DepartmentContext);
  const alertContext = useContext(AlertContext);
  const { getDepartment, addDepartment, updateDepartment, loading } =
    departmentContext;
  const { setAlert } = alertContext;

  useEffect(() => {
    const fetchDepartment = async () => {
      if (isEditMode) {
        await getDepartment(id);
      }
    };

    fetchDepartment();
    // eslint-disable-next-line
  }, [isEditMode, id]);

  useEffect(() => {
    if (isEditMode && departmentContext.currentDepartment) {
      const { name, description, icon } = departmentContext.currentDepartment;
      setFormData({
        name: name || "",
        description: description || "",
        icon: icon || "",
      });
    }
  }, [isEditMode, departmentContext.currentDepartment]);

  const { name, description, icon } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Clear error when field is changed
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  };

  const validateFormData = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Department name is required";
    }

    if (!description.trim()) {
      errors.description = "Description is required";
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

    let success;

    if (isEditMode) {
      success = await updateDepartment(id, formData);

      if (success) {
        setAlert("Department updated successfully", "success");
        navigate("/admin/dashboard/departments");
      }
    } else {
      success = await addDepartment(formData);

      if (success) {
        setAlert("Department created successfully", "success");
        navigate("/admin/dashboard/departments");
      }
    }
  };

  // Common icon options
  const iconOptions = [
    { value: "hospital", label: "Hospital" },
    { value: "heartbeat", label: "Cardiology" },
    { value: "brain", label: "Neurology" },
    { value: "tooth", label: "Dental" },
    { value: "eye", label: "Ophthalmology" },
    { value: "bone", label: "Orthopedics" },
    { value: "stethoscope", label: "General" },
    { value: "flask", label: "Laboratory" },
    { value: "x-ray", label: "Radiology" },
    { value: "baby", label: "Pediatrics" },
  ];

  if (loading && isEditMode) {
    return <Loader />;
  }

  return (
    <div className="department-form-page">
      <div className="page-header">
        <h2>{isEditMode ? "Edit Department" : "Add New Department"}</h2>
        <Button
          text="Back to Departments"
          variant="outline"
          onClick={() => navigate("/admin/dashboard/departments")}
          icon={<i className="fas fa-arrow-left"></i>}
        />
      </div>

      <Card>
        <form onSubmit={onSubmit} className="form-grid">
          <div className="form-group">
            <label htmlFor="name">
              Department Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              className={formErrors.name ? "error" : ""}
            />
            {formErrors.name && (
              <div className="error-message">{formErrors.name}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={onChange}
              rows="4"
              className={formErrors.description ? "error" : ""}
            ></textarea>
            {formErrors.description && (
              <div className="error-message">{formErrors.description}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="icon">Icon</label>
            <select id="icon" name="icon" value={icon} onChange={onChange}>
              <option value="">Select an icon</option>
              {iconOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {icon && (
              <div className="icon-preview">
                <i className={`fas fa-${icon}`}></i>
                <span>Icon Preview</span>
              </div>
            )}
          </div>

          <div className="form-actions">
            <Button
              type="button"
              text="Cancel"
              variant="outline"
              onClick={() => navigate("/admin/dashboard/departments")}
            />
            <Button
              type="submit"
              text={isEditMode ? "Update Department" : "Create Department"}
              variant="primary"
              disabled={loading}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default DepartmentForm;
