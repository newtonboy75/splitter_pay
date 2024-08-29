import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/saveAuth";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}): React.ReactNode => {
  const navigate = useNavigate();
  const userData = getToken();

  useEffect(() => {
    if (userData === null) {
      navigate("/login");
    }
  });
  return children;
};

export default ProtectedRoute;
