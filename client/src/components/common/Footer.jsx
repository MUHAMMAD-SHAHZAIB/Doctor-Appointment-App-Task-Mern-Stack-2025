
import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Doctor Appointment System</h3>
            <p>Book appointments with the best doctors in your area.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/doctors">Doctors</a>
              </li>
              <li>
                <a href="/login">Login</a>
              </li>
              <li>
                <a href="/register">Register</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: info@doctorapp.com</p>
            <p>Phone: +1 123 456 7890</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {year} Doctor Appointment System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
