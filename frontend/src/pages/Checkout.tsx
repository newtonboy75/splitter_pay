import { useLocation } from "react-router-dom";
import { useAuthInterceptor } from "../hooks/useAuthInterceptor";
import { useState } from "react";
import DialogSuccess from "../components/Payments/DialogSuccess";
import Toast from "../components/Main/Toast";

const Checkout = () => {
  const paymentDetails = useLocation();
  const interceptor = useAuthInterceptor();
  const [processingPayment, setProcessingPayment] = useState(false);
  const [successPopup] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [toastInfo, setToastInfo] = useState("");

  //submit checkout 
  const handlePayment = async () => {
    const PAYMENTS_URL = `/api/payments/${paymentDetails.state.id}/pay`;

    try {
      setProcessingPayment(true);
      //setSuccessPopup(false);
      const response = await interceptor.put(
        PAYMENTS_URL,
        JSON.stringify(paymentDetails.state)
      );

      if (response.status === 200) {
        //location.href = "/";
        setToastInfo(`Thank you. Your payment has been recieved!`);
        setOpenToast(true);
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        console.log("Unauthorized");
      } else {
        console.log(err);
      }
    }
  };

  const handleCloseToast = () => {
    //setShowModal(false);
    setOpenToast(false);
  };

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
                    {paymentDetails.state?.name}
                  </h3>

                  <ul className="mt-4 text-sm text-gray-800 space-y-2 text-left">
                    <li>
                      {paymentDetails.state?.payee_name} |{" "}
                      {paymentDetails.state?.email}
                    </li>

                    <li>Initiated by {paymentDetails.state?.initiator}</li>
                    <li>Other Description</li>
                  </ul>

                  <hr className="border-gray-300 my-4" />

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm font-bold text-gray-800">
                        No of splitters
                      </h4>
                      <span>{paymentDetails.state?.num_splitters}</span>
                    </div>

                    <div className="flex items-center">
                      <h4 className="text-lg font-bold text-gray-800">
                        $
                        {parseFloat(
                          paymentDetails.state?.totalAmount
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </h4>
                    </div>
                  </div>
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
                  {parseFloat(paymentDetails.state?.totalAmount).toLocaleString(
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
                Total (You pay)
                <span className="ml-auto">
                  $
                  {parseFloat(
                    paymentDetails.state?.share_amount
                  ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </li>
            </ul>

            <button
              onClick={handlePayment}
              type="button"
              className="mt-4 text-sm px-6 py-3 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              disabled={processingPayment}
            >
              {processingPayment
                ? "Processing payment, please wait..."
                : "Make Payment"}
            </button>
          </div>
        </div>
        {successPopup && (
          <DialogSuccess
            dialogName={"Payment Successful!"}
            desc="Your payment has been processed successfuly."
          />
        )}
      </div>
      {openToast && <Toast info={toastInfo} closeToast={handleCloseToast} />}
    </div>
  );
};

export default Checkout;
