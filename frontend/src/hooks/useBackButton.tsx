import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useBackButton = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);
  return (
    <>
      <button
        className="text-left float-left ml-6"
        onClick={() => navigate("/")}
      >
        &lsaquo; Back
      </button>
    </>
  );
};

export default useBackButton;
