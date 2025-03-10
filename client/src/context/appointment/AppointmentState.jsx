
import React, { useReducer } from "react";
import axios from "axios";
import AppointmentContext from "./AppointmentContext";
import AppointmentReducer from "./AppointmentReducer";

const AppointmentState = (props) => {
  const initialState = {
    appointments: [],
    currentAppointment: null,
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(AppointmentReducer, initialState);

  // Get all appointments (Admin only)
  const getAllAppointments = async () => {
    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.get("/api/appointments");
      dispatch({ type: "GET_APPOINTMENTS", payload: res.data });
    } catch (err) {
      dispatch({
        type: "APPOINTMENT_ERROR",
        payload: err.response?.data?.message || "Error fetching appointments",
      });
    }
  };

  // Get appointment by ID
  const getAppointment = async (id) => {
    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.get(`/api/appointments/${id}`);
      dispatch({ type: "GET_APPOINTMENT", payload: res.data });
    } catch (err) {
      dispatch({
        type: "APPOINTMENT_ERROR",
        payload: err.response?.data?.message || "Error fetching appointment",
      });
    }
  };

  // Get appointments for a doctor
  const getDoctorAppointments = async (doctorId) => {
    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.get(`/api/appointments/doctor/${doctorId}`);
      dispatch({ type: "GET_DOCTOR_APPOINTMENTS", payload: res.data });
    } catch (err) {
      dispatch({
        type: "APPOINTMENT_ERROR",
        payload:
          err.response?.data?.message || "Error fetching doctor appointments",
      });
    }
  };

  // Get appointments for a patient
  const getPatientAppointments = async (patientId) => {
    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.get(`/api/appointments/patient/${patientId}`);
      dispatch({ type: "GET_PATIENT_APPOINTMENTS", payload: res.data });
    } catch (err) {
      dispatch({
        type: "APPOINTMENT_ERROR",
        payload:
          err.response?.data?.message || "Error fetching patient appointments",
      });
    }
  };

  // Create appointment
  const createAppointment = async (appointmentData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.post(
        "/api/appointments",
        appointmentData,
        config
      );
      dispatch({ type: "CREATE_APPOINTMENT", payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({
        type: "APPOINTMENT_ERROR",
        payload:
          err.response?.data?.message ||
          err.response?.data?.errors[0]?.msg ||
          "Error creating appointment",
      });
      return null;
    }
  };

  // Update appointment
  const updateAppointment = async (id, appointmentData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.put(
        `/api/appointments/${id}`,
        appointmentData,
        config
      );
      dispatch({ type: "UPDATE_APPOINTMENT", payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({
        type: "APPOINTMENT_ERROR",
        payload: err.response?.data?.message || "Error updating appointment",
      });
      return null;
    }
  };

  // Cancel appointment
  const cancelAppointment = async (id) => {
    try {
      dispatch({ type: "SET_LOADING" });
      const res = await axios.delete(`/api/appointments/${id}`);
      dispatch({ type: "CANCEL_APPOINTMENT", payload: { _id: id } });
      return true;
    } catch (err) {
      dispatch({
        type: "APPOINTMENT_ERROR",
        payload: err.response?.data?.message || "Error cancelling appointment",
      });
      return false;
    }
  };

  // Clear current appointment
  const clearCurrent = () => {
    dispatch({ type: "CLEAR_CURRENT" });
  };

  // Clear errors
  const clearErrors = () => dispatch({ type: "CLEAR_ERRORS" });

  return (
    <AppointmentContext.Provider
      value={{
        appointments: state.appointments,
        currentAppointment: state.currentAppointment,
        loading: state.loading,
        error: state.error,
        getAllAppointments,
        getAppointment,
        getDoctorAppointments,
        getPatientAppointments,
        createAppointment,
        updateAppointment,
        cancelAppointment,
        clearCurrent,
        clearErrors,
      }}
    >
      {props.children}
    </AppointmentContext.Provider>
  );
};

export default AppointmentState;
