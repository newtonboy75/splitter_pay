import { useLocation } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import useBackButton from "../hooks/useBackButton";
import he from "he";

const CompletedSplits = () => {
  const paymentDetails = useLocation();
  const formattedDateTime = formatDate(paymentDetails.state?.date_paid) ?? "";

  return (
    <div className="font-[sans-serif] bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-50 h-screen pt-28 lg:pt-36 lg:px-52 lg:pr-52">
      {useBackButton()}
      <div className="max-w-7xl max-lg:max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-extrabold text-gray-800">Your split</h2>

        <div className="grid lg:grid-cols-3 gap-4 relative mt-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-6 bg-white shadow-[0_0px_4px_0px_rgba(6,81,237,0.2)] rounded-md relative">
              <div className="flex items-center max-sm:flex-col gap-4 max-sm:gap-6">
                <div className="sm:border-l sm:pl-4 sm:border-gray-300 w-full">
                  <h3 className="text-xl font-bold text-gray-800">
                    {he.decode(paymentDetails.state.name)}
                  </h3>

                  <ul className="mt-4 text-sm text-gray-800 space-y-2 text-left">
                    <li key="payee_">
                      {paymentDetails.state.payee_name} |{" "}
                      {paymentDetails.state.email}
                    </li>

                    <li key="inititedby_">
                      Initiated by {paymentDetails.state.initiator}
                    </li>

                    <li className="font-medium" key="paymentid_">
                      Payment ID: {paymentDetails.state.payment_id}
                    </li>
                    <li className="font-medium" key="completedon_">
                      Completed on: {formattedDateTime}
                    </li>
                  </ul>

                  <hr className="border-gray-300 my-4" />

                  <ul className="text-left text-sm">
                    <li key="splitters_">
                      <h1 className="text-sm font-medium">Splitters</h1>
                    </li>
                    <li className="p-2" key="splitter_">
                      {paymentDetails.state.splitters.map(
                        (splitter: any, key: any) => {
                          return (
                            <div key={key}>
                              <div className="p-1" key={"key" + key}>
                                {splitter.name} | {splitter.email}
                              </div>
                              <div className="p-1" key={"key_" + Math.random()}>
                                Paid on {formattedDateTime}
                              </div>
                            </div>
                          );
                        }
                      )}
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

export default CompletedSplits;
