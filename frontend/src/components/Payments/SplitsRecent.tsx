import { Link } from "react-router-dom";
import { getToken } from "../../utils/saveAuth";

const SplitsRecent = ({ split }: any) => {
  const currentUser = getToken();

  const splitters = Array.from(split.splitters);
  const payee: any = splitters.filter((split: any) => {
    return split.email === currentUser.email;
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
    splitters: splitters
  };

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
              className="px-5 py-2.5 rounded-full text-white text-sm tracking-wider font-medium border border-current outline-none bg-blue-700 hover:bg-blue-800 active:bg-blue-700 self-center  -mb-4 mt-6"
              to={`/paid/${paymentDetails.id}`} state={paymentDetails}
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
