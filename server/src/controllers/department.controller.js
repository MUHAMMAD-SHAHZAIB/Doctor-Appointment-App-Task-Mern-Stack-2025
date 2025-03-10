import Department from "../models/Department.js";
import { validationResult } from "express-validator";

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public

const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (error) {
    console.error("Get departments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get department by ID
// @route   GET /api/departments/:id
// @access  Public

const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json(department);
  } catch (error) {
    console.error("Get department error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new department
// @route   POST /api/departments
// @access  Private/Admin

const createDepartment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, icon } = req.body;

  try {
    // Check if department already exists
    let department = await Department.findOne({ name });
    if (department) {
      return res.status(400).json({ message: "Department already exists" });
    }

    // Create new department
    department = new Department({
      name,
      description,
      icon,
    });

    await department.save();
    res.status(201).json(department);
  } catch (error) {
    console.error("Create department error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin
const updateDepartment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, icon } = req.body;

  try {
    let department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Update fields
    if (name) department.name = name;
    if (description) department.description = description;
    if (icon) department.icon = icon;

    await department.save();
    res.json(department);
  } catch (error) {
    console.error("Update department error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Use deleteOne instead of deprecated remove() method
    await Department.deleteOne({ _id: department._id });
    res.json({ message: "Department removed successfully" });
  } catch (error) {
    console.error("Delete department error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
