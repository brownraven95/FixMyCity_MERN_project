import mongoose from "mongoose";
import Issue from "../models/issue.model.js";
import Citizen from "../models/citizen.model.js";

// @desc Create a new civic issue
// @route POST /issues
export const createIssue = async (req, res) => {
  try {
    const { title, description, category, location, pincode, priority, image } = req.body;

    if (!title || !description || !category || !location || !image) {
      return res.status(400).json({
        success: false,
        message: "Title, description, category, location, and image are mandatory fields",
      });
    }

    const newIssue = await Issue.create({
      title,
      description,
      category,
      location,
      pincode: pincode || "560001",
      priority: priority || "MEDIUM",
      image,
      reportedBy: req.user._id,
      reporterName: req.user.fullName,
      status: "REPORTED",
    });

    return res.status(201).json({
      success: true,
      message: "Issue reported successfully to municipal authorities",
      issue: newIssue,
    });
  } catch (error) {
    console.error("Create Issue Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while creating issue",
      error: error.message,
    });
  }
};

// @desc Get all civic issues with search, filtering, and sorting
// @route GET /issues
export const getAllIssues = async (req, res) => {
  try {
    const { search, category, status, priority, sort } = req.query;

    const query = {};

    // Dynamic search across title, description, or location
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
      ];
    }

    // Category filter
    if (category && category !== "All Categories" && category !== "all") {
      query.category = category;
    }

    // Status filter
    if (status && status !== "ALL" && status !== "all") {
      query.status = status;
    }

    // Priority filter
    if (priority && priority !== "ALL" && priority !== "all") {
      query.priority = priority;
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    } else if (sort === "upvotes") {
      sortOption = { upvotesCount: -1 };
    }

    const issues = await Issue.find(query)
      .populate("reportedBy", "fullName city")
      .sort(sortOption);

    return res.status(200).json({
      success: true,
      count: issues.length,
      issues,
    });
  } catch (error) {
    console.error("Get Issues Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching issues",
      error: error.message,
    });
  }
};

// @desc Get single issue by ID
// @route GET /issues/:id
export const getSingleIssue = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID format",
      });
    }

    const issue = await Issue.findById(id).populate("reportedBy", "fullName email city phone");

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Civic issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      issue,
    });
  } catch (error) {
    console.error("Get Single Issue Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching issue details",
      error: error.message,
    });
  }
};

// @desc Toggle upvote on an issue
// @route POST /issues/:id/upvote
export const toggleUpvote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID format",
      });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const citizen = await Citizen.findById(req.user._id);
    const hasUpvoted = citizen.upvotedIssues.includes(id);

    let upvoted = false;
    if (hasUpvoted) {
      // Remove upvote
      citizen.upvotedIssues = citizen.upvotedIssues.filter(
        (issueId) => issueId.toString() !== id
      );
      issue.upvotesCount = Math.max(0, issue.upvotesCount - 1);
      upvoted = false;
    } else {
      // Add upvote
      citizen.upvotedIssues.push(id);
      issue.upvotesCount += 1;
      upvoted = true;
    }

    await citizen.save();
    await issue.save();

    return res.status(200).json({
      success: true,
      upvoted,
      upvotesCount: issue.upvotesCount,
      message: upvoted ? "Upvoted issue to support resolution" : "Upvote removed",
    });
  } catch (error) {
    console.error("Toggle Upvote Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error toggling upvote",
    });
  }
};

// @desc Update issue resolution status (Administrative / Official progression)
// @route PATCH /issues/:id/status
export const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes, department } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID",
      });
    }

    const validStatuses = ["REPORTED", "ACKNOWLEDGED", "IN_PROGRESS", "RESOLVED"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    if (status) issue.status = status;
    if (resolutionNotes) issue.resolutionNotes = resolutionNotes;
    if (department) issue.department = department;
    if (status === "RESOLVED") issue.resolvedAt = new Date();

    await issue.save();

    return res.status(200).json({
      success: true,
      message: "Issue status updated successfully",
      issue,
    });
  } catch (error) {
    console.error("Update Issue Status Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error updating issue status",
    });
  }
};
