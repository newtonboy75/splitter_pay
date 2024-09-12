import { Request, Response } from "express";
import User from "../database/UserSchema";
import jwt from "jsonwebtoken";
import { clearToken, generateTokens } from "../utils/jwt";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Login user
const authenticateUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user?.password))) {
    const { token, refreshToken } = await generateTokens(
      res,
      user._id.toString()
    );

    user.accessToken = token;
    await user.save();

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      accessToken: token,
      refreshToken: refreshToken,
    });
  } else {
    res.status(401).json({
      message: "Either email or password is incorrect or user does not exist",
    });
  }
};

//refresh the token
const refeshToken = async (req: Request, res: Response) => {
  const { token, user } = req.body;
  const jwt_secret: string = process.env.JWT_SECRET || "";

  jwt.verify(token, jwt_secret, (err: any, user: any) => {
    console.log(user);
    if (err) return res.sendStatus(403);
    const newTokens = generateTokens(user, user.id);
    res.json(newTokens);
  });
};

const logoutUser = (req: Request, res: Response) => {
  clearToken(res);
  res.status(200).json({ message: "User logged out" });
};

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const accountExists = await User.findOne({ email });

  if (accountExists) {
    res.status(403).json({ message: "Account already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateTokens(res, user._id.toString());
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400).json({ message: "Error creating user" });
  }
};

export { authenticateUser, logoutUser, registerUser, refeshToken };
