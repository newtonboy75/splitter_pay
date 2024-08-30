import { useLocation } from "react-router-dom";
import { formatDate } from "../utils/formatDate";

const Recents = () => {
  const paymentDetails = useLocation();
  const formattedDateTime = formatDate(paymentDetails.state?.date_paid) ?? "";

  return (
    <div className="font-[sans-serif] bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-50 h-screen pt-28 lg:pt-36 lg:px-52 lg:pr-52">
      <a
        className="text-left float-left ml-6"
        onClick={() => (window.location.href = "/")}
      >
        &lsaquo; Back
      </a>
      <div className="max-w-7xl max-lg:max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-extrabold text-gray-800">Your split</h2>

        <div className="grid lg:grid-cols-3 gap-4 relative mt-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 bg-white shadow-[0_0px_4px_0px_rgba(6,81,237,0.2)] rounded-md relative">
              <div className="flex items-center max-sm:flex-col gap-4 max-sm:gap-6">
                <div className="sm:border-l sm:pl-4 sm:border-gray-300 w-full">
                  <h3 className="text-xl font-bold text-gray-800">
                    {paymentDetails.state.name}
                  </h3>

                  <ul className="mt-4 text-sm text-gray-800 space-y-2 text-left">
                    <li>
                      {paymentDetails.state.payee_name} |{" "}
                      {paymentDetails.state.email}
                    </li>

                    <li>Initiated by {paymentDetails.state.initiator}</li>

                    <li className="font-medium">
                      Payment ID: {paymentDetails.state.payment_id}
                    </li>
                    <li className="font-medium">
                      Completed on: {formattedDateTime}
                    </li>
                  </ul>

                  <hr className="border-gray-300 my-4" />

                  <ul className="text-left text-sm">
                    <li>
                      <h1 className="text-sm font-medium">Splitters</h1>
                    </li>
                    <li className="p-2">
                      {paymentDetails.state.splitters.map((splitter: any) => {
                        return (
                          <>
                            <div className="p-1">
                              {splitter.name} | {splitter.email}
                            </div>
                            <div className="p-1">
                              Paid on {formattedDateTime}
                            </div>
                          </>
                        );
                      })}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white h-max rounded-md p-6 shadow-[0_0px_4px_0px_rgba(6,81,237,0.2)] sticky top-0">
            <h3 className="text-xl font-bold text-gray-800">Summary</h3>

            <ul className="text-gray-800 text-sm divide-y mt-4">
              <li className="flex flex-wrap gap-4 py-3">
                Subtotal{" "}
                <span className="ml-auto font-bold">
                  {parseFloat(paymentDetails.state.totalAmount).toLocaleString(
                    undefined,
                    { maximumFractionDigits: 2 }
                  )}
                </span>
              </li>
              <li className="flex flex-wrap gap-4 py-3">
                /{" "}
                <span className="ml-auto font-bold">
                  {paymentDetails.state.num_splitters}
                </span>
              </li>

              <li className="flex flex-wrap gap-4 py-3 font-bold">
                Total
                <span className="ml-auto">
                  $
                  {parseFloat(paymentDetails.state.share_amount).toLocaleString(
                    undefined,
                    { maximumFractionDigits: 2 }
                  )}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recents;
