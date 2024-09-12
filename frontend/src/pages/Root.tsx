import { Navigate, Outlet } from "react-router-dom";
import Heading from "../components/Main/Heading";
import useAuth from "../hooks/useAuth";

const Root = () => {
  const { auth } = useAuth();

  return auth ? (
    <>
      <Heading />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default Root;
