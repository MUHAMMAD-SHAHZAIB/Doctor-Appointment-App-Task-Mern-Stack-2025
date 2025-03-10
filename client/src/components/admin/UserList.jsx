
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth/AuthContext";
import AlertContext from "../../context/alert/AlertContext";
import Card from "../common/Card";
import Button from "../common/Button";
import Loader from "../common/Loader";
import Modal from "../common/Modal";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { getAllUsers, deleteUser, loading } = authContext;
  const { setAlert } = alertContext;

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getAllUsers();
      if (fetchedUsers) {
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      }
    };

    fetchUsers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Filter users based on search term and role
    let results = users;

    if (searchTerm) {
      results = results.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRole !== "all") {
      results = results.filter((user) => user.role === filterRole);
    }

    setFilteredUsers(results);
  }, [searchTerm, filterRole, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setFilterRole(e.target.value);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      const success = await deleteUser(userToDelete._id);

      if (success) {
        setAlert("User deleted successfully", "success");
        // Update users list
        setUsers(users.filter((user) => user._id !== userToDelete._id));
      }

      closeDeleteModal();
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="user-list-page">
      <div className="page-header">
        <h2>User Management</h2>
        <Link to="/admin/dashboard/users/add">
          <Button
            text="Add New User"
            variant="primary"
            icon={<i className="fas fa-user-plus"></i>}
          />
        </Link>
      </div>

      <Card>
        <div className="filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="role-filter">
            <select value={filterRole} onChange={handleRoleFilterChange}>
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="no-data">
            <p>No users found</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar small">
                          {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.name} />
                          ) : (
                            <div className="avatar-placeholder">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td>{user.phone || "N/A"}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/admin/dashboard/users/edit/${user._id}`}>
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
                          onClick={() => openDeleteModal(user)}
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
        title="Delete User"
        footer={
          <>
            <Button
              text="Cancel"
              variant="outline"
              onClick={closeDeleteModal}
            />
            <Button text="Delete" variant="danger" onClick={handleDeleteUser} />
          </>
        }
      >
        <p>Are you sure you want to delete this user?</p>
        {userToDelete && (
          <div className="delete-user-info">
            <p>
              <strong>Name:</strong> {userToDelete.name}
            </p>
            <p>
              <strong>Email:</strong> {userToDelete.email}
            </p>
            <p>
              <strong>Role:</strong> {userToDelete.role}
            </p>
          </div>
        )}
        <p className="warning">This action cannot be undone!</p>
      </Modal>
    </div>
  );
};

export default UserList;
