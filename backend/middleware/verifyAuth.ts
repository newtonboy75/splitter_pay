import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { AuthenticationError } from "./authErrors";

dotenv.config();
const JWT_SECRET: string = process.env.JWT_SECRET || "";

export const verifyAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.sendStatus(401);
  }

  const token = header.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

  if (!decoded || !decoded.userId) {
    throw new AuthenticationError("UserId not found");
  }

  next();
};
