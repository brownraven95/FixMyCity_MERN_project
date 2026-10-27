import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, citizenId) => {
  const token = jwt.sign({ id: citizenId }, process.env.JWT_SECRET || "default_secret_key", {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
