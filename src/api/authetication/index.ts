import { api } from "../api";
import { User, AuthType } from "../../types/User";

const ENDPOINTS = {
  POST_SIGN_UP: "/api/v1/user/register",
  POST_SIGN_IN: "/api/v1/user/login",
  POST_SIGN_OUT: "/api/v1/user/logout",
  POST_FORGOT: "/api/v1/user/forgot-password",
  POST_RESET: "/api/v1/user/reset-password",
  CHANGE_PASSWORD: "api/v1/user/change-password"
};

async function doSignIn(data: AuthType) {
  return api.post(ENDPOINTS.POST_SIGN_IN, data).then((res) => res.data);
}

async function doSignOut() {
  return api.patch(ENDPOINTS.POST_SIGN_OUT).then((res) => res.data);
}

async function doForgot(data: string) {
  return api.post(ENDPOINTS.POST_FORGOT, data).then((res) => res.data);
}

async function doRestPassword(data: string) {
  return api.post(ENDPOINTS.POST_RESET, data).then((res) => res.data);
}

async function changePassword(data: any) {
  return api
    .post(ENDPOINTS.CHANGE_PASSWORD, data)
    .then((res) => res.data);
}

export {
  doSignIn,
  doSignOut,
  doForgot,
  doRestPassword,
  changePassword
};
