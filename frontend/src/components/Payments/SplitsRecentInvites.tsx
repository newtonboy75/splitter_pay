import { Link } from "react-router-dom";
import { getToken } from "../../utils/saveAuth";
import paymentDetails from "../../utils/paymentDetails";

const SplitsRecentInvites = ({ split }: any) => {
  const currentUser = getToken();
  const details = paymentDetails(split, currentUser)

  return (
    <>
      <div className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full rounded-lg font-[sans-serif] overflow-hidden mx-auto mt-4 text-left">
        <div className="p-6">
          <h3 className="text-2xl font-semibold">{split.name}</h3>
          <p className="text-2xl  text-gray-500">
            $
            {parseFloat(split.amount).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}{" "}
          </p>
          <div className="mt-2 text-sm text-gray-500 leading-relaxed">
            <p>No of Splitters: {split.splitters.length}</p>
            <p>Initiated by {details.initiator.name}</p>
            <p>Paid on {details.date_paid}</p>
          </div>

          <div className="float-right mb-6 mt-4">
            <Link
              type="button"
              className="px-5 py-2.5 rounded-full text-white text-sm tracking-wider font-medium border border-current outline-none bg-blue-700 hover:bg-blue-800 active:bg-blue-700 self-center  -mb-4 mt-6"
              to={`/paid/${split.id}`}
              state={details}
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SplitsRecentInvites;
