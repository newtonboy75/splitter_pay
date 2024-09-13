import { Request, Response } from "express";
import Payment from "../database/PaymentSchema";
import { app, getWss } from "..";
import { ResponseData } from "../utils/types/responseData";
import { validationResult } from "express-validator";
/**
 * get all splits
 * @param {Request} req status, inititor, email
 * @param {Response} res
 */
export const getPayments = async (req: Request, res: Response) => {
  const { status, initiator, email } = req.query;

  let payments;
  if (req.query) {
    //console.log(status);
    //Your active splits, the ones you initiated
    if (status === "active") {
      payments = await Payment.find({
        initiatorId: initiator,
        splitters: {
          $all: {
            $elemMatch: { payment_status: { $ne: 3 } },
          },
        },
      });
    } else if (status === "paid") {
      //You paid already
      payments = await Payment.find({
        initiatorId: initiator,
        splitters: {
          $not: {
            $elemMatch: { payment_status: { $ne: 3 } },
          },
        },
      });
    } else if (status === "toPay") {
      //Ones you have to pay
      payments = await Payment.find({
        splitters: {
          $all: {
            $elemMatch: {
              email: { $eq: email },
              payment_status: { $ne: 3 },
            },
          },
        },
      });
    } else if (status === "invited") {
      //Ones you have to pay after invitation to split
      payments = await Payment.find({
        splitters: {
          $elemMatch: {
            //is_initiator: { $ne: true },
            email: email,
            payment_status: 3,
          },
        },
      });
    }
  } else {
    payments = await Payment.find({});
  }

  if (!payments) {
    res.status(404).json({ message: "Nothing" });
  }

  res.status(200).json(payments);
};

/**
 *
 * @param req
 * @param res
 */
export const getPaymentById = async (req: Request, res: Response) => {
  const { paymentId } = req.params;
  try {
    const payment = await Payment.findById(paymentId);
    console.log("get all payments here", payment);
    res.status(200).json(payment);
  } catch (error) {
    console.log(error);
    res.status(400).json("Payment ID does not exist.");
  }
};

/**
 * Save new split to mongodb
 * @param req {}
 * @param res
 */
export const savePayment = async (req: Request, res: Response) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.status(400).json({ errors: validationErrors.array() });
  }

  const transaction = req.body;
  const payment_save = await Payment.create(transaction);

  if (payment_save) {
    const message: ResponseData = {
      to: "splitters",
      data: transaction,
      disposition: "split_invite",
    };

    getWss().clients.forEach((client: any) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  // if(!payment_save){

  res.status(200).json(transaction);
};

//
/**
 * Payment transaction
 * @param req id, name, initiator_id, email, share_amount, payee_name
 * @param res {}
 */
export const paySplit = async (req: Request, res: Response) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.status(400).json({ errors: validationErrors.array() });
  }

  const { id, name, initiator_id, email, share_amount, payee_name } = req.body;
  const timestamp = new Date();
  const payment = await Payment.updateOne(
    {
      _id: new Object(id),
      "splitters.email": email,
    },
    {
      $set: {
        "splitters.$.payment_status": 3,
        "splitters.$.date_paid": timestamp,
      },
    }
  );

  if (payment) {
    const message: ResponseData = {
      data: {
        payee: payee_name,
        share_amount: share_amount,
        name: name,
        initiator: id,
        email: email,
        initiator_id: initiator_id,
      },
      to: "initiator",
      disposition: "payment_successful",
    };

    getWss().clients.forEach((client: any) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(message));
      }
    });

    try {
      const currentSplit = await Payment.findById(id);
      const numSplitters = currentSplit?.splitters.length;

      const splitersPaid = currentSplit?.splitters.filter((split) => { //check if all splitters have already paid
        return split.payment_status === 3;
      });

      if (numSplitters === splitersPaid?.length) { //if yes, update split to completed = true
        currentSplit!.completed = true;
        currentSplit!.completedOn = new Date();
        currentSplit?.save();

        const messageSplitCompleted: ResponseData = {
          data: {
            payee: "",
            share_amount: 0,
            name: currentSplit?.name!,
            initiator: "",
            email: "",
            initiator_id: currentSplit?.initiatorId!,
          },
          to: "initiator",
          disposition: "split_complete",
        };

        setTimeout(() => { //sends Split Complete notification after 10 seconds
          getWss().clients.forEach((client: any) => {
            if (client.readyState === client.OPEN) {
              //console.log("Payment successful");
              client.send(JSON.stringify(messageSplitCompleted));
            }
          });
        }, 10000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  res.status(200).json("Payment successful");
};

/**
 * Initiator cancelled the transaction
 * @param req paymentId, req.body
 * @param res
 */
export const removeSplit = async (req: Request, res: Response) => {
  const paymentId = req.params.paymentId;
  const data = req.body;
  try {
    const deletedDocument = await Payment.findByIdAndDelete(paymentId);
    if (deletedDocument) {
      res.status(200).json("Split has been cancelled");

      const message: ResponseData = {
        data: data,
        to: "splitters_cancelled",
        disposition: "payment_cancelled",
      };

      getWss().clients.forEach((client: any) => {
        if (client.readyState === client.OPEN) {
          console.log("update successful");
          client.send(JSON.stringify(message));
        }
      });
    } else {
      console.log("No document found with the given ID.");
    }
  } catch (error) {
    console.error("Error deleting document:", error);
  }
};
