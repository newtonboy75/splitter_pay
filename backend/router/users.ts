import express from "express";
import {
  authenticateUser,
  logoutUser,
  registerUser,
  refeshToken
} from "../controllers/authController";

export default (router: express.Router) => {
  router.post("/login", authenticateUser);
  router.get("/logout", logoutUser);
  router.post("/register", registerUser);
  router.get("/refresh-token", refeshToken);
};
