import { api } from "./config";

export const HomePosts = async (page) => {
  return await api.get(`/homeposts?page=${page}`);
};

export const profileinfo = async ({ username }) => {
  return await api.get(`/profileinfo/${username}`);
};
export const profilefollowdata = async ({ username }) => {
  return await api.get(`/profileinfo/followdata/${username}`);
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

export const notis = async () => {
  return await api.get("/notis", {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const suggestedusersreq = async ({ name }) => {
  return await api.get(`/suggestedusers/suggest/${name}`);
};
export const allsuggestedusersreq = async ({ name }) => {
  return await api.get(`/suggestedusers/allsuggested/${name}`);
};
export const editprofileinfo = async () => {
  return await api.get("/settingsinfo/editprofileinfo", {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const searchusers = async ({ searchvalue }) => {
  return await api.get(`/search/getusers/${searchvalue}`);
};
export const searchposts = async ({ searchvalue }) => {
  return await api.get(`/search/getposts/${searchvalue}`);
};
