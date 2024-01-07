import { api } from "./config";

export const LoginReq = async (username, password) => {
  return await api.post("/auth/login", {
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
export const RegisterReq = async (username, password, email) => {
  return await api.post("/auth/register", {
    username,
    password,
    email,
  });
};
export const googleauth = async (username, email, avatar) => {
  return await api.post("/auth/google", {
    username,
    email,
    avatar,
  });
};
