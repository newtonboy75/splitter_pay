import {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import SplitterSingleSection from "./SplitterSingleSection";
import { getToken } from "../../utils/saveAuth";
import { Props } from "../../utils/types/interface";
import { useAuthInterceptor } from "../../hooks/useAuthInterceptor";
import Toast from "../Main/Toast";
import { apiRequest } from "../../utils/api/axios";

//useReducer hook
const splitterReducer = (
  state: any[],
  action: { type: any; value: any; share_amount: number }
) => {
  switch (action.type) {
    case "ADD_USER":
      return [...state, action.value];
    case "UPDATE_AMOUNT":
      const newAmount = action.share_amount / state.length;
      return state.map((splitter: any) => {
        return { ...splitter, share_amount: newAmount.toFixed(2) };
      });
    case "REMOVE_USER":
      return state.filter((splitter) => {
        return splitter.email !== action.value;
      });
    default:
      return state;
  }
};

const SplitNewModal = ({ modalShow }: Props) => {
  const interceptor = useAuthInterceptor();
  const currentUser = getToken();

  //initiate useReducer with the current signed in user details as default
  const initialSplit = [
    {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      share_amount: "0.00",
      payment_status: 0,
      is_initiator: true,
    },
  ];

  const [split_members, dispatch] = useReducer(splitterReducer, initialSplit);
  const [showSplitterSingle, setShowSplitterSingle] = useState(false);
  const [otherSplitters, setOtherSplitters] = useState({
    name: "currentUser.name",
    email: "currentUser.email",
    share_amount: "0.00",
    payment_status: 0,
  });

  const [originalAmount, setOriginalAmount] = useState("");
  const [splitError, setSplitError] = useState("");
  const [amountError, setAmmoutError] = useState("");
  const [showNewSplitCard, setShowNewSplitCard] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [splitSuccess, setSplitSucess] = useState(false);
  const [sending, setSending] = useState(false);

  let nameRef = useRef<HTMLInputElement>(null);
  let emRef = useRef<HTMLInputElement>(null);
  let servProd = useRef<HTMLInputElement>(null);

  //show modal form
  const handleParentFunction = () => {
    modalShow();
  };

  const handleCloseToast = () => {
    modalShow();
    setSplitError("");
    setAmmoutError("");
  };

  //called for the first time
  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    //show the current user
    setSplitError("");
    setAmmoutError("");
    setShowSplitterSingle(true);

    //get the original amount
    setOriginalAmount(value);
    setAmmoutError("");
    let v = parseFloat(value);
    dispatch({
      type: "UPDATE_AMOUNT",
      share_amount: v,
      value: "",
    });
  };

  const addNewSplitterUser = (_event: ChangeEvent<HTMLInputElement>) => {
    let uname = nameRef.current?.value!;
    let email = emRef.current?.value!;

    setSplitError("");
    setAmmoutError("");

    setOtherSplitters({
      name: uname,
      email: email,
      share_amount: "0",
      payment_status: 0,
    });
  };

  const handleServiceName = (event: {
    currentTarget: { value: SetStateAction<string> };
  }) => {
    setServiceName(event.currentTarget.value);
    setSplitError("");
    setAmmoutError("");
  };

  //put this info in reducer
  const saveNewSplitter = () => {
    const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    if (
      nameRef.current?.value === "" ||
      regexEmail.test(emRef.current!.value) === false
    ) {
      setSplitError("Name or email address is required.");

      setAmmoutError("");
    } else {
      dispatch({
        type: "ADD_USER",
        value: otherSplitters,
        share_amount: 0,
      });

      let v = parseFloat(originalAmount);
      dispatch({
        type: "UPDATE_AMOUNT",
        share_amount: v,
        value: undefined,
      });
      setOtherSplitters({
        name: "",
        email: "",
        share_amount: "0",
        payment_status: 0,
      });
      if (nameRef.current) {
        nameRef.current.value = "";
        emRef.current!.value = "";
      }
    }
  };

  //remove a user from the reducer state
  const handleRemoveSplitter = (item: string) => {
    setSplitError("");
    setAmmoutError("");
    dispatch({
      type: "REMOVE_USER",
      value: item,
      share_amount: 0,
    });

    let v = parseFloat(originalAmount);
    dispatch({
      type: "UPDATE_AMOUNT",
      share_amount: v,
      value: "",
    });
  };

  //submi to the server
  const handleSubmitNewSplit = async () => {
    if (
      parseInt(originalAmount) <= 0 ||
      originalAmount === "" ||
      servProd.current?.value === ""
    ) {
      setAmmoutError("Product/service and Amount are required.");
    } else if (split_members.length <= 1) {
      setAmmoutError("Please add at least one splitter.");
    } else {
      const PAYMENTS_URL = "/api/payments";
      const formedSplit = {
        name: serviceName,
        amount: originalAmount,
        initiatorId: currentUser.id,
        date: new Date(),
        splitters: split_members,
      };

      const request = await apiRequest(
        interceptor,
        PAYMENTS_URL,
        "post",
        formedSplit
      );

      setSending(true);

      if (request?.status == 200) {
        setSplitSucess(true);
      }

    }
  };

  useEffect(() => {
    setSplitError("");
    setAmmoutError("");
  }, [showNewSplitCard]);

  return (
    <div className="fixed text-left inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 relative">
        <div className="flex items-center pb-3 border-b border-gray-300">
          <h3 className="text-gray-800 text-xl font-bold flex-1">New Split</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 ml-2 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500"
            viewBox="0 0 320.591 320.591"
            onClick={() => handleParentFunction()}
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
        </div>

        <div className="my-6">
          <div className="mb-3">
            <label className="mb-2 text-base block">Product/Service</label>
            <input
              onChange={(e) => handleServiceName(e)}
              ref={servProd}
              type="text"
              placeholder="(Restaurant Bill)"
              className="px-4 py-2 text-base rounded-md bg-white border border-gray-400 w-full outline-blue-500"
              required
            />
          </div>
          <div className="mb-3">
            <label className="mb-2 text-base block">Amount</label>
            <input
              onChange={(event) => handleAmountChange(event)}
              type="number"
              min="1"
              step="any"
              className="px-4 py-2 text-base rounded-md bg-white border border-gray-400 w-full outline-blue-500"
              required
            />
          </div>

          {showSplitterSingle && (
            <>
              <span>Splitters</span>
              {split_members.map((splitter, key) => {
                return (
                  <div key={key}>
                    <SplitterSingleSection
                      splitDetails={splitter}
                      removeSplitItem={handleRemoveSplitter}
                    />
                  </div>
                );
              })}
              {!showNewSplitCard && (
                <div
                  className="flex justify-center mt-3 hover:cursor-pointer"
                  title="Add Splitter"
                >
                  <svg
                    width="46px"
                    height="46px"
                    viewBox="0 0 20 20"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#000000"
                    onClick={() => setShowNewSplitCard(true)}
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <title>icon/20/circle-add</title>{" "}
                      <desc>Created with Sketch.</desc> <defs> </defs>{" "}
                      <g
                        id="Output-temp"
                        stroke="none"
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                      >
                        {" "}
                        <g
                          id="_archive"
                          transform="translate(-1146.000000, -212.000000)"
                          fill="#e3e3e3"
                        >
                          {" "}
                          <path
                            d="M1156.75,220.805556 L1156.75,218.858224 C1156.75,218.329341 1156.31472,217.888889 1155.77778,217.888889 C1155.23709,217.888889 1154.80556,218.322875 1154.80556,218.858224 L1154.80556,220.805556 L1152.85822,220.805556 C1152.32934,220.805556 1151.88889,221.240834 1151.88889,221.777778 C1151.88889,222.318465 1152.32287,222.75 1152.85822,222.75 L1154.80556,222.75 L1154.80556,224.697332 C1154.80556,225.226215 1155.24083,225.666667 1155.77778,225.666667 C1156.31846,225.666667 1156.75,225.232681 1156.75,224.697332 L1156.75,222.75 L1158.69733,222.75 C1159.22621,222.75 1159.66667,222.314721 1159.66667,221.777778 C1159.66667,221.237091 1159.23268,220.805556 1158.69733,220.805556 L1156.75,220.805556 Z M1155.77738,214 C1151.48216,214 1148,217.482778 1148,221.777778 C1148,226.073578 1151.48216,229.555556 1155.77738,229.555556 C1160.0734,229.555556 1163.55556,226.073578 1163.55556,221.777778 C1163.55556,217.482778 1160.0734,214 1155.77738,214 Z"
                            id="icon/circle-add"
                          >
                            {" "}
                          </path>{" "}
                        </g>{" "}
                      </g>{" "}
                    </g>
                  </svg>
                </div>
              )}
            </>
          )}
        </div>

        <div>
          {showNewSplitCard && (
            <div className="border-2 p-6 `transition-all ease-out duration-1000 ${animate}`">
              <p className="text-lg">Add Splitter</p>
              {splitError !== "" && (
                <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {splitError}
                </p>
              )}
              <form className="max-w-md mx-auto space-y-4 font-[sans-serif] text-[#333] mt-4">
                <input
                  ref={nameRef}
                  onChange={(event) => addNewSplitterUser(event)}
                  name="splitter_name"
                  type="text"
                  placeholder="Name"
                  className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
                />

                <input
                  ref={emRef}
                  onChange={(event) => addNewSplitterUser(event)}
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className="px-4 py-3 bg-gray-100 focus:bg-transparent w-full text-sm outline-[#333] rounded-sm transition-all"
                />

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowNewSplitCard(false)}
                    type="button"
                    className="!mt-8 px-6 py-2.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveNewSplitter}
                    type="button"
                    className="!mt-8 px-6 py-2.5 text-sm bg-orange-800 hover:bg-orange-700 text-white rounded-md mr-4"
                  >
                    Add Splitter
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
        {amountError !== "" && (
          <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {amountError}
          </p>
        )}
        <div className="w-full border-t border-gray-300 pt-6 flex justify-end gap-4">
          <button
            onClick={() => handleParentFunction()}
            type="button"
            className="px-4 py-2 rounded-lg text-gray-800 text-sm border-none outline-none tracking-wide bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
          >
            Close
          </button>
          <button
            onClick={handleSubmitNewSplit}
            type="button"
            className="px-4 py-2 rounded-lg text-white text-sm border-none outline-none tracking-wide bg-blue-600 hover:bg-blue-700 active:bg-blue-600"
            disabled={sending}
          >
            Send Split
          </button>
        </div>
      </div>
      {/* {splitSuccess && <DialogSuccess dialogName={"Split sent!"} desc={"Split sent successfuly."} />} */}
      {/* {openToast && <Toast info={toastInfo} closeToast={handleCloseToast} />} */}

      {splitSuccess && (
        <Toast info={"Split sent successfuly."} closeToast={handleCloseToast} />
      )}
    </div>
  );
};

export default SplitNewModal;
