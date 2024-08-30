import { Link } from "react-router-dom";
import { getToken } from "../../utils/saveAuth";

const SplitInvite = ({ toPay }: any) => {
  const currentUser = getToken();

  //get the initiator of the splits
  const initiator = toPay["splitters"].filter((splitter: any) => {
    return splitter.is_initiator === true;
  });

  //othe current logged in user
  const payee = toPay["splitters"].filter((splitter: any) => {
    return splitter.email === currentUser.email;
  });

  //prepare details to be sent to the server
  const paymentDetails = {
    id: toPay["_id"],
    name: toPay["name"],
    num_splitters: toPay["splitters"].length,
    initiator_id: initiator[0].id,
    initiator: initiator[0]["name"],
    totalAmount: parseFloat(toPay["amount"]).toFixed(2),
    email: payee[0]["email"],
    share_amount: payee[0]["share_amount"],
    payee_name: payee[0]["name"],
  };

  return (
    <>
      <div className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full rounded-lg font-[sans-serif] overflow-hidden mx-auto mt-4">
        <div className="p-6">
          <p className="mt-2 mb-2 text-lg text-gray-500 leading-relaxed">
            {initiator[0]["name"]} and {toPay["splitters"].length - 1} other
            splitter/s would like to split the cost for {toPay["name"]},
            totaling $
            {parseFloat(toPay["amount"]).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
          <div className="flex items-center justify-center mb-6 mt-2">
            <Link
              type="button"
              className="px-5 py-2.5 rounded-full text-white text-sm tracking-wider font-medium border border-current outline-none bg-blue-700 hover:bg-blue-800 active:bg-blue-700 self-center  -mb-4 mt-4"
              to={"/payment/" + toPay["_id"]}
              state={paymentDetails}
            >
              Split Pay Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SplitInvite;
