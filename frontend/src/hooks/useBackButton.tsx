import { useEffect } from "react";

const useBackButton = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);
  return (
    <>
      <button
        className="text-left float-left ml-6"
        onClick={() => (window.location.href = "/")}
      >
        &lsaquo; Back
      </button>
    </>
  );
};

export default useBackButton;
