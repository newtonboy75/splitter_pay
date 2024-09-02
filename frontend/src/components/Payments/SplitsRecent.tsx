import { Link } from "react-router-dom";
import { getToken } from "../../utils/saveAuth";
import paymentDetails from "../../utils/paymentDetails";

const SplitsRecent = ({ split, key }: any) => {

  const currentUser = getToken();
  const details = paymentDetails(split, currentUser)

  return (
    <>
      <div key={key} className="bg-white shadow-[0_4px_12px_-5px_rgba(0,0,0,0.4)] w-full rounded-lg font-[sans-serif] overflow-hidden mx-auto mt-4 text-left">
        <div className="p-6">
          <h3 className="text-2xl font-semibold">{split.name}</h3>
          <p className="text-2xl  text-gray-500">
            $
            {parseFloat(split.amount).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}{" "}
            <span className="bg-green-600 px-2 py-1 text-xs text-white rounded">
              Paid
            </span>
          </p>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Splitters
          </p>
          <div className="space-x-10 flex items-center justify-center">
            {split.splitters.map((split: any) => {
              return (
                <div key={split.id} className="relative inline-block">
                  <img
                    src="https://readymadeui.com/team-4.webp"
                    className="w-16 h-16 rounded-full"
                  />
                  <span className="h-3 w-3 rounded-full border border-white bg-green-500 block absolute bottom-1 right-0"></span>
                </div>
              );
            })}
          </div>
          <div className="float-right mb-6 mt-4">
            <Link
              type="button"
              className="px-5 py-2.5 rounded-full text-white text-sm tracking-wider font-medium border border-current outline-none bg-orange-700 hover:bg-orange-800 active:bg-orange-700 self-center  -mb-4 mt-6"
              to={`/paid/${details.id}`} state={details}
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SplitsRecent;
