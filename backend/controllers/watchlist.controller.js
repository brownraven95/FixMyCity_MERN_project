import mongoose from "mongoose";
import Citizen from "../models/citizen.model.js";
import Issue from "../models/issue.model.js";

// @desc Add issue to citizen's watchlist
// @route POST /watchlist/:issueId
export const addToWatchlist = async (req, res) => {
  try {
    const { issueId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(issueId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID format",
      });
    }

    // Verify issue exists
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Civic issue not found",
      });
    }

    const citizen = await Citizen.findById(req.user._id);

    // Prevent duplicate entries (Lab 4 requirement)
    const isAlreadySaved = citizen.watchlist.some(
      (savedId) => savedId.toString() === issueId
    );

    if (isAlreadySaved) {
      return res.status(409).json({
        success: false,
        message: "Issue is already in your watchlist",
      });
    }

    citizen.watchlist.push(issueId);
    await citizen.save();

    return res.status(200).json({
      success: true,
      message: "Issue added to your watchlist",
    });
  } catch (error) {
    console.error("Add to Watchlist Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error adding to watchlist",
    });
  }
};

// @desc Get authenticated citizen's watchlist with populated issue details
// @route GET /watchlist
export const getWatchlist = async (req, res) => {
  try {
    const citizen = await Citizen.findById(req.user._id).populate({
      path: "watchlist",
      select: "title category location priority status image upvotesCount department createdAt",
    });

    if (!citizen) {
      return res.status(404).json({
        success: false,
        message: "Citizen not found",
      });
    }

    return res.status(200).json({
      success: true,
      count: citizen.watchlist.length,
      watchlist: citizen.watchlist,
    });
  } catch (error) {
    console.error("Get Watchlist Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching watchlist",
    });
  }
};

// @desc Remove an issue from watchlist
// @route DELETE /watchlist/:issueId
export const removeFromWatchlist = async (req, res) => {
  try {
    const { issueId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(issueId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID format",
      });
    }

    const citizen = await Citizen.findById(req.user._id);

    const exists = citizen.watchlist.some(
      (savedId) => savedId.toString() === issueId
    );

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Issue not found in your watchlist",
      });
    }

    citizen.watchlist = citizen.watchlist.filter(
      (savedId) => savedId.toString() !== issueId
    );
    await citizen.save();

    return res.status(200).json({
      success: true,
      message: "Issue removed from watchlist",
    });
  } catch (error) {
    console.error("Remove from Watchlist Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error removing from watchlist",
    });
  }
};

// @desc Toggle watchlist status
// @route PATCH /watchlist/:issueId/toggle
export const toggleWatchlist = async (req, res) => {
  try {
    const { issueId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(issueId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue ID format",
      });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    const citizen = await Citizen.findById(req.user._id);
    const index = citizen.watchlist.findIndex(
      (savedId) => savedId.toString() === issueId
    );

    let saved = false;
    if (index > -1) {
      citizen.watchlist.splice(index, 1);
      saved = false;
    } else {
      citizen.watchlist.push(issueId);
      saved = true;
    }

    await citizen.save();

    return res.status(200).json({
      success: true,
      saved,
      message: saved ? "Added to watchlist" : "Removed from watchlist",
      watchlistCount: citizen.watchlist.length,
    });
  } catch (error) {
    console.error("Toggle Watchlist Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error toggling watchlist",
    });
  }
};
