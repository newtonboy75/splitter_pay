import { useState, useEffect, Suspense } from "react";
import SplitInvite from "../components/Payments/SplitInvite";
import SplitsActive from "../components/Payments/SplitsActive";
import SplitsRecent from "../components/Payments/SplitsRecent";
import { useAuthInterceptor } from "../hooks/useAuthInterceptor";
import SplitsRecentInvites from "../components/Payments/SplitsRecentInvites";
import { apiRequest } from "../utils/api/axios";
import { getToken } from "../utils/saveAuth";
import Toast from "../components/Main/Toast";
import useWebSocket from "../hooks/useWebSocket";

const Home = () => {
  const current_user = getToken(); //get current logged user
  const interceptor = useAuthInterceptor(); //axios interceptor
  const [activeSplitList, setActiveSplitList] = useState([]);
  const [paidSplitList, setPaidSplitList] = useState([]);
  const [splitstoPay, setSplitsToPay] = useState([]);
  const [invitedtoPay, setInvitedToPay] = useState([]);
  const [openToast, setOpenToast] = useState(false);
  const [toastInfo, setToastInfo] = useState("");
  const [triggerRefresh, setTriggerRefresh] = useState(0); //re-renders upon message from websocket

  //start websocket
  const { lastMessage, readyState } = useWebSocket("ws://localhost:3000");

  useEffect(() => {
    if (lastMessage === "WebSocket connection established") {
      setTriggerRefresh(Math.random());
    }

    if (lastMessage !== "ok bye") {
      if (typeof Object(lastMessage) && lastMessage !== null) {
        const data = JSON.parse(lastMessage);

        if (data.to === "splitters") {
          const splitter = data.data.splitters.filter(
            (splitter: { email: any }) => {
              return splitter.email === current_user.email;
            }
          );

          const initiator = data.data.splitters.filter(
            (splitter: { is_initiator: boolean }) => {
              return splitter.is_initiator === true;
            }
          );

          if (splitter[0]["is_initiator"] !== true) {
            setToastInfo(
              `${initiator[0]["name"]} would like to split the cost for ${data.data.name} for $${splitter[0]["share_amount"]}`
            );
            setOpenToast(true);
          }
          setTriggerRefresh(Math.random());
        } else if (data.to === "initiator") {
          if (current_user.id === data.data.initiator_id) {
            setToastInfo(
              `Payment of $${data.data.share_amount} was received from ${data.data.payee} for ${data.data.name}.`
            );
            setOpenToast(true);
          } else if (data.data.email === current_user.email) {
            setToastInfo(`Thank you. Your payment has been recieved!`);
            setOpenToast(true);
          }

          setTriggerRefresh(Math.random());
        } else if (data.disposition === "payment_cancelled") {
          //console.log(data);
          const initiator = data.data.splitters.splitters.filter(
            (splitter: any) => {
              return splitter;
            }
          );
    

          setToastInfo(
            `${initiator[0].name} cancelled ${data.data.splitters.name} and don't want to split the bill anymore.`
          );
          setOpenToast(true);
          setTriggerRefresh(Math.random());

        }
      }
    }
  }, [lastMessage, readyState]);

  //get all recent splits
  useEffect(() => {
    const endPoints = [
      {
        url: `/api/payments?status=active&initiator=${current_user.id}`,
        toState: "active",
      },
      {
        url: `/api/payments?status=paid&initiator=${current_user.id}`,
        toState: "paid",
      },
      {
        url: `/api/payments?status=toPay&email=${current_user.email}`,
        toState: "topay",
      },
      {
        url: `/api/payments?status=invited&email=${current_user.email}`,
        toState: "invited",
      },
    ];

    endPoints.map(async (endPoint) => {
      const request = await apiRequest(interceptor, endPoint.url, 'get');

      if (request?.status === 200) {
        const list = request.data.reverse();

        if (endPoint.toState === "active") {
          setActiveSplitList(list); //save all active splits
        } else if (endPoint.toState === "paid") {
          setPaidSplitList(list); //save all completed splits
        } else if (endPoint.toState === "topay") {
          setSplitsToPay(list); //save all pending for payment
        } else {
          setInvitedToPay(list); //save all new splits
        }
      }
    });
  }, [triggerRefresh]);

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  return (
    <>
      <div className="text-right pt-32 pb-[28px] pl-6 pr-6 text-gray-200 font-medium]">
        Hello {current_user.name}
      </div>
      <div className="pb-10">
        <div className="font-[sans-serif] text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-36">
            <div className="grid grid-cols-1 gap-y-10 md:grid-cols-2 gap-x-12">
              <div>
                {paidSplitList.length <= 0 &&
                splitstoPay.length <= 0 &&
                activeSplitList.length <= 0 &&
                invitedtoPay.length <= 0 ? (
                  <div className="text-black text-center ">
                    <div className="text-white pt-52">
                      No split transaction yet. Please create new.
                    </div>
                  </div>
                ) : (
                  ""
                )}

                <Suspense>
                  {splitstoPay.map((split) => {
                    <h2 className="text-[#ececec] text-left font-extrabold mb-6">
                      Recent Splits
                    </h2>;
                    return <SplitInvite toPay={split} />;
                  })}
                </Suspense>

                <Suspense>
                  {activeSplitList.length >= 1 && (
                    <h2 className="text-[#ececec] text-left font-extrabold mb-6 mt-16">
                      Active Splits
                    </h2>
                  )}
                  {activeSplitList.map((split) => {
                    return <SplitsActive split={split} />;
                  })}
                </Suspense>
              </div>
              <div>
                {paidSplitList.length >= 1 && (
                  <h2 className="text-[#ececec] text-left font-extrabold mb-6">
                    Completed Splits (All your initiated splits that has been
                    paid, or no pending payment.)
                  </h2>
                )}
                <Suspense>
                  {paidSplitList.map((split) => {
                    return <SplitsRecent split={split} />;
                  })}
                </Suspense>

                {invitedtoPay.length >= 1 && (
                  <h2 className="text-[#ececec] text-left font-extrabold mb-6 mt-16">
                    Paid Splits (All your paid splits.)
                  </h2>
                )}

                <Suspense>
                  {invitedtoPay.map((split) => {
                    return <SplitsRecentInvites split={split} />;
                  })}
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openToast && <Toast info={toastInfo} closeToast={handleCloseToast} />}
    </>
  );
};

export default Home;
