import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import { validationResult } from "express-validator";

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate({
        path: "doctorId",
        select: "specialization consultationFee",
        populate: {
          path: "userId",
          select: "name email profilePicture",
        },
      })
      .populate({
        path: "patientId",
        select: "name email phone",
      })
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get appointment by ID
// @route   GET /api/appointments/:id
// @access  Private

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: "doctorId",
        select: "specialization consultationFee",
        populate: {
          path: "userId",
          select: "name email profilePicture",
        },
      })
      .populate({
        path: "patientId",
        select: "name email phone",
      });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if user is authorized to view this appointment
    if (
      req.user.role !== "admin" &&
      appointment.patientId._id.toString() !== req.user.id &&
      appointment.doctorId.userId._id.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this appointment" });
    }

    res.json(appointment);
  } catch (error) {
    console.error("Get appointment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get appointments for a doctor
// @route   GET /api/appointments/doctor/:doctorId
// @access  Private/Doctor/Admin

const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);

    // Check if doctor exists
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check if user is authorized to view these appointments
    if (req.user.role !== "admin" && doctor.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to view these appointments" });
    }

    const appointments = await Appointment.find({
      doctorId: req.params.doctorId,
    })
      .populate({
        path: "patientId",
        select: "name email phone",
      })
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    console.error("Get doctor appointments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get appointments for a patient
// @route   GET /api/appointments/patient/:patientId
// @access  Private/Patient/Admin

const getPatientAppointments = async (req, res) => {
  try {
    // Check if user is authorized to view these appointments
    if (req.user.role !== "admin" && req.params.patientId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to view these appointments" });
    }

    const appointments = await Appointment.find({
      patientId: req.params.patientId,
    })
      .populate({
        path: "doctorId",
        select: "specialization consultationFee",
        populate: {
          path: "userId",
          select: "name email profilePicture",
        },
      })
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    console.error("Get patient appointments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { doctorId, appointmentDate, slot, symptoms } = req.body;

  try {
    // Get doctor and check availability
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Convert appointment date to day of week
    const date = new Date(appointmentDate);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayOfWeek = days[date.getDay()];

    // Check if doctor works on this day
    const dayAvailability = doctor.availability.find(
      (day) => day.day === dayOfWeek
    );
    if (!dayAvailability) {
      return res
        .status(400)
        .json({ message: `Doctor is not available on ${dayOfWeek}` });
    }

    // Check if the requested slot exists and is available
    const availableSlot = dayAvailability.slots.find(
      (s) =>
        s.startTime === slot.startTime &&
        s.endTime === slot.endTime &&
        !s.isBooked
    );

    if (!availableSlot) {
      return res.status(400).json({ message: "This slot is not available" });
    }

    // Check if there's already an appointment for this doctor at this time
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate,
      "slot.startTime": slot.startTime,
      "slot.endTime": slot.endTime,
      status: { $ne: "cancelled" }, // Exclude cancelled appointments
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "This slot is already booked" });
    }

    // Create new appointment
    const appointment = new Appointment({
      doctorId,
      patientId: req.user.id,
      appointmentDate,
      slot,
      symptoms: symptoms || "",
    });

    // Mark slot as booked
    availableSlot.isBooked = true;
    await doctor.save();

    await appointment.save();

    // Populate appointment details for response
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate({
        path: "doctorId",
        select: "specialization consultationFee",
        populate: {
          path: "userId",
          select: "name email profilePicture",
        },
      })
      .populate({
        path: "patientId",
        select: "name email phone",
      });

    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error("Create appointment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private/Doctor/Admin
const updateAppointment = async (req, res) => {
  const { status, prescription, diagnosis, remarks } = req.body;

  try {
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if doctor or admin is updating
    const doctor = await Doctor.findById(appointment.doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check authorization
    if (req.user.role !== "admin" && doctor.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this appointment" });
    }

    // Update fields
    if (status) appointment.status = status;
    if (prescription) appointment.prescription = prescription;
    if (diagnosis) appointment.diagnosis = diagnosis;
    if (remarks) appointment.remarks = remarks;

    await appointment.save();

    // Populate appointment details for response
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate({
        path: "doctorId",
        select: "specialization consultationFee",
        populate: {
          path: "userId",
          select: "name email profilePicture",
        },
      })
      .populate({
        path: "patientId",
        select: "name email phone",
      });

    res.json(populatedAppointment);
  } catch (error) {
    console.error("Update appointment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if user is authorized to cancel this appointment
    if (
      req.user.role !== "admin" &&
      appointment.patientId.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this appointment" });
    }

    // Update status to cancelled
    appointment.status = "cancelled";
    await appointment.save();

    // Update doctor's availability
    const doctor = await Doctor.findById(appointment.doctorId);
    if (doctor) {
      const date = new Date(appointment.appointmentDate);
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayOfWeek = days[date.getDay()];

      const dayAvailability = doctor.availability.find(
        (day) => day.day === dayOfWeek
      );
      if (dayAvailability) {
        const slot = dayAvailability.slots.find(
          (s) =>
            s.startTime === appointment.slot.startTime &&
            s.endTime === appointment.slot.endTime
        );
        if (slot) {
          slot.isBooked = false;
          await doctor.save();
        }
      }
    }

    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getAllAppointments,
  getAppointmentById,
  getDoctorAppointments,
  getPatientAppointments,
  createAppointment,
  updateAppointment,
  cancelAppointment,
};
