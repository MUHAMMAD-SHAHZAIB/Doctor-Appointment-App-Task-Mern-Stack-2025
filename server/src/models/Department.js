import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    icon: {
      type: String,
      default: "default-icon.png",
    },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", DepartmentSchema);
export default Department;
