import express from "express";
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
  toggleWatchlist,
} from "../controllers/watchlist.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:issueId", protectRoute, addToWatchlist);
router.get("/", protectRoute, getWatchlist);
router.delete("/:issueId", protectRoute, removeFromWatchlist);
router.patch("/:issueId/toggle", protectRoute, toggleWatchlist);

export default router;
