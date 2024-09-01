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
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ error: "TokenExpiredError: token expired" });
      }
      return res.sendStatus(403); 
    }

    next();
  });
};
