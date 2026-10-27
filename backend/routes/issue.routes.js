import express from "express";
import {
  createIssue,
  getAllIssues,
  getSingleIssue,
  toggleUpvote,
  updateIssueStatus,
} from "../controllers/issue.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createIssue);
router.get("/", getAllIssues);
router.get("/:id", getSingleIssue);
router.post("/:id/upvote", protectRoute, toggleUpvote);
router.patch("/:id/status", protectRoute, updateIssueStatus);

export default router;
