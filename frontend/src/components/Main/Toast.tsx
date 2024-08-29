import { useLocation } from "react-router-dom";

const Toast = ({ info, closeToast }: any) => {
  const { pathname } = useLocation();

  const handleCloseToast = () => {
    closeToast();
    if (pathname.includes("/payment/") || pathname.includes("/active/")) {
      location.href = "/";
    }
  };

  return (
    <div
      className="bg-green-500 text-white font-semibold tracking-wide flex items-center w-max max-w-sm p-4 rounded-md shadow-md shadow-green-200 mx-auto mt-4 font-[sans-serif] bottom-5 right-5 fixed transition-2"
      role="alert"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-[18px] shrink-0 fill-white inline mr-3"
        viewBox="0 0 512 512"
      >
        <ellipse
          cx="256"
          cy="256"
          fill="#fff"
          data-original="#fff"
          rx="256"
          ry="255.832"
        />
        <path
          className="fill-green-500"
          d="m235.472 392.08-121.04-94.296 34.416-44.168 74.328 57.904 122.672-177.016 46.032 31.888z"
          data-original="#ffffff"
        />
      </svg>

      <span className="block sm:inline text-sm mr-3">{info}</span>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-3 cursor-pointer shrink-0 fill-white ml-auto"
        viewBox="0 0 320.591 320.591"
        onClick={handleCloseToast}
      >
        <path
          d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
          data-original="#000000"
        />
        <path
          d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
          data-original="#000000"
        />
      </svg>
    </div>
  );
};

export default Toast;
