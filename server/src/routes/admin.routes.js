import express from "express";
import { check } from "express-validator";
import { protect, authorize } from "../middleware/auth.middleware.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

// All routes here require admin role
router.use(protect, authorize("admin"));

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get("/users", getAllUsers);

// @route   GET /api/admin/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get("/users/:id", getUserById);

// @route   POST /api/admin/users
// @desc    Create a new user (admin, doctor, patient)
// @access  Private/Admin
router.post(
  "/users",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("role", "Role is required").isIn(["admin", "doctor", "patient"]),
  ],
  createUser
);

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private/Admin
router.put(
  "/users/:id",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
  ],
  updateUser
);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete("/users/:id", deleteUser);

export default router;
