
import React, { useReducer } from "react";
import axios from "axios";
import DepartmentContext from "./DepartmentContext";
import DepartmentReducer from "./DepartmentReducer";

const DepartmentState = (props) => {
  const initialState = {
    departments: [],
    currentDepartment: null,
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(DepartmentReducer, initialState);

  // Get all departments
  const getDepartments = async () => {
    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.get("/api/departments");
      dispatch({ type: "GET_DEPARTMENTS", payload: res.data });
    } catch (err) {
      dispatch({
        type: "DEPARTMENT_ERROR",
        payload: err.response?.data?.message || "Error fetching departments",
      });
    }
  };

  // Get department by ID
  const getDepartment = async (id) => {
    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.get(`/api/departments/${id}`);
      dispatch({ type: "GET_DEPARTMENT", payload: res.data });
    } catch (err) {
      dispatch({
        type: "DEPARTMENT_ERROR",
        payload: err.response?.data?.message || "Error fetching department",
      });
    }
  };

  // Add department (Admin only)
  const addDepartment = async (departmentData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.post("/api/departments", departmentData, config);
      dispatch({ type: "ADD_DEPARTMENT", payload: res.data });
      return true;
    } catch (err) {
      dispatch({
        type: "DEPARTMENT_ERROR",
        payload:
          err.response?.data?.message ||
          err.response?.data?.errors[0]?.msg ||
          "Error adding department",
      });
      return false;
    }
  };

  // Update department (Admin only)
  const updateDepartment = async (id, departmentData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.put(
        `/api/departments/${id}`,
        departmentData,
        config
      );
      dispatch({ type: "UPDATE_DEPARTMENT", payload: res.data });
      return true;
    } catch (err) {
      dispatch({
        type: "DEPARTMENT_ERROR",
        payload: err.response?.data?.message || "Error updating department",
      });
      return false;
    }
  };

  // Delete department (Admin only)
  const deleteDepartment = async (id) => {
    try {
      dispatch({ type: "SET_LOADING" });
      await axios.delete(`/api/departments/${id}`);
      dispatch({ type: "DELETE_DEPARTMENT", payload: id });
      return true;
    } catch (err) {
      dispatch({
        type: "DEPARTMENT_ERROR",
        payload: err.response?.data?.message || "Error deleting department",
      });
      return false;
    }
  };

  // Clear errors
  const clearErrors = () => dispatch({ type: "CLEAR_ERRORS" });

  return (
    <DepartmentContext.Provider
      value={{
        departments: state.departments,
        currentDepartment: state.currentDepartment,
        loading: state.loading,
        error: state.error,
        getDepartments,
        getDepartment,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        clearErrors,
      }}
    >
      {props.children}
    </DepartmentContext.Provider>
  );
};

export default DepartmentState;
