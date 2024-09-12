import { createContext, useEffect, useState } from "react";
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
    const { ...rest } = auth;
    const userData: UserData = rest;

    type PersonWithoutId = Omit<UserData, "accessToken" | "refreshToken">;

    const personWithoutId: PersonWithoutId = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
    };

    setToken(JSON.stringify(personWithoutId));
  }

  useEffect(() => {
    // Simulate fetching auth state from storage
    const storedAuth = sessionStorage.getItem("tempAuthToken");
    if (storedAuth) {
      setAuth({
        ...JSON.parse(storedAuth),
      });
    } else {
      setAuth((prevAuth) => ({
        ...prevAuth,
      }));
      console.log(auth);
    }

    setTimeout(() => {
      sessionStorage.removeItem("tempAuthToken");
    }, 3000);
  }, []);

  useEffect(() => {
    // Before unload, store the auth state in sessionStorage
    const handleBeforeUnload = () => {
      sessionStorage.setItem("tempAuthToken", JSON.stringify(auth));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
