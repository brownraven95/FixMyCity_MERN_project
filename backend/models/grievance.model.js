import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema(
  {
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Citizen",
      required: true,
    },
    trackingId: {
      type: String,
      required: true,
      unique: true,
    },
    // Snapshot of the issue at the time of official grievance filing
    issueSnapshot: {
      issueId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Issue",
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      image: {
        type: String,
      },
      priority: {
        type: String,
        default: "MEDIUM",
      },
    },
    contactDetails: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine: { type: String, required: true },
      ward: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    escalationReason: {
      type: String,
      required: [true, "Escalation reason is required"],
    },
    assignedDepartment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["SUBMITTED", "INSPECTION_SCHEDULED", "WORK_IN_PROGRESS", "RESOLVED"],
      default: "SUBMITTED",
    },
    estimatedResolutionDays: {
      type: Number,
      default: 5,
    },
    officerNotes: {
      type: String,
      default: "Grievance received and dispatched to field engineer for site survey.",
    },
  },
  { timestamps: true }
);

const Grievance = mongoose.model("Grievance", grievanceSchema);
export default Grievance;
