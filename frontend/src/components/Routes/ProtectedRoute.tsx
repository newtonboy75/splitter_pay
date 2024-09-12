import React, {  } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../../utils/saveAuth";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}): React.ReactNode => {
 
  const userData = getToken();

    if (!userData) {
      return <Navigate to="/login" replace />;
    }

  return children;
};

export default ProtectedRoute;
