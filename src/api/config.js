import axios from "axios";

export const api = axios.create({
  // testURL: "http://localhost:3001",
  //prodUrl: "https://momos-backend.onrender.com",
  baseURL: `http://localhost:3001`,
});
