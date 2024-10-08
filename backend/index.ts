import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./router";
import DbConnect from "./database/DbConnector";
import { errorHandler } from "./middleware/authErrors";
import http from "http";
import { UserInfo } from "./utils/types/users";
import expressWs from "express-ws";
import { rateLimiter } from "./middleware/rateLimiter";
import helmet from 'helmet';

dotenv.config();

//export so other methods can use websocket
export const { app, getWss, applyTo } = expressWs(express());

const server = http.createServer(app);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4173"], //localhost address for dev and built
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);
app.use(rateLimiter);
app.use(helmet());

//connect to Atlas
DbConnect();

declare global {
  namespace Express {
    interface Request {
      user?: UserInfo | null;
    }
  }
}

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Serving on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello from Express");
});

app.ws("/", function (ws, req) {
  ws.on("message", function (msg) {
    console.log(msg);
    ws.send("ok bye");
  });
  //console.log('socket', req);
});

//Serve API endpoints
app.use("/api", router());
