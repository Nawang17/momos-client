import axios from "axios";

export const api = axios.create({
  baseURL: "https://momos-backend.onrender.com",
  // https://momos-backend.onrender.com
  //http://localhost:3001/
});
