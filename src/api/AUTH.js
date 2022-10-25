import { api } from "./config";

export const LoginReq = async (username, password, stayloggedin) => {
  return await api.post("/auth/login", {
    username,
    password,
    stayloggedin: stayloggedin,
  });
};

export const RegisterReq = async (username, password) => {
  return await api.post("/auth/register", {
    username,
    password,
  });
};

export const LoginStatus = async () => {
  return await api.get("/userinfo", {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
