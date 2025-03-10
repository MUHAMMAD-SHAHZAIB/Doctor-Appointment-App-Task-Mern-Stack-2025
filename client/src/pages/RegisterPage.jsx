
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/auth/AuthContext";
import AlertContext from "../context/alert/AlertContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import {
  isValidEmail,
  isValidPassword,
  isValidPhone,
} from "../utils/validation";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    phone: "",
    address: "",
  });
  const { name, email, password, password2, phone, address } = formData;

  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { register, error, clearErrors, isAuthenticated, loading } =
    authContext;
  const { setAlert } = alertContext;
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/dashboard");
    }

    if (error) {
      setAlert(error, "danger");
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (name === "" || email === "" || password === "") {
      setAlert("Please fill in all required fields", "danger");
    } else if (!isValidEmail(email)) {
      setAlert("Please enter a valid email", "danger");
    } else if (!isValidPassword(password)) {
      setAlert("Password must be at least 6 characters", "danger");
    } else if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else if (phone && !isValidPhone(phone)) {
      setAlert("Please enter a valid phone number", "danger");
    } else {
      register({
        name,
        email,
        password,
        phone,
        address,
      });
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container auth-container">
      <Card title="Register Account" className="auth-card">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={onChange}
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password2">
              Confirm Password <span className="required">*</span>
            </label>
            <input
              type="password"
              name="password2"
              id="password2"
              value={password2}
              onChange={onChange}
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={phone}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              name="address"
              id="address"
              value={address}
              onChange={onChange}
              rows="3"
            ></textarea>
          </div>
          <p className="form-text">
            <span className="required">*</span> Required fields
          </p>
          <Button
            type="submit"
            text="Register"
            variant="primary"
            fullWidth={true}
          />
        </form>
        <p className="auth-redirect">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
