import { api } from "./config";

export const LoginReq = async (username, password) => {
  return await api.post("/auth/login", {
    username,
    password,
  });
};
export const GLoginReq = async (username, email) => {
  return await api.post("/auth/login/glogin", {
    username,
    email,
  });
};

export const LoginStatus = async () => {
  return await api.get("/userinfo", {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const RegisterReq = async (username, password) => {
  return await api.post("/auth/register", {
    username,
    password,
  });
};
export const GRegisterReq = async (username, email, avatar) => {
  return await api.post("/auth/register/gregister", {
    username,
    email,
    avatar,
  });
};
