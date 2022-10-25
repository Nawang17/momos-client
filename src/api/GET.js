import { api } from "./config";

export const HomePosts = async () => {
  return await api.get("/homeposts");
};
