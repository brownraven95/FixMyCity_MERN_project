import express from "express";
import {
  registerCitizen,
  loginCitizen,
  getCitizenProfile,
  logoutCitizen,
  changePassword,
} from "../controllers/citizen.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerCitizen);
router.post("/login", loginCitizen);
router.get("/me", protectRoute, getCitizenProfile);
router.post("/logout", protectRoute, logoutCitizen);
router.patch("/change-password", protectRoute, changePassword);

export default router;
