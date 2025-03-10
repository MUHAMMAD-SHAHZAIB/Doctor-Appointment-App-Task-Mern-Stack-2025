import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate("userId", "name email profilePicture")
      .populate("departmentId", "name")
      .sort({ createdAt: -1 });

    res.json(doctors);
  } catch (error) {
    console.error("Get doctors error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("userId", "name email profilePicture")
      .populate("departmentId", "name description");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    console.error("Get doctor error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get doctors by department
// @route   GET /api/doctors/department/:departmentId
// @access  Public

const getDoctorsByDepartment = async (req, res) => {
  try {
    const doctors = await Doctor.find({ departmentId: req.params.departmentId })
      .populate("userId", "name email profilePicture")
      .populate("departmentId", "name");

    res.json(doctors);
  } catch (error) {
    console.error("Get doctors by department error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new doctor profile
// @route   POST /api/doctors
// @access  Private/Admin
const createDoctor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    userId,
    departmentId,
    specialization,
    experience,
    qualifications,
    bio,
    consultationFee,
    availability,
  } = req.body;

  try {
    // Check if user making the request is an admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to create doctor profiles" });
    }

    // Validate and convert userId to ObjectId if it's a string
    let userIdObj = userId;
    if (typeof userId === "string" && mongoose.Types.ObjectId.isValid(userId)) {
      userIdObj = new mongoose.Types.ObjectId(userId);
    }

    // Check if doctor profile already exists for this user
    let doctor = await Doctor.findOne({ userId: userIdObj });
    if (doctor) {
      return res
        .status(400)
        .json({ message: "Doctor profile already exists for this user" });
    }

    // Verify user exists
    const user = await User.findById(userIdObj);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user role to doctor if they're not already
    if (user.role !== "doctor") {
      user.role = "doctor";
      await user.save();
    }

    // Create new doctor profile
    doctor = new Doctor({
      userId: userIdObj,
      departmentId,
      specialization,
      experience: experience || 0,
      qualifications,
      bio,
      consultationFee,
      availability: availability || [],
    });

    await doctor.save();

    // Populate the doctor info before sending response
    const populatedDoctor = await Doctor.findById(doctor._id)
      .populate("userId", "name email profilePicture")
      .populate("departmentId", "name");

    res.status(201).json(populatedDoctor);
  } catch (error) {
    console.error("Create doctor error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private/Admin/Doctor

const updateDoctor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    departmentId,
    specialization,
    experience,
    qualifications,
    bio,
    consultationFee,
  } = req.body;

  try {
    let doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check authorization
    if (
      req.user.role !== "admin" &&
      doctor.userId.toString() !== req.user.id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this doctor profile" });
    }

    // Update fields
    if (departmentId) doctor.departmentId = departmentId;
    if (specialization) doctor.specialization = specialization;
    if (experience !== undefined) doctor.experience = experience;
    if (qualifications) doctor.qualifications = qualifications;
    if (bio) doctor.bio = bio;
    if (consultationFee) doctor.consultationFee = consultationFee;

    await doctor.save();

    // Populate the doctor info before sending response
    const populatedDoctor = await Doctor.findById(doctor._id)
      .populate("userId", "name email profilePicture")
      .populate("departmentId", "name");

    res.json(populatedDoctor);
  } catch (error) {
    console.error("Update doctor error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update doctor availability
// @route   PUT /api/doctors/:id/availability
// @access  Private/Admin/Doctor

const updateAvailability = async (req, res) => {
  const { availability } = req.body;

  try {
    let doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check authorization
    if (
      req.user.role !== "admin" &&
      doctor.userId.toString() !== req.user.id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this doctor profile" });
    }

    doctor.availability = availability;
    await doctor.save();

    // Populate the doctor info before sending response
    const populatedDoctor = await Doctor.findById(doctor._id)
      .populate("userId", "name email profilePicture")
      .populate("departmentId", "name");

    res.json(populatedDoctor);
  } catch (error) {
    console.error("Update availability error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private/Admin
const deleteDoctor = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to delete doctor profiles" });
    }

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Use deleteOne instead of remove (which is deprecated)
    await Doctor.deleteOne({ _id: doctor._id });

    res.json({ message: "Doctor profile removed successfully" });
  } catch (error) {
    console.error("Delete doctor error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getAllDoctors,
  getDoctorById,
  getDoctorsByDepartment,
  createDoctor,
  updateDoctor,
  updateAvailability,
  deleteDoctor,
};
