import { Link } from "react-router-dom";
import { getToken } from "../../utils/saveAuth";
import paymentDetails from "../../utils/paymentDetails";
import he from "he";

const SplitInvite = ({ toPay, key }: any) => {
  const currentUser = getToken();
  const details = paymentDetails(toPay, currentUser);

  return (
    <>
      <div key={key} className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full rounded-lg font-[sans-serif] overflow-hidden mx-auto mt-4">
        <div className="p-6">
          <p className="mt-2 mb-2 text-lg text-gray-500 leading-relaxed">
            {details.initiator} and {details.splitters.length - 1} other
            splitter/s would like to split the cost for {he.decode(details.name)}, totaling
            $
            {parseFloat(details.totalAmount).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
          <div className="flex items-center justify-center mb-6 mt-2">
            <Link
              type="button"
              className="px-5 py-2.5 rounded-full text-white text-sm tracking-wider font-medium border border-current outline-none bg-blue-700 hover:bg-blue-800 active:bg-blue-700 self-center  -mb-4 mt-4"
              to={`/payment/${details.payment_id}`}
              state={details}
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
