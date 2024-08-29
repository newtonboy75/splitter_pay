import mongoose, { Schema } from "mongoose";
import { Payment } from "../utils/types/payments";

const paymentSchema = new Schema<Payment>({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  initiatorId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: false,
  },
  splitters: [
    {
      id: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      is_initiator: {
        type: Boolean,
        required: false,
      },
      share_amount: {
        type: String,
        required: true,
      },
      payment_status: {
        type: Number,
        required: true,
      },
      date_paid: {
        type: Date,
        required: false,
      },
    },
  ],
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
