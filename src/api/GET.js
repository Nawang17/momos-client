import { api } from "./config";

export const HomePosts = async () => {
  return await api.get("/homeposts");
};

export const profileinfo = async ({ username }) => {
  return await api.get(`/profileinfo/${username}`);
};

export const singlePost = async ({ postid }) => {
  return await api.get(`/post/${postid}`);
};

export const likedPosts = async () => {
  return await api.get("/likedposts", {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
