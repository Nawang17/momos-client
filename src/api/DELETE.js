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
export const deleteUser = async (userId) => {
  return await api.delete(`/admin/deleteUser/${userId}`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const leaveCommunity = async (name) => {
  return await api.delete(`/getcommunities/leavecommunity/${name}`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const deleteCommunity = async (name) => {
  return await api.delete(`/getcommunities/deleteCommunity/${name}`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const deleteChatmessage = async (msgid) => {
  return await api.delete(`/chat/deletemessage/${msgid}`, {
    headers: {
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
export const deleteAccount = async (currentPassword) => {
  return await api.delete(
    `/usersettings/deleteAccount/${currentPassword}`,

    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};
