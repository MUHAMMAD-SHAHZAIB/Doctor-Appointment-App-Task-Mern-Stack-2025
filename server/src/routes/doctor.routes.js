import express from "express";
import { check } from "express-validator";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  getAllDoctors,
  getDoctorById,
  getDoctorsByDepartment,
  createDoctor,
  updateDoctor,
  updateAvailability,
  deleteDoctor,
} from "../controllers/doctor.controller.js";
const router = express.Router();

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get("/", getAllDoctors);

// @route   GET /api/doctors/:id
// @desc    Get doctor by ID
// @access  Public
router.get("/:id", getDoctorById);

// @route   GET /api/doctors/department/:departmentId
// @desc    Get doctors by department
// @access  Public
router.get("/department/:departmentId", getDoctorsByDepartment);

// @route   POST /api/doctors
// @desc    Create a new doctor profile
// @access  Private/Admin

router.post(
  "/",
  [
    protect,
    authorize("admin"),
    [
      check("userId", "User ID is required").not().isEmpty(),
      check("departmentId", "Department ID is required").not().isEmpty(),
      check("specialization", "Specialization is required").not().isEmpty(),
      check("qualifications", "Qualifications are required").isArray({
        min: 1,
      }),
      check("bio", "Bio is required").not().isEmpty(),
      check("consultationFee", "Consultation fee is required").isNumeric(),
    ],
  ],
  createDoctor
);

// @route   PUT /api/doctors/:id
// @desc    Update doctor profile
// @access  Private/Admin/Doctor
router.put(
  "/:id",
  [
    protect,
    authorize("admin", "doctor"),
    [
      check("specialization", "Specialization is required").not().isEmpty(),
      check("bio", "Bio is required").not().isEmpty(),
      check("consultationFee", "Consultation fee is required").isNumeric(),
    ],
  ],
  updateDoctor
);

// @route   PUT /api/doctors/:id/availability
// @desc    Update doctor availability
// @access  Private/Admin/Doctor

router.put(
  "/:id/availability",
  [
    protect,
    authorize("admin", "doctor"),
    [check("availability", "Availability is required").isArray({ min: 1 })],
  ],
  updateAvailability
);

// @route   DELETE /api/doctors/:id
// @desc    Delete doctor
// @access  Private/Admin
router.delete("/:id", [protect, authorize("admin")], deleteDoctor);

export default router;
