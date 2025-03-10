
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";
import AlertContext from "../../context/alert/AlertContext";
import Card from "../common/Card";
import Button from "../common/Button";
import Loader from "../common/Loader";
import {
  isValidEmail,
  isValidPhone,
  validateForm,
} from "../../utils/validation";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    phone: "",
    address: "",
    profilePicture: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { getAllUsers, createUser, updateUser, loading } = authContext;
  const { setAlert } = alertContext;

  useEffect(() => {
    const fetchUser = async () => {
      if (isEditMode) {
        const users = await getAllUsers();
        const user = users.find((u) => u._id === id);

        if (user) {
          setFormData({
            name: user.name,
            email: user.email,
            password: "", // Don't populate password for security
            role: user.role,
            phone: user.phone || "",
            address: user.address || "",
            profilePicture: user.profilePicture || "",
          });
        } else {
          navigate("/admin/dashboard/users");
          setAlert("User not found", "danger");
        }
      }
    };

    fetchUser();
    // eslint-disable-next-line
  }, [id, isEditMode]);

  const { name, email, password, role, phone, address, profilePicture } =
    formData;

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
      errors.name = "Name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Invalid email format";
    }

    if (!isEditMode && !password.trim()) {
      errors.password = "Password is required";
    } else if (password.trim() && password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (phone.trim() && !isValidPhone(phone)) {
      errors.phone = "Invalid phone number format";
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
      // Remove empty password when updating
      const userData = { ...formData };
      if (!userData.password.trim()) {
        delete userData.password;
      }

      success = await updateUser(id, userData);

      if (success) {
        setAlert("User updated successfully", "success");
        navigate("/admin/dashboard/users");
      }
    } else {
      success = await createUser(formData);

      if (success) {
        setAlert("User created successfully", "success");
        navigate("/admin/dashboard/users");
      }
    }
  };

  if (loading && isEditMode) {
    return <Loader />;
  }

  return (
    <div className="user-form-page">
      <div className="page-header">
        <h2>{isEditMode ? "Edit User" : "Add New User"}</h2>
        <Button
          text="Back to Users"
          variant="outline"
          onClick={() => navigate("/admin/dashboard/users")}
          icon={<i className="fas fa-arrow-left"></i>}
        />
      </div>

      <Card>
        <form onSubmit={onSubmit} className="form-grid">
          <div className="form-group">
            <label htmlFor="name">
              Name <span className="required">*</span>
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
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              className={formErrors.email ? "error" : ""}
            />
            {formErrors.email && (
              <div className="error-message">{formErrors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password {!isEditMode && <span className="required">*</span>}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder={
                isEditMode ? "Leave blank to keep current password" : ""
              }
              className={formErrors.password ? "error" : ""}
            />
            {formErrors.password && (
              <div className="error-message">{formErrors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role">
              Role <span className="required">*</span>
            </label>
            <select id="role" name="role" value={role} onChange={onChange}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={onChange}
              className={formErrors.phone ? "error" : ""}
            />
            {formErrors.phone && (
              <div className="error-message">{formErrors.phone}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={address}
              onChange={onChange}
              rows="3"
            ></textarea>
          </div>

          <div className="form-group full-width">
            <label htmlFor="profilePicture">Profile Picture URL</label>
            <input
              type="text"
              id="profilePicture"
              name="profilePicture"
              value={profilePicture}
              onChange={onChange}
              placeholder="Enter URL to profile picture"
            />
          </div>

          <div className="form-actions">
            <Button
              type="button"
              text="Cancel"
              variant="outline"
              onClick={() => navigate("/admin/dashboard/users")}
            />
            <Button
              type="submit"
              text={isEditMode ? "Update User" : "Create User"}
              variant="primary"
              disabled={loading}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UserForm;
