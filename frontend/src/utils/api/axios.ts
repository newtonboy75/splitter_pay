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
export const apiRequest = async (interceptor: AxiosInstance, url: string, method: string, data: any = null) => {

  let response;
  let transportData;

  switch (method) {
    case "post":
      data && JSON.stringify(data);
      transportData = data && JSON.stringify(data);
      response = await interceptor.post(url, transportData);
      break;
    case "put":
      transportData = data && JSON.stringify(data);
      response = await interceptor.put(url, transportData);
      break;
    case "delete":
      transportData = data;
      response = await interceptor.delete(url, transportData);
      break;
    default:
      response = await interceptor.get(url);
      break;
  }

  return response

};
