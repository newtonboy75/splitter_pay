import { useLocation } from "react-router-dom";

const ActiveDetails = () => {
  const paymentDetails = useLocation();
  const splitters = Array.from(paymentDetails.state.splitters);

  const formatDate = (datetime: string | number | Date) => {
    const date = new Date(datetime);
    const formattedDateTime = date
      .toISOString()
      .replace("T", " ")
      .split(".")[0];
    return formattedDateTime;
  };

  return (
    <div className="h-screen pt-32 lg:w-1/2 mx-auto">
      <a
        className="text-left text-white float-left ml-6"
        onClick={() => (window.location.href = "/")}
      >
        &lsaquo; Back
      </a>
      <div className="p-8 font-[sans-serif] ">
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
                        <ul className="mt-6">
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
  );
};

export default ActiveDetails;
