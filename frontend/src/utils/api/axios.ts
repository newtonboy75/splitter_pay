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
      //response = await interceptor.post(url, transportData);
      try{
        response = await interceptor.post(url, transportData);
      }catch(err:any){
        if(err.response?.status === 401){
          location.href = "/login"
        }
      }
      break;
    case "put":
      transportData = data && JSON.stringify(data);
      //response = await interceptor.put(url, transportData);
      try{
        response = await interceptor.put(url, transportData);
      }catch(err:any){
        if(err.response?.status === 401){
          location.href = "/login"
        }
      }
      break;
    case "delete":
      transportData = data;
      try{
        response = await interceptor.delete(url, transportData);
      }catch(err:any){
        if(err.response?.status === 401){
          location.href = "/login"
        }
      }
      break;
    default:
      try{
        response = await interceptor.get(url);
      }catch(err:any){
        if(err.response?.status === 401){
          location.href = "/login"
        }
      }

      break;
  }

  //console.log(response)

  return response

};
