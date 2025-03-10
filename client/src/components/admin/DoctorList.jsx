
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import DoctorContext from "../../context/doctor/DoctorContext";
import DepartmentContext from "../../context/department/DepartmentContext";
import AlertContext from "../../context/alert/AlertContext";
import Card from "../common/Card";
import Button from "../common/Button";
import Loader from "../common/Loader";
import Modal from "../common/Modal";

const DoctorList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const doctorContext = useContext(DoctorContext);
  const departmentContext = useContext(DepartmentContext);
  const alertContext = useContext(AlertContext);

  const {
    doctors,
    getDoctors,
    deleteDoctor,
    loading: doctorLoading,
  } = doctorContext;
  const {
    departments,
    getDepartments,
    loading: departmentLoading,
  } = departmentContext;
  const { setAlert } = alertContext;

  useEffect(() => {
    getDoctors();
    getDepartments();
    // eslint-disable-next-line
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const openDeleteModal = (doctor) => {
    setDoctorToDelete(doctor);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDoctorToDelete(null);
  };

  const handleDeleteDoctor = async () => {
    if (doctorToDelete) {
      const success = await deleteDoctor(doctorToDelete._id);

      if (success) {
        setAlert("Doctor profile deleted successfully", "success");
      }

      closeDeleteModal();
    }
  };

  // Filter doctors based on search term and department
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "" ||
      doctor.departmentId._id === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const loading = doctorLoading || departmentLoading;

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="doctor-list-page">
      <div className="page-header">
        <h2>Doctor Management</h2>
        <Link to="/admin/dashboard/doctors/add">
          <Button
            text="Add Doctor"
            variant="primary"
            icon={<i className="fas fa-user-md"></i>}
          />
        </Link>
      </div>

      <Card>
        <div className="filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name or specialization"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="department-filter">
            <select
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

        {filteredDoctors.length === 0 ? (
          <div className="no-data">
            <p>No doctors found</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Department</th>
                  <th>Experience</th>
                  <th>Fee</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar small">
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
                        <span>Dr. {doctor.userId.name}</span>
                      </div>
                    </td>
                    <td>{doctor.specialization}</td>
                    <td>{doctor.departmentId.name}</td>
                    <td>{doctor.experience || 0} years</td>
                    <td>${doctor.consultationFee}</td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/admin/dashboard/doctors/edit/${doctor._id}`}
                        >
                          <Button
                            text="Edit"
                            variant="outline"
                            size="small"
                            icon={<i className="fas fa-edit"></i>}
                          />
                        </Link>
                        <Button
                          text="Delete"
                          variant="danger"
                          size="small"
                          icon={<i className="fas fa-trash"></i>}
                          onClick={() => openDeleteModal(doctor)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Doctor Profile"
        footer={
          <>
            <Button
              text="Cancel"
              variant="outline"
              onClick={closeDeleteModal}
            />
            <Button
              text="Delete"
              variant="danger"
              onClick={handleDeleteDoctor}
            />
          </>
        }
      >
        <p>Are you sure you want to delete this doctor profile?</p>
        {doctorToDelete && (
          <div className="delete-doctor-info">
            <p>
              <strong>Doctor:</strong> Dr. {doctorToDelete.userId.name}
            </p>
            <p>
              <strong>Specialization:</strong> {doctorToDelete.specialization}
            </p>
            <p>
              <strong>Department:</strong> {doctorToDelete.departmentId.name}
            </p>
          </div>
        )}
        <p className="warning">
          This action cannot be undone! This will only delete the doctor
          profile, not the user account.
        </p>
      </Modal>
    </div>
  );
};

export default DoctorList;
