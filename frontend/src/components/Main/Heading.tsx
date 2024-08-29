import { useState } from "react";
import logo from "../../assets/Klearly-Logo-@2x.webp";
import SplitNewModal from "../Payments/SplitNewModal";
import { useLocation } from "react-router-dom";

const Heading = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userData");
    window.location.href = "/login";
  };

  const handleNewModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <header className="flex border-b py-4 px-4 sm:px-10 bg-white font-sans min-h-[70px] tracking-wide z-50 fixed w-full">
        <div className="flex flex-wrap items-center gap-4 w-full">
          <div>
            <a href="/">
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

            <a onClick={handleLogout} href="#">
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
            </a>
          </div>
        </div>
      </header>
      {showModal && <SplitNewModal modalShow={handleNewModal} />}
    </>
  );
};

export default Heading;
