import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Issue title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Issue description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Roads & Potholes",
        "Sanitation & Waste",
        "Water Supply",
        "Street Lighting",
        "Parks & Public Spaces",
        "Traffic & Signals",
        "Drainage & Sewage",
        "Other",
      ],
    },
    location: {
      type: String,
      required: [true, "Location / Address is required"],
      trim: true,
    },
    pincode: {
      type: String,
      default: "560001",
      trim: true,
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },
    status: {
      type: String,
      enum: ["REPORTED", "ACKNOWLEDGED", "IN_PROGRESS", "RESOLVED"],
      default: "REPORTED",
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Citizen",
      required: true,
    },
    reporterName: {
      type: String,
      default: "Concerned Citizen",
    },
    upvotesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    department: {
      type: String,
      default: "Municipal Public Works Department",
    },
    resolutionNotes: {
      type: String,
      default: "",
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Indexing for search performance
issueSchema.index({ title: "text", description: "text", location: "text" });

const Issue = mongoose.model("Issue", issueSchema);
export default Issue;
