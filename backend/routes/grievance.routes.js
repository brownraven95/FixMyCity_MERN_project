import express from "express";
import {
  fileGrievance,
  getMyGrievances,
  getSingleGrievance,
  updateGrievanceStatus,
} from "../controllers/grievance.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/file", protectRoute, fileGrievance);
router.get("/", protectRoute, getMyGrievances);
router.get("/:id", protectRoute, getSingleGrievance);
router.patch("/:id/status", protectRoute, updateGrievanceStatus);

export default router;
