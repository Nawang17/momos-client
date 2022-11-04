import { api } from "./config";
export const deletePost = async ({ postid }) => {
  return await api.delete(`/deletepost/${postid}`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const deleteComment = async ({ commentid }) => {
  return await api.delete(`/deletecomment/${commentid}`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const deleteNestedComment = async ({ commentid }) => {
  return await api.delete(`/deletenestedcomment/${commentid}`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
