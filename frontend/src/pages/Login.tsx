import { useEffect, useRef, useState } from "react";
import logo from "../assets/Klearly-Logo-White-@2x.webp"
import axios from "../utils/api/axios";

import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";


const Login = () => {
  const { setAuth } = useAuth();
  const userRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const LOGIN_URL = "/api/login";
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      const accessToken = response?.data?.accessToken
      const refreshToken = response?.data?.refreshToken
      const name = response?.data?.name
      const id = response?.data.id

      if(response.status === 200){
        setAuth({id, name, email, password, accessToken, refreshToken})
        return navigate('/')
      }
    } catch (err: any) {

      if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
      }else{
        setErrMsg("Login Failed")
      }
    }
  };

  useEffect(() => {
    userRef?.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  return (
    <>
      <div className="flex h-screen justify-center items-center">
        <div className="md:container">
          <div className="font-semibold text-white text-5xl mb-6">
          <img src={logo} className="md:w-1/2 lg:w-1/4 m-auto"  /> {" "}
          Splitter Pay
          </div>{" "}
          <form
            className="md:w-1/2 lg:w-1/4 m-auto bg-white p-10 rounded-md mt-20"
            onSubmit={handleSubmit}
          >
            <div className="mb-4">Please Login</div>
            {errMsg && <div>{errMsg}</div> }
            <input
              ref={userRef}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Enter your email address"
              type="text"
              placeholder="Email address"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border  border-gray-200 rounded mb-2"
              value={email}
              required
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Enter your password"
              type="password"
              placeholder="Password"
              className="text-sm text-gray-base w-full mr-3  py-5 px-4 h-2 border border-gray-200  rounded mb-2"
              value={password}
              required
            />

            <button type="submit" className="bg-green-400 w-full mt-4 p-2">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
