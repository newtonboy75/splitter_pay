import { useEffect } from "react";
import { axiosPrivate } from "../utils/api/axios";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { getToken, setToken } from "../utils/saveAuth";

export const useAuthInterceptor = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      async (config: { headers: any }) => {
        const token = await getToken().accessToken;

        if (token !== "") {
          config.headers.Authorization = `Bearer ${token}`;
        }
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
          setToken(JSON.stringify(newAccessToken));
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
