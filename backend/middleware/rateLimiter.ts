import express, { Request, Response, NextFunction } from "express";
import { app } from "..";

const RATE_LIMIT_TIME = 15 * 60 * 1000; // 1 minutes
const MAX_REQUEST_LIMIT = 100;

interface RateLimiterInfo {
  requests: number;
  firstRequestTime: number;
}

// Store IP in memory
const trackedLimitData: { [key: string]: RateLimiterInfo } = {};

// Use rate limiter
const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip: any = req.ip;
  //console.log(req)

  if (!trackedLimitData[ip]) {
    // User made request for the first time
    trackedLimitData[ip] = { requests: 1, firstRequestTime: Date.now() };
  } else {
    const currentTime = Date.now();
    const timeElapsed = currentTime - trackedLimitData[ip].firstRequestTime;

    if (timeElapsed < RATE_LIMIT_TIME) {
      // If still within RATE_LIMIT_TIME
      if (trackedLimitData[ip].requests >= MAX_REQUEST_LIMIT) {
        return res
          .status(429)
          .json({ message: "Too many requests. Please try again later." });
      } else {
        trackedLimitData[ip].requests += 1;
      }
    } else {
      // Rest rate limit data
      trackedLimitData[ip].requests = 1;
      trackedLimitData[ip].firstRequestTime = currentTime;
    }
  }

  next();
};

export { rateLimiter };
