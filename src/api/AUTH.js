import { api } from "./config";

export const LoginReq = async (username, password) => {
  return await api.post("/auth/login", {
    username,
    password,
  });
};

export const RegisterReq = async (username, password) => {
  return await api.post("/auth/register", {
    username,
    password,
  });
};
