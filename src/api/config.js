import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/",
  // https://momos-backend.onrender.com
  //http://localhost:3001/
});
