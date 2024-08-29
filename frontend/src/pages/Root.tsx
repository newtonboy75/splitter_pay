import { Outlet, useNavigate } from "react-router-dom";
import Heading from "../components/Main/Heading";
import { getToken } from "../utils/saveAuth";
import { useEffect } from "react";

const Root = () => {
  const userData = getToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate("/login");
    }
  }, [userData]);

  return (
    <>
      {userData && <Heading />}
      {userData && <Outlet />}
    </>
  );
};

export default Root;
