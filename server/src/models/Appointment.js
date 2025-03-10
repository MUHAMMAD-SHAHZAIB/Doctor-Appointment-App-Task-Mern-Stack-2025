import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    slot: {
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "no-show"],
      default: "scheduled",
    },
    symptoms: {
      type: String,
      default: "",
    },
    prescription: {
      type: String,
      default: "",
    },
    diagnosis: {
      type: String,
      default: "",
    },
    remarks: {
      type: String,
      default: "",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "refunded"],
      default: "pending",
    },
    meetingLink: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Compound index to ensure a patient can't book the same doctor at the same time
AppointmentSchema.index(
  { doctorId: 1, appointmentDate: 1, "slot.startTime": 1 },
  { unique: true }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);

export default Appointment;
