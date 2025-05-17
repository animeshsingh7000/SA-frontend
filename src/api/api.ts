import axios, { AxiosRequestHeaders } from "axios";
import { BASE_URL } from "../constants";
import { RENTER_MENUS } from "../constants/menu";

const API_BAD_REQUEST = 401;
const location = window.location.pathname;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error?.response?.status === API_BAD_REQUEST) {
      // logout
      localStorage.clear();
      window.location.href = '/'
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    const activeRoutes = RENTER_MENUS.map((menu:any) => menu.activeOn).flat();
    let token = null;

    if(localStorage.getItem("impersonateToken")) {
      if(localStorage.getItem("isDashboard")== '1') {
          token = localStorage.getItem("impersonateToken");
      } else {
        token = localStorage.getItem("token");
      }
    } else {
      token = localStorage.getItem("token");

    }

    if (token) {
      config.headers = config.headers
        ? config.headers
        : ({} as AxiosRequestHeaders);
      // config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
      config.headers.Authorization = `Bearer ${token}`;

    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
