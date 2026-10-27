import jwt from "jsonwebtoken";
import Citizen from "../models/citizen.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Also support Authorization header Bearer token for Postman testing
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token",
      });
    }

    const citizen = await Citizen.findById(decoded.id).select("-password");

    if (!citizen) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not found",
      });
    }

    req.user = citizen;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Token verification failed",
    });
  }
};
