import mongoose from "mongoose";
import crypto from "crypto";
import Grievance from "../models/grievance.model.js";
import Issue from "../models/issue.model.js";

// Helper to determine municipal department by category
const getDepartmentByCategory = (category) => {
  switch (category) {
    case "Roads & Potholes":
      return "Roads & Bridges - Public Works Dept (PWD)";
    case "Sanitation & Waste":
      return "Solid Waste Management Department";
    case "Water Supply":
      return "Municipal Water Supply & Board";
    case "Street Lighting":
      return "Electricity & Street Lighting Authority";
    case "Parks & Public Spaces":
      return "Horticulture & Parks Department";
    case "Traffic & Signals":
      return "Traffic Engineering & Mobility Cell";
    case "Drainage & Sewage":
      return "Stormwater & Underground Drainage Authority";
    default:
      return "Central Municipal Grievance Cell";
  }
};

// @desc File an official grievance escalation for an issue (Order creation equivalent)
// @route POST /grievances/file
export const fileGrievance = async (req, res) => {
  try {
    const { issueId, contactDetails, escalationReason } = req.body;

    if (!issueId || !contactDetails || !escalationReason) {
      return res.status(400).json({
        success: false,
        message: "issueId, contactDetails, and escalationReason are required",
      });
    }

    const { fullName, phone, addressLine, ward, pincode } = contactDetails;
    if (!fullName || !phone || !addressLine || !ward || !pincode) {
      return res.status(400).json({
        success: false,
        message: "All contact details (fullName, phone, addressLine, ward, pincode) are mandatory",
      });
    }

    // Phone & Pincode format validation
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be a valid 10-digit number",
      });
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      return res.status(400).json({
        success: false,
        message: "Pincode must be exactly 6 digits",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(issueId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID format",
      });
    }

    // Re-verify issue from MongoDB (Source of truth)
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "The civic issue no longer exists",
      });
    }

    // Generate unique tracking number (e.g., FMC-2026-9A3F1)
    const trackingId = `FMC-${new Date().getFullYear()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    // Assigned department based on category
    const assignedDepartment = getDepartmentByCategory(issue.category);

    // Create Grievance with snapshot
    const grievance = await Grievance.create({
      citizen: req.user._id,
      trackingId,
      issueSnapshot: {
        issueId: issue._id,
        title: issue.title,
        category: issue.category,
        location: issue.location,
        image: issue.image,
        priority: issue.priority,
      },
      contactDetails: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        addressLine: addressLine.trim(),
        ward: ward.trim(),
        pincode: pincode.trim(),
      },
      escalationReason: escalationReason.trim(),
      assignedDepartment,
      status: "SUBMITTED",
      estimatedResolutionDays: issue.priority === "CRITICAL" ? 2 : issue.priority === "HIGH" ? 4 : 7,
      officerNotes: "Official grievance registered in Municipal Portal. Inspection ticket issued to Ward Officer.",
    });

    // Update original issue status to ACKNOWLEDGED if it was still REPORTED
    if (issue.status === "REPORTED") {
      issue.status = "ACKNOWLEDGED";
      await issue.save();
    }

    return res.status(201).json({
      success: true,
      message: "Grievance ticket created successfully",
      trackingId: grievance.trackingId,
      grievance,
    });
  } catch (error) {
    console.error("File Grievance Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error filing grievance",
      error: error.message,
    });
  }
};

// @desc Get current citizen's filed grievances
// @route GET /grievances
export const getMyGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ citizen: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: grievances.length,
      grievances,
    });
  } catch (error) {
    console.error("Get Grievances Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching grievances",
    });
  }
};

// @desc Get single grievance details by ID (enforcing ownership)
// @route GET /grievances/:id
export const getSingleGrievance = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid grievance ID format",
      });
    }

    const grievance = await Grievance.findById(id).populate("citizen", "fullName email phone");

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Grievance ticket not found",
      });
    }

    // Security Rule: User must own the grievance
    if (grievance.citizen._id.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Forbidden - You do not have permission to view this grievance",
      });
    }

    return res.status(200).json({
      success: true,
      grievance,
    });
  } catch (error) {
    console.error("Get Single Grievance Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching grievance details",
    });
  }
};

// @desc Update grievance status progression (Admin/Official or demo simulation)
// @route PATCH /grievances/:id/status
export const updateGrievanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, officerNotes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid grievance ID",
      });
    }

    const validStatuses = ["SUBMITTED", "INSPECTION_SCHEDULED", "WORK_IN_PROGRESS", "RESOLVED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const grievance = await Grievance.findById(id);
    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found",
      });
    }

    // Ensure ownership or admin
    if (grievance.citizen.toString() !== req.user._id.toString() && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    grievance.status = status;
    if (officerNotes) {
      grievance.officerNotes = officerNotes;
    }

    await grievance.save();

    // If marked RESOLVED, also update the original issue's status
    if (status === "RESOLVED" && grievance.issueSnapshot?.issueId) {
      await Issue.findByIdAndUpdate(grievance.issueSnapshot.issueId, {
        status: "RESOLVED",
        resolvedAt: new Date(),
        resolutionNotes: officerNotes || "Resolved after site inspection and repair works.",
      });
    } else if (status === "WORK_IN_PROGRESS" && grievance.issueSnapshot?.issueId) {
      await Issue.findByIdAndUpdate(grievance.issueSnapshot.issueId, {
        status: "IN_PROGRESS",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Grievance status updated successfully",
      grievance,
    });
  } catch (error) {
    console.error("Update Grievance Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error updating grievance status",
    });
  }
};
