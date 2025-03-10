import express from "express";
import { check } from "express-validator";
import { protect, authorize } from "../middleware/auth.middleware.js";
const router = express.Router();
import {
  getAllAppointments,
  getAppointmentById,
  getDoctorAppointments,
  getPatientAppointments,
  createAppointment,
  updateAppointment,
  cancelAppointment,
} from "../controllers/appointment.controller.js";

// @route   GET /api/appointments
// @desc    Get all appointments
// @access  Private/Admin
router.get("/", [protect, authorize("admin")], getAllAppointments);

// @route   GET /api/appointments/:id
// @desc    Get appointment by ID
// @access  Private
router.get("/:id", protect, getAppointmentById);

// @route   GET /api/appointments/doctor/:doctorId
// @desc    Get appointments for a doctor
// @access  Private/Doctor/Admin
router.get(
  "/doctor/:doctorId",
  [protect, authorize("doctor", "admin")],
  getDoctorAppointments
);

// @route   GET /api/appointments/patient/:patientId
// @desc    Get appointments for a patient
// @access  Private/Patient/Admin
router.get("/patient/:patientId", protect, getPatientAppointments);

// @route   POST /api/appointments
// @desc    Book a new appointment
// @access  Private
router.post(
  "/",
  [
    protect,
    [
      check("doctorId", "Doctor ID is required").not().isEmpty(),
      check(
        "appointmentDate",
        "Valid appointment date is required"
      ).isISO8601(),
      check("slot", "Slot information is required").isObject(),
      check("slot.startTime", "Start time is required").not().isEmpty(),
      check("slot.endTime", "End time is required").not().isEmpty(),
    ],
  ],
  createAppointment
);

// @route   PUT /api/appointments/:id
// @desc    Update appointment status
// @access  Private/Doctor/Admin
router.put("/:id", [protect, authorize("doctor", "admin")], updateAppointment);

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete("/:id", protect, cancelAppointment);

export default router;
