
import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/auth/AuthContext";
import DepartmentContext from "../context/department/DepartmentContext";
import DoctorContext from "../context/doctor/DoctorContext";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Loader from "../components/common/Loader";

const HomePage = () => {
  const authContext = useContext(AuthContext);
  const departmentContext = useContext(DepartmentContext);
  const doctorContext = useContext(DoctorContext);

  const { isAuthenticated, user } = authContext;
  const {
    departments,
    getDepartments,
    loading: deptLoading,
  } = departmentContext;
  const { doctors, getDoctors, loading: doctorLoading } = doctorContext;

  useEffect(() => {
    getDepartments();
    getDoctors();
    // eslint-disable-next-line
  }, []);

  // Redirect to appropriate dashboard if already logged in
  if (isAuthenticated && user) {
    let dashboardPath = "/dashboard";
    if (user.role === "admin") {
      dashboardPath = "/admin/dashboard";
    } else if (user.role === "doctor") {
      dashboardPath = "/doctor/dashboard";
    } else {
      dashboardPath = "/patient/dashboard";
    }

    return (
      <div className="redirect-container">
        <p>You are already logged in. Redirecting to your dashboard...</p>
        <Link to={dashboardPath}>
          <Button text="Go to Dashboard" variant="primary" />
        </Link>
      </div>
    );
  }

  const loading = deptLoading || doctorLoading;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1>Your Health Is Our Priority</h1>
            <p>
              Book appointments with the best doctors in your area. Get the care
              you deserve from the comfort of your home.
            </p>
            <div className="hero-buttons">
              <Link to="/doctors">
                <Button text="Find a Doctor" variant="primary" size="large" />
              </Link>
              <Link to="/register">
                <Button text="Register Now" variant="secondary" size="large" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="departments-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Medical Departments</h2>
            <p>Specialized care for all your health needs</p>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="departments-grid">
              {departments.slice(0, 4).map((department) => (
                <Card key={department._id} className="department-card">
                  <div className="department-icon">
                    <i
                      className={`fas fa-${department.icon || "stethoscope"}`}
                    ></i>
                  </div>
                  <h3>{department.name}</h3>
                  <p>{department.description}</p>
                  <Link to={`/doctors?department=${department._id}`}>
                    <Button text="View Doctors" variant="outline" />
                  </Link>
                </Card>
              ))}
            </div>
          )}

          <div className="view-all-link">
            <Link to="/doctors">View All Departments</Link>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="featured-doctors-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Top Doctors</h2>
            <p>Experienced specialists ready to help you</p>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="doctors-slider">
              {doctors.slice(0, 3).map((doctor) => (
                <Card key={doctor._id} className="doctor-slider-card">
                  <div className="doctor-image">
                    {doctor.userId.profilePicture ? (
                      <img
                        src={doctor.userId.profilePicture}
                        alt={doctor.userId.name}
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {doctor.userId.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3>Dr. {doctor.userId.name}</h3>
                  <p className="doctor-specialty">{doctor.specialization}</p>
                  <p className="doctor-department">
                    {doctor.departmentId.name}
                  </p>
                  <Link to={`/doctors/${doctor._id}`}>
                    <Button text="View Profile" variant="outline" />
                  </Link>
                </Card>
              ))}
            </div>
          )}

          <div className="view-all-link">
            <Link to="/doctors">View All Doctors</Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple steps to get the care you need</p>
          </div>

          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Find a Doctor</h3>
              <p>Browse through our list of qualified doctors</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Book Appointment</h3>
              <p>Select a convenient time slot and book your appointment</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Consultation</h3>
              <p>Meet your doctor online or in-person</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Patients Say</h2>
            <p>Real experiences from satisfied patients</p>
          </div>

          <div className="testimonials-grid">
            <Card className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "The doctors here are amazing! I was able to book an
                  appointment quickly and got the care I needed without any
                  hassle."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="avatar-placeholder">J</div>
                <div className="author-info">
                  <h4>John Smith</h4>
                  <p>Patient</p>
                </div>
              </div>
            </Card>

            <Card className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "The online booking system is so convenient. I could see all
                  the available slots and choose what worked best for my
                  schedule."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="avatar-placeholder">S</div>
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <p>Patient</p>
                </div>
              </div>
            </Card>

            <Card className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  "I appreciate how easy it is to manage my appointments. The
                  reminders are helpful and rescheduling is seamless."
                </p>
              </div>
              <div className="testimonial-author">
                <div className="avatar-placeholder">M</div>
                <div className="author-info">
                  <h4>Michael Brown</h4>
                  <p>Patient</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to get started?</h2>
            <p>
              Register now and book your first appointment with one of our
              specialists.
            </p>
            <Link to="/register">
              <Button text="Register Now" variant="primary" size="large" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
