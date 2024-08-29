import { useState, useEffect, useLayoutEffect } from "react";
import SplitInvite from "../components/Payments/SplitInvite";
import SplitsActive from "../components/Payments/SplitsActive";
import SplitsRecent from "../components/Payments/SplitsRecent";
import { useAuthInterceptor } from "../hooks/useAuthInterceptor";
import { getToken } from "../utils/saveAuth";
import SplitsRecentInvites from "../components/Payments/SplitsRecentInvites";
import Toast from "../components/Main/Toast";

const Home = () => {
  const interceptor = useAuthInterceptor();
  const [activeSplitList, setActiveSplitList] = useState([]);
  const [paidSplitList, setPaidSplitList] = useState([]);
  const [splitstoPay, setSplitsToPay] = useState([]);
  const [invitedtoPay, setInvitedToPay] = useState([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const current_user = getToken();
  const [openToast, setOpenToast] = useState(false);
  const [toastInfo, setToastInfo] = useState("");
  const [triggerRefresh, setTriggerRefresh] = useState(0);


  const connectWebSocket = () => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.onopen = () => {
      //console.log("WebSocket connection established");
      setRetryCount(0); //reset connection if unssuccessful

      // Send ping every 30 secs
      const pingInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "ping" }));
        }
      }, 30000);

      (socket as any).pingInterval = pingInterval;
    };

    socket.onmessage = (event) => {

      if(event.data === "ebSocket connection established"){
        setTriggerRefresh(Math.random());
      }

      if (event.data !== "ok bye") {
        const data = JSON.parse(event.data);

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
        } else if(data.disposition === "payment_cancelled") {
          console.log(data)
          const initiator = data.data.splitters.splitters.filter((splitter: any) => {
            return splitter
          })
          console.log(initiator)

          const split_user = data.data.splitters.splitters.filter((splitter: { email: any; }) => {
            return splitter.email === current_user.email
          })


          setToastInfo(`${initiator[0].name} cancelled ${data.data.splitters.name} and don't want to split the bill anymore.`);
          setOpenToast(true);
          setTriggerRefresh(Math.random());
          console.log(split_user)

        }
      }
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
      clearInterval((socket as any).pingInterval);

      if (retryCount < 5) {
        // Limit the number of reconnection attempts
        const timeout = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff
        console.log(`Reconnecting in ${timeout / 1000} seconds...`);
        setTimeout(connectWebSocket, timeout);
        setRetryCount(retryCount + 1);
      } else {
        console.error("Max reconnection attempts reached. Giving up.");
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      socket.close(); // Close the socket and trigger the onclose event
    };

    setWs(socket);
  };

  useLayoutEffect(() => {
    connectWebSocket();

    // Cleanup on component unmount
    return () => {
      if (ws) {
        clearInterval((ws as any).pingInterval);
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    const PAYMENTS_URL =
      "/api/payments?status=active&initiator=" + current_user.id;

    const getAllPayments = async () => {
      try {
        const response = await interceptor.get(PAYMENTS_URL);

        if (response.status === 200) {
          const list = response.data.reverse();
          setActiveSplitList(list);
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          console.log("Unauthorized");
        } else {
          console.log(err);
        }
      }
    };

    getAllPayments();
  }, [triggerRefresh]);

  //Get all splits that you initiated and all splitters have paid
  useEffect(() => {
    const PAYMENTS_URL =
      "/api/payments?status=paid&initiator=" + current_user.id;

    const getAllPaidSplits = async () => {
      try {
        const response = await interceptor.get(PAYMENTS_URL);

        if (response.status === 200) {
          const list = response.data.reverse();
          setPaidSplitList(list);
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          console.log("Unauthorized");
        } else {
          console.log(err);
        }
      }
    };

    getAllPaidSplits();
  }, [triggerRefresh]);

  useEffect(() => {
    const PAYMENTS_URL =
      "/api/payments?status=toPay&email=" + current_user.email;

    const getAllSplitsToPay = async () => {
      try {
        const response = await interceptor.get(PAYMENTS_URL);

        if (response.status === 200) {
          const splitsToPay = response.data.reverse();
          setSplitsToPay(splitsToPay);
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          console.log("Unauthorized");
        } else {
          console.log(err);
        }
      }
    };

    getAllSplitsToPay();
  }, [triggerRefresh]);

  useEffect(() => {
    const PAYMENTS_URL =
      "/api/payments?status=invited&email=" + current_user.email;

    const getAllSplitsInvitedToPay = async () => {
      try {
        const response = await interceptor.get(PAYMENTS_URL);

        if (response.status === 200) {
          const splitsToPay = response.data.reverse();
          setInvitedToPay(splitsToPay);
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          console.log("Unauthorized");
        } else {
          console.log(err);
        }
      }
    };

    getAllSplitsInvitedToPay();
  }, [triggerRefresh]);

  const handleCloseToast = () => {
    //setShowModal(false);
    setOpenToast(false);
  };

  return (
    <>
      <div className="text-right pt-32 pl-6 pr-6 text-gray-200 font-medium">
        Hello {current_user.name}
      </div>
      <div className="pb-10">
        <div className="font-[sans-serif] text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-36">
            <div className="grid grid-cols-1 gap-y-10 md:grid-cols-2 gap-x-12">
              <div>
                <h2 className="text-[#ececec] text-left font-extrabold mb-6">
                  Recent Splits
                </h2>
                {splitstoPay.map((split) => {
                  return <SplitInvite toPay={split} />;
                })}
                {activeSplitList && (
                  <h2 className="text-[#ececec] text-left font-extrabold mb-6 mt-16">
                    Active Splits
                  </h2>
                )}
                {activeSplitList.map((split) => {
                  return <SplitsActive split={split} />;
                })}
              </div>
              <div>
                {paidSplitList && (
                  <h2 className="text-[#ececec] text-left font-extrabold mb-6">
                    Completed Splits (All your initiated splits that has been paid,
                    or no pending payment.)
                  </h2>
                )}

                {paidSplitList.map((split) => {
                  return <SplitsRecent split={split} />;
                })}

                {invitedtoPay && (
                  <h2 className="text-[#ececec] text-left font-extrabold mb-6 mt-16">
                    Paid Splits (All your paid splits.)
                  </h2>
                )}

                {invitedtoPay.map((split) => {
                  return <SplitsRecentInvites split={split} />;
                })}
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
