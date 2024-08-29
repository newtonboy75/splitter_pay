import { Request, Response } from "express";
import Payment from "../database/PaymentSchema";
import { app, getWss } from "..";

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

export const getPaymentById = async (req: Request, res: Response) => {
  console.log("get all payments here");
};

export const savePayment = async (req: Request, res: Response) => {
  const transaction = req.body;
  const payment_save = await Payment.create(transaction);

  if (payment_save) {
    const message = {
      to: "splitters",
      data: transaction,
      disposition: "split_invite"
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

export const paySplit = async (req: Request, res: Response) => {
  console.log("get all payments here", req.body);
  const {
    id,
    name,
    num_splitters,
    initiator,
    initiator_id,
    totalAmount,
    email,
    share_amount,
    payee_name,
  } = req.body;
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
    const message = {
    initiator_id,
      data: {payee: payee_name, share_amount: share_amount, name: name, initiator: id, email: email, initiator_id: initiator_id},
      to: "initiator",
      disposition: "payment_successful",
    };

    getWss().clients.forEach((client: any) => {
      if (client.readyState === client.OPEN) {
        console.log("update successful");
        client.send(JSON.stringify(message));
      }
    });
  }

  res.status(200).json("yes");
};
