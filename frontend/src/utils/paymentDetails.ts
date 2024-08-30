const paymentDetails = (
  split: {
    splitters: string | any[];
    _id: any;
    name: any;
    amount: string;
  },
  current_user: { email: any }
) => {
  const splitters = Array.from(split.splitters);
  const payee: any = splitters.filter((split: any) => {
    return split.email === current_user.email;
  });

  const initiator: any = splitters.filter((split: any) => {
    return split.is_initiator === true;
  });

  //prepare details for submission
  const paymentDetails = {
    id: split._id,
    name: split.name,
    num_splitters: split.splitters.length,
    initiator: initiator[0].name,
    totalAmount: parseFloat(split.amount).toFixed(2),
    email: payee[0].email,
    share_amount: payee[0].share_amount,
    payee_name: payee[0].name,
    date_paid: payee[0].date_paid,
    payment_id: payee[0].id,
    initiator_id: initiator[0].id,
    splitters: splitters,
  };

  return paymentDetails;
};

export default paymentDetails;
