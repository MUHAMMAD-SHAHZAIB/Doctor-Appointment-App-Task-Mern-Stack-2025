
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import DoctorContext from "../../context/doctor/DoctorContext";
import DepartmentContext from "../../context/department/DepartmentContext";
import Card from "../common/Card";
import DoctorCard from "./DoctorCard";
import Loader from "../common/Loader";

const AppointmentBooking = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const doctorContext = useContext(DoctorContext);
  const departmentContext = useContext(DepartmentContext);
  const {
    doctors,
    getDoctors,
    getDoctorsByDepartment,
    loading: doctorsLoading,
  } = doctorContext;
  const {
    departments,
    getDepartments,
    loading: departmentsLoading,
  } = departmentContext;

  useEffect(() => {
    getDepartments();
    getDoctors();
    // eslint-disable-next-line
  }, []);

  const handleDepartmentChange = (e) => {
    const deptId = e.target.value;
    setSelectedDepartment(deptId);

    if (deptId) {
      getDoctorsByDepartment(deptId);
    } else {
      getDoctors();
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loading = doctorsLoading || departmentsLoading;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="appointment-booking">
      <Card title="Book an Appointment ">
        <p className="booking-intro">
          Choose a doctor from our specialists and book your appointment at a
          convenient time.
        </p>

        <div className="filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by doctor name or specialization"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="department-filter">
            <label htmlFor="department">Filter by Department:</label>
            <select
              id="department"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="doctors-grid">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} bookingMode={true} />
            ))
          ) : (
            <div className="no-results">
              <h3>No doctors found</h3>
              <p>
                Try adjusting your search criteria or select a different
                department.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AppointmentBooking;
