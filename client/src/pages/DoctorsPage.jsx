
import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import DoctorContext from "../context/doctor/DoctorContext";
import DepartmentContext from "../context/department/DepartmentContext";
import AuthContext from "../context/auth/AuthContext";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import Header from "../components/common/Header";

const DoctorsPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const doctorContext = useContext(DoctorContext);
  const departmentContext = useContext(DepartmentContext);
  const authContext = useContext(AuthContext);

  const {
    doctors,
    getDoctors,
    getDoctorsByDepartment,
    loading: doctorLoading,
  } = doctorContext;
  const {
    departments,
    getDepartments,
    loading: departmentLoading,
  } = departmentContext;
  const { isAuthenticated, user } = authContext;

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getDepartments();

    // Check for department in query params
    const queryParams = new URLSearchParams(location.search);
    const deptId = queryParams.get("department");

    if (deptId) {
      setSelectedDepartment(deptId);
      getDoctorsByDepartment(deptId);
    } else {
      getDoctors();
    }
    // eslint-disable-next-line
  }, [location.search]);

  useEffect(() => {
    // Filter doctors based on search term
    if (doctors && doctors.length > 0) {
      const filtered = doctors.filter((doctor) => {
        return (
          doctor.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialization
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          doctor.departmentId.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      });
      setFilteredDoctors(filtered);
    }
  }, [searchTerm, doctors]);

  const handleDepartmentChange = (e) => {
    const deptId = e.target.value;
    setSelectedDepartment(deptId);

    // Update URL
    if (deptId) {
      navigate(`/doctors?department=${deptId}`);
    } else {
      navigate("/doctors");
      getDoctors();
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getBookingLink = (doctorId) => {
    if (isAuthenticated) {
      if (user.role === "patient") {
        return `/patient/dashboard/book/${doctorId}`;
      } else if (user.role === "admin") {
        return `/admin/dashboard/doctors/edit/${doctorId}`;
      } else {
        return "/login"; // For doctors, redirect to login as they can't book
      }
    } else {
      return "/login"; // Redirect to login for unauthenticated users
    }
  };

  const loading = doctorLoading || departmentLoading;

  return (
    <div className="doctors-page">
      <div className="container">
        <Header
          title="Our Doctors"
          subtitle="Find the right specialist for your healthcare needs"
        />

        <div className="filter-section">
          <Card>
            <div className="filter-row">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by name, specialization, or department"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <i className="fas fa-search search-icon"></i>
              </div>

              <div className="department-filter">
                <label htmlFor="department">Filter by Department:</label>
                <select
                  id="department"
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                >
                  <option value="">All Departments</option>
                  {!departmentLoading &&
                    departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </Card>
        </div>

        {loading ? (
          <div className="loading-container">
            <Loader />
          </div>
        ) : (
          <div className="doctors-container">
            {filteredDoctors.length === 0 ? (
              <div className="no-results">
                <Card>
                  <div className="no-results-content">
                    <i className="fas fa-user-md no-results-icon"></i>
                    <h3>No doctors found</h3>
                    <p>
                      Try adjusting your search criteria or select a different
                      department.
                    </p>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="doctors-grid">
                {filteredDoctors.map((doctor) => (
                  <Card key={doctor._id} className="doctor-card">
                    <div className="doctor-header">
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
                      <div className="doctor-info">
                        <h3>Dr. {doctor.userId.name}</h3>
                        <p className="doctor-specialization">
                          {doctor.specialization}
                        </p>
                        <div className="doctor-department">
                          <i className="fas fa-hospital-alt"></i>
                          <span>{doctor.departmentId.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="doctor-details">
                      <div className="doctor-qualification">
                        {doctor.qualifications
                          .slice(0, 3)
                          .map((qualification, index) => (
                            <span key={index} className="qualification-tag">
                              {qualification}
                            </span>
                          ))}
                        {doctor.qualifications.length > 3 && (
                          <span className="qualification-tag more">
                            +{doctor.qualifications.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="doctor-stats">
                        <div className="stat">
                          <i className="fas fa-user-md"></i>
                          <span>{doctor.experience || 0} years</span>
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

                      <div className="doctor-bio">
                        <p>{doctor.bio.substring(0, 150)}...</p>
                      </div>
                    </div>

                    <div className="doctor-actions">
                      <Link to={`/doctors/${doctor._id}`}>
                        <Button
                          text="View Profile"
                          variant="outline"
                          icon={<i className="fas fa-user-md"></i>}
                        />
                      </Link>
                      <Link to={getBookingLink(doctor._id)}>
                        <Button
                          text={
                            isAuthenticated && user.role === "patient"
                              ? "Book Appointment"
                              : "Login to Book"
                          }
                          variant="primary"
                          icon={<i className="fas fa-calendar-plus"></i>}
                        />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
