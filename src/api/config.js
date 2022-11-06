import axios from "axios";

export const api = axios.create({
  baseURL: `https://momos-backend.onrender.com`,
});
