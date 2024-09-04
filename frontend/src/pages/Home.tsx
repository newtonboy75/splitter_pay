import { Suspense } from "react";
import SplitInvite from "../components/Splits/SplitInvite";
import SplitsActive from "../components/Splits/SplitsActive";
import SplitsRecent from "../components/Splits/SplitsRecent";
import { useAuthInterceptor } from "../hooks/useAuthInterceptor";
import SplitsRecentInvites from "../components/Splits/SplitsRecentInvites";
import { getToken } from "../utils/saveAuth";
import Toast from "../components/Main/Toast";
import { useSplitsData } from "./useSplitsData";
import { useWebSocketHandler } from "./useWebSocketHandler";

const Home = () => {
  const current_user = getToken(); //get current logged user
  const interceptor = useAuthInterceptor(); //axios interceptor

  //start Websocket
  const { triggerRefresh, toastInfo, openToast, setOpenToast } =
    useWebSocketHandler("ws://localhost:3000", current_user);

  //get all incoming messages from Websocket
  const { activeSplitList, paidSplitList, splitstoPay, invitedtoPay } =
    useSplitsData(current_user, interceptor, triggerRefresh);
  const handleCloseToast = () => {
    setOpenToast(false);
  };

  return (
    <>
      <div className="text-right pt-32 pb-[28px] pl-6 pr-6 text-gray-200 font-medium]">
        <div className="p-2">Hello {current_user.name}</div>
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
                  {splitstoPay.map((split, key) => {
                    <h2 className="text-[#ececec] text-left font-extrabold mb-6">
                      Recent Splits
                    </h2>;
                    return <SplitInvite toPay={split} key={key} />;
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
                  {paidSplitList.map((split, key) => {
                    return <SplitsRecent split={split} key={key} />;
                  })}
                </Suspense>

                {invitedtoPay.length >= 1 && (
                  <h2 className="text-[#ececec] text-left font-extrabold mb-6 mt-16">
                    Paid Splits (All your paid splits.)
                  </h2>
                )}

                <Suspense>
                  {invitedtoPay.map((split, key) => {
                    return <SplitsRecentInvites split={split} key={key} />;
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
