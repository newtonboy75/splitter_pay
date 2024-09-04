import { useEffect, useRef } from "react";

const useBackButton = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    buttonRef.current?.focus();
  }, []);
  return (
    <>
      <button
        ref={buttonRef}
        className="text-left float-left ml-6"
        onClick={() => (window.location.href = "/")}
      >
        &lsaquo; Back
      </button>
    </>
  );
};

export default useBackButton;
