import { api } from "./config";

export const AddNewPost = async (text, imageblob, filetype, quoteId) => {
  return await api.post(
    "/newpost",
    {
      text: text,
      imageblob: imageblob,
      filetype: filetype,
      quoteId,
    },

    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};

export const likePost = async ({ postId }) => {
  return await api.post(
    "/likepost",
    {
      postId,
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

export const follow = async ({ followingid }) => {
  return await api.post(
    "/follow",
    {
      followingid,
    },
    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};
export const likecomment = async ({ commentId }) => {
  return await api.post(
    "/likecomment",
    {
      commentId,
    },
    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};
export const nestedlikecomment = async ({ nestedcommentId }) => {
  return await api.post(
    "/likenestedcomment",
    {
      nestedcommentId,
    },
    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};
