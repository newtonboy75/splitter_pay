import express from "express";
import { body, query } from "express-validator";

import {
  getPaymentById,
  getPayments,
  paySplit,
  removeSplit,
  savePayment,
} from "../controllers/paymentController";
import { verifyAuth } from "../middleware/verifyAuth";

const checkForSQLInjection = (value: string) => {
  const sqlInjectionPattern =
    /(\b(SELECT|INSERT|DELETE|UPDATE|DROP|ALTER|EXEC|UNION|--|;|\/\*)\b)/i;
  if (sqlInjectionPattern.test(value)) {
    throw new Error("SQL Injection attempt detected");
  }
  return true;
};

export default (router: express.Router) => {
  router.get("/payments", verifyAuth, getPayments);
  router.get("/payments/:paymentId", verifyAuth, getPaymentById);
  router.post(
    "/payments",
    verifyAuth,
    [
      body("**.email")
        .notEmpty()
        .isEmail()
        .withMessage("Should be an email address"),
      body("**.name")
        .notEmpty()
        .custom(checkForSQLInjection)
        .escape()
        .withMessage("Name is invalid"),
      body("**.amount").isNumeric(),
      body("**.share_amount").isNumeric(),
      body("**.initiatorId").isAlphanumeric(),
    ],
    savePayment
  );
  router.put(
    "/payments/:paymentId/pay",
    verifyAuth,
    [
      body("**.email")
        .notEmpty()
        .isEmail()
        .withMessage("Should be an email address"),
      body("**.name")
        .notEmpty()
        .custom(checkForSQLInjection)
        .escape()
        .withMessage("Name is invalid"),
      body("**.payee_name")
        .notEmpty()
        .custom(checkForSQLInjection)
        .escape()
        .withMessage("Name is invalid"),
      body("**.share_amount").isNumeric(),
      body("**.initiator_id").isAlphanumeric(),
    ],
    paySplit
  );
  router.delete("/payments/:paymentId/delete", verifyAuth, removeSplit);
};
