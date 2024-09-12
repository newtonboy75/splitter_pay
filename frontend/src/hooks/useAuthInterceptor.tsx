import { useEffect } from "react";
import { axiosPrivate } from "../utils/api/axios";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

export const useAuthInterceptor = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();
  const storedAuth = sessionStorage?.getItem("tempAuthToken")!;

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config) => {
        let token = auth?.accessToken; //check if authToken is set

        if (!auth?.accessToken) {
          //user reloaded, use sessionStorge dta
          await new Promise((resolve) => {
            const storedAccessToken = JSON.parse(storedAuth);

            token = storedAccessToken.accessToken;
            if (typeof storedAccessToken.accessToken === "string") {
              token = storedAccessToken.accessToken;
            }

            resolve(true);
          });
        }

        config.headers.Authorization = `Bearer ${token}`;
        sessionStorage.removeItem("tempAuthToken"); //remove stored auth from sessionStorage immediately

        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
   
        const prevReq = error.config;
        if (
          error?.respose?.status === 403 &&
          !prevReq?.sent &&
          error?.respose?.status === 401
        ) {
          prevReq.sent = true;
          const newAccessToken = await refresh();

          prevReq.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevReq);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};
