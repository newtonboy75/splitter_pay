import axios, { AxiosInstance } from "axios";
const BASE_URL = "http://localhost:3000";

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

//Start api request to server
export const apiRequest = async (interceptor: AxiosInstance, url: string) => {
  try {
    const response = await interceptor.get(url);
    return response;
  } catch (err: any) {
    if (err.response?.status === 401) {
      console.log("Unauthorized");
    } else {
      console.log(err);
    }
  }
};
