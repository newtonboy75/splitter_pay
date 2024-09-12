import { describe, expect, test } from "@jest/globals";
import { Request, Response } from "express";
import Payment from "../database/PaymentSchema";
import { getWss } from "../";
import { validationResult } from "express-validator";
import {
  getPayments,
  savePayment,
  paySplit,
  removeSplit,
} from "../controllers/paymentController";

jest.mock("../database/PaymentSchema", () => ({
  find: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
  findByIdAndDelete: jest.fn(),
}));

jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

jest.mock("../", () => ({
  getWss: jest.fn(),
}));

describe("Controller Tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {
      query: {},
      body: {},
      params: {},
    };

    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    res = {
      status: statusMock,
    };

    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
    });
  });

  describe("getPayments", () => {
    it("should return payments based on status 'active'", async () => {
      req.query = { status: "active", initiator: "initiatorId" };

      (Payment.find as jest.Mock).mockResolvedValue([{ _id: "1" }]);

      await getPayments(req as Request, res as Response);

      expect(Payment.find).toHaveBeenCalledWith({
        initiatorId: "initiatorId",
        splitters: { $all: { $elemMatch: { payment_status: { $ne: 3 } } } },
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith([{ _id: "1" }]);
    });

    it("should return 404 when no payments are found", async () => {
      (Payment.find as jest.Mock).mockResolvedValue(null);

      await getPayments(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Nothing" });
    });
  });

  describe("savePayment", () => {
    it("should save payment and send WebSocket message", async () => {
      req.body = { amount: 100 };

      (Payment.create as jest.Mock).mockResolvedValue({ _id: "1" });

      const wsClient = { readyState: 1, OPEN: 1, send: jest.fn() };
      (getWss as jest.Mock).mockReturnValue({ clients: [wsClient] });

      await savePayment(req as Request, res as Response);

      expect(Payment.create).toHaveBeenCalledWith({ amount: 100 });
      expect(wsClient.send).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ amount: 100 });
    });

    it("should return 400 if validation errors exist", async () => {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ msg: "Invalid input" }]),
      });

      await savePayment(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        errors: [{ msg: "Invalid input" }],
      });
    });
  });

  describe("paySplit", () => {
    it("should update payment status and send WebSocket message", async () => {
      req.body = {
        id: "paymentId",
        email: "user@example.com",
        name: "User",
        share_amount: 100,
        payee_name: "Payee",
        initiator_id: "initiatorId",
      };

      (Payment.updateOne as jest.Mock).mockResolvedValue({ nModified: 1 });

      const wsClient = { readyState: 1, OPEN: 1, send: jest.fn() };
      (getWss as jest.Mock).mockReturnValue({ clients: [wsClient] });

      await paySplit(req as Request, res as Response);

      expect(Payment.updateOne).toHaveBeenCalledWith(
        { _id: new Object("paymentId"), "splitters.email": "user@example.com" },
        {
          $set: {
            "splitters.$.payment_status": 3,
            "splitters.$.date_paid": expect.any(Date),
          },
        }
      );
      expect(wsClient.send).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith("Payment successful");
    });

    it("should return 400 if validation errors exist", async () => {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue([{ msg: "Invalid input" }]),
      });

      await paySplit(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        errors: [{ msg: "Invalid input" }],
      });
    });
  });

  describe("removeSplit", () => {
    it("should delete a split and send WebSocket message", async () => {
      req.params = { paymentId: "1" };

      (Payment.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: "1" });

      const wsClient = { readyState: 1, OPEN: 1, send: jest.fn() };
      (getWss as jest.Mock).mockReturnValue({ clients: [wsClient] });

      await removeSplit(req as Request, res as Response);

      expect(Payment.findByIdAndDelete).toHaveBeenCalledWith("1");
      expect(wsClient.send).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith("Split has been cancelled");
    });

    it("should return 404 if no split is found", async () => {
      (Payment.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await removeSplit(req as Request, res as Response);

      expect(statusMock).not.toHaveBeenCalledWith(200);
      expect(jsonMock).not.toHaveBeenCalledWith("Split has been cancelled");
    });
  });
});
