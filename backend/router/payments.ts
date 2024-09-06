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
  const mongoInjection =
    /(\b(\$where|\$gt|\$lt|\$ne|\$in|\$nin|\$eq|\$regex|\$exists|\$mod|\$all|\$size|\$nor|\$or|\$and|\$not|\$expr|\$jsonSchema|\$geoIntersects|\$geoWithin|\$near|\$nearSphere|\$text|\$where|function|eval)\b|\{.*?\}|\bdb\.(\w+)\.\w+)/i;
  if (mongoInjection.test(value)) {
    throw new Error("MongoDB Injection attempt detected");
  }
  return true;
};

export default (router: express.Router) => {
  /**
   * GET all payments
   * @param {request param}
   *
   */
  router.get("/payments", verifyAuth, getPayments);

  /**
   * GET payment by paymentID
   * @param paymentId
   */
  router.get("/payments/:paymentId", verifyAuth, getPaymentById);

  /**
   * POST payment
   * @param {paymentDetails}
   */
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

  /**
   * PUT payment id
   * @param {paymentDetails}
   */
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

  /**
   * DELETE payment from databas
   * @param paymentId
   */
  router.delete("/payments/:paymentId/delete", verifyAuth, removeSplit);
};
