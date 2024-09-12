import { useState } from "react";
import logo from "../../assets/Klearly-Logo-@2x.webp";
import SplitNewModal from "../Splits/SplitNewModal";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils/api/axios";
import { useAuthInterceptor } from "../../hooks/useAuthInterceptor";
import { removeToken } from "../../utils/saveAuth";

const Heading = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const interceptor = useAuthInterceptor();

  const handleLogout = async () => {
    const PAYMENTS_URL = `/api/logout`;
    const request = await apiRequest(interceptor, PAYMENTS_URL, "get");

    if (request?.status === 200) { //logout user from server
      removeToken();
      navigate("/login");
    }
  };

  const handleNewModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <header className="flex border-b py-4 px-4 sm:px-10 bg-white font-sans min-h-[70px] tracking-wide z-50 fixed w-full">
        <div className="flex flex-wrap items-center gap-4 w-full">
          <div>
            <a onClick={() => navigate("/")} className="cursor-pointer">
              <img
                src={logo}
                className="sm:w-1/4 xs:w-1/4 md:w-1/2 lg:w-1/2 m-auto w-36"
              />
            </a>
            <div className="text-orange-700 text-lg font-semibold mr-1">
              Splitter Pay
            </div>
          </div>

          <div className="flex items-center ml-auto space-x-6">
            {pathname === "/" && (
              <a
                href="#"
                className="hover:text-[#007bff] text-gray-600 block font-bold text-[15px]"
              >
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="px-5 py-2.5 rounded-full text-white text-sm tracking-wider font-medium border border-current outline-none bg-orange-700 hover:bg-orange-800 active:bg-orange-700"
                >
                  New Split
                </button>
              </a>
            )}

            <button onClick={() => setShowAlert(true)}>
              <svg
                className="h-8 w-8 text-orange-700"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                {" "}
                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />{" "}
                <path d="M7 12h14l-3 -3m0 6l3 -3" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      {showModal && <SplitNewModal modalShow={handleNewModal} />}
      {showAlert && (
        <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
          <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 float-right"
              viewBox="0 0 320.591 320.591"
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
              ></path>
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
              ></path>
            </svg>

            <div className="my-4 text-center">
              <h4 className="text-gray-800 text-base font-semibold mt-4">
                Are you sure you want to log out?
              </h4>

              <div className="text-center space-x-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowAlert(false)}
                  className="px-4 py-2 rounded-lg text-gray-800 text-sm bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleLogout()}
                  className="px-4 py-2 rounded-lg text-white text-sm bg-red-600 hover:bg-red-700 active:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Heading;
