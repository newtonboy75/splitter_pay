import express from "express";
import {
  getPaymentById,
  getPayments,
  paySplit,
  removeSplit,
  savePayment,
} from "../controllers/paymentController";
import { verifyAuth } from "../middleware/verifyAuth";

export default (router: express.Router) => {
  router.get("/payments", verifyAuth, getPayments);
  router.get("/payments/:paymentId", verifyAuth, getPaymentById);
  router.post("/payments", verifyAuth, savePayment);
  router.put("/payments/:paymentId/pay", verifyAuth, paySplit);
  router.delete("/payments/:paymentId/delete", verifyAuth, removeSplit);
};
