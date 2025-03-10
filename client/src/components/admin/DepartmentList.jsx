
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import DepartmentContext from "../../context/department/DepartmentContext";
import AlertContext from "../../context/alert/AlertContext";
import Card from "../common/Card";
import Button from "../common/Button";
import Loader from "../common/Loader";
import Modal from "../common/Modal";

const DepartmentList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  const departmentContext = useContext(DepartmentContext);
  const alertContext = useContext(AlertContext);
  const { departments, getDepartments, deleteDepartment, loading } =
    departmentContext;
  const { setAlert } = alertContext;

  useEffect(() => {
    getDepartments();
    // eslint-disable-next-line
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openDeleteModal = (department) => {
    setDepartmentToDelete(department);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDepartmentToDelete(null);
  };

  const handleDeleteDepartment = async () => {
    if (departmentToDelete) {
      const success = await deleteDepartment(departmentToDelete._id);

      if (success) {
        setAlert("Department deleted successfully", "success");
      }

      closeDeleteModal();
    }
  };

  // Filter departments based on search term
  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="department-list-page">
      <div className="page-header">
        <h2>Department Management</h2>
        <Link to="/admin/dashboard/departments/add">
          <Button
            text="Add Department"
            variant="primary"
            icon={<i className="fas fa-plus"></i>}
          />
        </Link>
      </div>

      <Card>
        <div className="filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search departments"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {filteredDepartments.length === 0 ? (
          <div className="no-data">
            <p>No departments found</p>
          </div>
        ) : (
          <div className="departments-grid">
            {filteredDepartments.map((department) => (
              <div key={department._id} className="department-card">
                <div className="department-icon">
                  <i className={`fas fa-${department.icon || "hospital"}`}></i>
                </div>
                <h3>{department.name}</h3>
                <p>{department.description}</p>
                <div className="department-actions">
                  <Link
                    to={`/admin/dashboard/departments/edit/${department._id}`}
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
                    onClick={() => openDeleteModal(department)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Department"
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
              onClick={handleDeleteDepartment}
            />
          </>
        }
      >
        <p>Are you sure you want to delete this department?</p>
        {departmentToDelete && (
          <div className="delete-department-info">
            <p>
              <strong>Department:</strong> {departmentToDelete.name}
            </p>
          </div>
        )}
        <p className="warning">
          This action cannot be undone! Deleting a department may affect doctors
          and appointments associated with it.
        </p>
      </Modal>
    </div>
  );
};

export default DepartmentList;
