import { api } from "./config";

export const HomePosts = async (page, sortby) => {
  return await api.get(`/homeposts?page=${page}&sortby=${sortby}`);
};
export const followinguserposts = async (page) => {
  return await api.get(`/homeposts/followingposts?page=${page}`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
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
  return await api.get(
    `/search/getusers/${searchvalue.replace(/[\W]/g, function (match) {
      return "%" + match.charCodeAt(0).toString(16).toUpperCase();
    })}`
  );
};
export const searchposts = async ({ searchvalue }) => {
  return await api.get(
    `/search/getposts/${searchvalue.replace(/[\W]/g, function (match) {
      return "%" + match.charCodeAt(0).toString(16).toUpperCase();
    })}`
  );
};

export const leaderboardinfo = async (page, type) => {
  return await api.get(`/leaderboard?page=${page}&type=${type}`);
};

export const getmoreprofileposts = async (userid, page) => {
  return await api.get(`/profileinfo/userposts/${userid}?page=${page}`);
};
export const getmorelikedposts = async (userid, page) => {
  return await api.get(`/profileinfo/likedposts/${userid}?page=${page}`);
};
export const userlevel = async () => {
  return await api.get("/userlevel", {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const getreposts = async (postid) => {
  return await api.get(`/reposts/${postid}`);
};

export const getchatrooms = async () => {
  return await api.get("/chat/get/chatrooms", {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const getchat = async (id) => {
  return await api.get(`/chat/${id}`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const getchatmessages = async (roomid, page) => {
  return await api.get(`/chat/getchatmessages/${roomid}/${page}`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};

export const gettrending = async () => {
  return await api.get(`/search/trending`);
};
export const getTopuser = async () => {
  return await api.get(`/suggestedusers/topuser`);
};
export const getbookmarksid = async () => {
  return await api.get(`/userinfo/bookmarks/bookmarkids`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const getbookmarks = async () => {
  return await api.get(`/userinfo/bookmarks/bookmarkposts`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const admin = async () => {
  return await api.get(`/admin/allusers`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const getcommunities = async () => {
  return await api.get(`/getcommunities`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const getcommunityprofile = async (name) => {
  return await api.get(`/getcommunities/communityProfile/${name}`);
};
export const getcommunityPosts = async (name) => {
  return await api.get(`/getcommunities/communityPosts/${name}`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const getSinglecommunityPost = async (postid) => {
  return await api.get(`/getcommunities/singlepost/${postid}`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const getallcommunities = async () => {
  return await api.get(`/getcommunities/allcommunities`);
};
export const communityuserposts = async (page) => {
  return await api.get(`/homeposts/communityposts?page=${page}`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const getTopNews = async () => {
  return await api.get(`/news/Top`);
};

export const getUserInfo = async () => {
  return await api.get(`/usersettings/getUserInfo`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const resetTokenCheck = async (resetToken) => {
  return await api.get(`/resetTokenCheck/${resetToken}`);
};
