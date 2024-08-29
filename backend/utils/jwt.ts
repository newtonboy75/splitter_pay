import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateTokens = async (res: Response, userId: string) => {
  const jwtSecret = process.env.JWT_SECRET || "";

  const token = jwt.sign({ userId }, jwtSecret, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign({ userId }, "refresh_secret", {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
    secure: process.env.NODE_ENV !== "development",
  });

  return { token, refreshToken };
};

export const clearToken = (res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
};
