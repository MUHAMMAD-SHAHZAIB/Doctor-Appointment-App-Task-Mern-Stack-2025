
import React, { useReducer } from "react";
import axios from "axios";
import DoctorContext from "./DoctorContext";
import DoctorReducer from "./DoctorReducer";

const DoctorState = (props) => {
  const initialState = {
    doctors: [],
    currentDoctor: null,
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(DoctorReducer, initialState);

  // Get all doctors
  const getDoctors = async () => {
    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.get("/api/doctors");
      dispatch({ type: "GET_DOCTORS", payload: res.data });
    } catch (err) {
      dispatch({
        type: "DOCTOR_ERROR",
        payload: err.response?.data?.message || "Error fetching doctors",
      });
    }
  };

  // Get doctor by ID
  const getDoctor = async (id) => {
    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.get(`/api/doctors/${id}`);
      dispatch({ type: "GET_DOCTOR", payload: res.data });
    } catch (err) {
      dispatch({
        type: "DOCTOR_ERROR",
        payload: err.response?.data?.message || "Error fetching doctor",
      });
    }
  };

  // Get doctors by department
  const getDoctorsByDepartment = async (departmentId) => {
    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.get(`/api/doctors/department/${departmentId}`);
      dispatch({ type: "GET_DOCTORS_BY_DEPARTMENT", payload: res.data });
    } catch (err) {
      dispatch({
        type: "DOCTOR_ERROR",
        payload:
          err.response?.data?.message || "Error fetching doctors by department",
      });
    }
  };

  // Create doctor (Admin only)
  const createDoctor = async (doctorData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.post("/api/doctors", doctorData, config);
      dispatch({ type: "ADD_DOCTOR", payload: res.data });
      return true;
    } catch (err) {
      dispatch({
        type: "DOCTOR_ERROR",
        payload:
          err.response?.data?.message ||
          err.response?.data?.errors[0]?.msg ||
          "Error creating doctor profile",
      });
      return false;
    }
  };

  // Update doctor
  const updateDoctor = async (id, doctorData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.put(`/api/doctors/${id}`, doctorData, config);
      dispatch({ type: "UPDATE_DOCTOR", payload: res.data });
      return true;
    } catch (err) {
      dispatch({
        type: "DOCTOR_ERROR",
        payload: err.response?.data?.message || "Error updating doctor profile",
      });
      return false;
    }
  };

  // Update doctor availability
  const updateAvailability = async (id, availabilityData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.put(
        `/api/doctors/${id}/availability`,
        { availability: availabilityData },
        config
      );
      dispatch({ type: "UPDATE_AVAILABILITY", payload: res.data });
      return true;
    } catch (err) {
      dispatch({
        type: "DOCTOR_ERROR",
        payload: err.response?.data?.message || "Error updating availability",
      });
      return false;
    }
  };

  // Delete doctor (Admin only)
  const deleteDoctor = async (id) => {
    try {
      dispatch({ type: "SET_LOADING" });
      await axios.delete(`/api/doctors/${id}`);
      dispatch({ type: "DELETE_DOCTOR", payload: id });
      return true;
    } catch (err) {
      dispatch({
        type: "DOCTOR_ERROR",
        payload: err.response?.data?.message || "Error deleting doctor",
      });
      return false;
    }
  };

  // Get current doctor profile (for logged in doctor)
  const getCurrentDoctorProfile = async (userId) => {
    try {
      dispatch({ type: "SET_LOADING" });
      // First get all doctors
      const res = await axios.get("/api/doctors");
      // Find the one with matching userId
      const doctorProfile = res.data.find(
        (doctor) => doctor.userId._id === userId
      );

      if (doctorProfile) {
        dispatch({ type: "GET_DOCTOR", payload: doctorProfile });
        return doctorProfile;
      } else {
        dispatch({
          type: "DOCTOR_ERROR",
          payload: "Doctor profile not found",
        });
        return null;
      }
    } catch (err) {
      dispatch({
        type: "DOCTOR_ERROR",
        payload: err.response?.data?.message || "Error fetching doctor profile",
      });
      return null;
    }
  };

  // Clear errors
  const clearErrors = () => dispatch({ type: "CLEAR_ERRORS" });

  return (
    <DoctorContext.Provider
      value={{
        doctors: state.doctors,
        currentDoctor: state.currentDoctor,
        loading: state.loading,
        error: state.error,
        getDoctors,
        getDoctor,
        getDoctorsByDepartment,
        createDoctor,
        updateDoctor,
        updateAvailability,
        deleteDoctor,
        getCurrentDoctorProfile,
        clearErrors,
      }}
    >
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorState;
