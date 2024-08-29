import express from "express";
import payments from "./payments";
import users from "./users";

const router = express.Router();

export default (): express.Router => {
  payments(router);
  users(router);
  return router;
};
