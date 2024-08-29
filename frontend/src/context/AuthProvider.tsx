import { createContext, useState } from "react";
import { AuthContextInterface, UserData } from "../utils/types/interface";
import { setToken } from "../utils/saveAuth";

const AuthContext = createContext<AuthContextInterface>({
  auth: {
    id: "",
    name: "",
    email: "",
    password: "",
    accessToken: "",
    refreshToken: "",
  },
  setAuth: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [auth, setAuth] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    accessToken: "",
    refreshToken: "",
  });

  if (auth.accessToken !== "") {
    const { ["password"]: data, ...rest } = auth;
    const userData: UserData = rest;
    setToken(JSON.stringify(userData));
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
