
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user, logout } = authContext;
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const onLogout = () => {
    logout();
    navigate("/");
  };

  // Determine dashboard link based on user role
  const getDashboardLink = () => {
    if (user?.role === "admin") {
      return "/admin/dashboard";
    } else if (user?.role === "doctor") {
      return "/doctor/dashboard";
    } else {
      return "/patient/dashboard";
    }
  };

  const authLinks = (
    <>
      <li>
        <Link to={getDashboardLink()}>Dashboard</Link>
      </li>
      <li>
        <Link to="/doctors">Doctors</Link>
      </li>
      <li>
        <span className="user-name">
          <i className="fas fa-user"></i> {user?.name}
        </span>
      </li>
      <li>
        <a href="#!" onClick={onLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </a>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li>
        <Link to="/doctors">Doctors</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
    </>
  );

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            Doctor Appointment System
          </Link>
          <button
            className={`navbar-toggle ${isMenuOpen ? "open" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <ul className={`navbar-menu ${isMenuOpen ? "open" : ""}`}>
            <li>
              <Link to="/">Home</Link>
            </li>
            {isAuthenticated ? authLinks : guestLinks}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
