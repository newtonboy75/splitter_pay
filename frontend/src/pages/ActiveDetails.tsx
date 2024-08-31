import { useLocation } from "react-router-dom";
import DialogAlert from "../components/Payments/DialogAlert";
import { useState } from "react";
import { useAuthInterceptor } from "../hooks/useAuthInterceptor";
import Toast from "../components/Main/Toast";
import { formatDate } from "../utils/formatDate";
import { apiRequest } from "../utils/api/axios";

const ActiveDetails = () => {
  const paymentDetails = useLocation();
  const splitters = Array.from(paymentDetails.state.splitters);
  const [showDialogAlert, setShowDialogAlert] = useState(false);
  const interceptor = useAuthInterceptor();
  const [openToast, setOpenToast] = useState(false);
  const [toastInfo, setToastInfo] = useState("");

  const handleCancellation = () => {
    setShowDialogAlert(true);
  };

  //delete submission
  const handleOption = async (option: boolean) => {
    
    if (option === false) { //close dialog alert
      setShowDialogAlert(false);
    } else { //submit if yes
      const PAYMENTS_URL = `/api/payments/${paymentDetails.state._id}/delete`;
      const request = await apiRequest(interceptor, PAYMENTS_URL, 'delete', { data: { splitters: paymentDetails.state } })

      if(request.status === 200){
          setShowDialogAlert(false);
          setToastInfo(`Split has been cancelled.`);
          setOpenToast(true);
      }
    }
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  return (
    <>
      <div className="h-screen pt-32 lg:w-1/2 mx-auto">
        <a
          className="text-left text-white float-left ml-6"
          onClick={() => (window.location.href = "/")}
        >
          &lsaquo; Back
        </a>
        <div className="p-4 font-[sans-serif] ">
          <h1 className="text-2xl text-white font-bold mb-6">Active Split</h1>

          <div className="text-left mx-auto">
            <div className="bg-white rounded-lg">
              <div className="max-w-screen-md mx-auto  sm:px-6 lg:px-8">
                <div className="mt-2">
                  <ul className="">
                    <li className="text-left mb-10">
                      <div className="flex flex-row items-start">
                        <div className="p-5 pb-10 ">
                          <h4 className="text-lg leading-6 font-semibold text-gray-900">
                            {paymentDetails.state.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Initiated on {formatDate(paymentDetails.state.date)}
                          </p>
                          <ul className="mt-6 mb-4 w-full">
                            {splitters.map((splitter: any) => {
                              return (
                                <div>
                                  <li className="mb-6">
                                    <div className="flex gap-6">
                                      <p>
                                        <img
                                          src="https://readymadeui.com/team-4.webp"
                                          className="w-16 h-16 rounded-full"
                                        />
                                      </p>
                                      <div>
                                        <p>{splitter.name}</p>
                                        <p>{splitter.email}</p>
                                        {splitter.payment_status !== 3 ? (
                                          <p className="text-gray-400">
                                            <i>Pending payment</i>
                                          </p>
                                        ) : (
                                          <p className="text-green-600">
                                            <i>
                                              Payment made on{" "}
                                              {formatDate(splitter.date_paid)}
                                            </i>
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </li>
                                </div>
                              );
                            })}
                            <li>
                              <div className="flex justify-center items-center ml-12">
                                <button
                                  onClick={handleCancellation}
                                  type="button"
                                  className="px-5 py-2.5 rounded-full text-white text-sm tracking-wider font-medium border border-current outline-none bg-red-700 hover:bg-red-800 active:bg-red-700"
                                >
                                  Cancel transaction
                                </button>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDialogAlert && <DialogAlert handleOption={handleOption} />}
      {openToast && <Toast info={toastInfo} closeToast={handleCloseToast} />}
    </>
  );
};

export default ActiveDetails;
