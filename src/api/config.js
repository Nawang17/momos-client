import axios from "axios";

const url = (value) => {
  return value === "local"
    ? "http://localhost:3001"
    : "https://momos-backend.onrender.com";
};

export const api = axios.create({
  baseURL: url("locals"),
});
