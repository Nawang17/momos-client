import { api } from "./config";

export const AddNewPost = async (text, imageblob) => {
  return await api.post(
    "/newpost",
    {
      text: text,
      imageblob: imageblob,
    },

    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};

export const likePost = async ({ postid }) => {
  return await api.post(
    "/likepost",
    {
      postId: postid,
    },
    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};
export const addComment = async ({ text, postid }) => {
  return await api.post(
    "/newcomment",
    {
      postId: postid,
      text: text,
    },
    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};
export const addnestedComment = async ({ replyinfo, text }) => {
  return await api.post(
    "/newnestedcomment",
    {
      postId: replyinfo.postId,
      replytouserId: replyinfo.replyingtouserid,
      commentId: replyinfo.commentId,
      text,
    },
    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};
