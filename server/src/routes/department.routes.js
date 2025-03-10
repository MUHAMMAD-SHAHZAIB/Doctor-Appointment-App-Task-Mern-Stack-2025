import express from "express";
import { check } from "express-validator";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "../controllers/department.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
const router = express.Router();

// @route   GET /api/departments
// @desc    Get all departments
// @access  Public
router.get("/", getAllDepartments);

// @route   GET /api/departments/:id
// @desc    Get department by ID
// @access  Public
router.get("/:id", getDepartmentById);

// @route   POST /api/departments
// @desc    Create a new department
// @access  Private/Admin
router.post(
  "/",
  [
    protect,
    authorize("admin"),
    [
      check("name", "Name is required").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
    ],
  ],
  createDepartment
);

// @route   PUT /api/departments/:id
// @desc    Update department
// @access  Private/Admin
router.put(
  "/:id",
  [
    protect,
    authorize("admin"),
    [
      check("name", "Name is required").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
    ],
  ],
  updateDepartment
);

// @route   DELETE /api/departments/:id
// @desc    Delete department
// @access  Private/Admin
router.delete("/:id", [protect, authorize("admin")], deleteDepartment);

export default router;
