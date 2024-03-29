import { api } from "./config";

export const AddNewPost = async (formData) => {
  return await api.post(
    "/newpost",

    formData,

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
export const addComment = async ({ text, postid, gif }) => {
  return await api.post(
    "/newcomment",
    {
      postId: postid,
      text: text,
      gif,
    },
    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};
export const addnestedComment = async ({ replyinfo, text, gif }) => {
  return await api.post(
    "/newnestedcomment",
    {
      postId: replyinfo.postId,
      replytouserId: replyinfo.replyingtouserid,
      commentId: replyinfo.commentId,
      text,
      gif,
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

export const sendmessage = async (chatroomid, message) => {
  return await api.post(
    "/chat/sendmessage",
    {
      chatroomid,
      message,
    },
    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};
export const AddNewPostpoll = async (
  choice1,
  choice2,
  choice3,
  choice4,
  pollquestion,

  polldays,
  pollhours,
  pollminutes
) => {
  return await api.post(
    "/newpost/addpoll",

    {
      choice1,
      choice2,
      choice3,
      choice4,
      question: pollquestion,

      durationday: polldays,
      durationhour: pollhours,
      durationminute: pollminutes,
    },

    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};
export const pollvote = async ({ pollid, pollchoiceid, postid }) => {
  return await api.post(
    "/pollvote",
    {
      pollid,
      pollchoiceid,
      postid,
    },
    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};
export const bookmarkPost = async ({ postId }) => {
  return await api.post(
    "/bookmarkpost",
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
export const AddNewCommunity = async (formData) => {
  return await api.post(
    "/newcommunity",

    formData,

    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};
export const AddNewCommunityPost = async (formData) => {
  return await api.post(
    "/newcommunitypost",

    formData,

    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};
export const AddNewCommunitypoll = async (
  choice1,
  choice2,
  choice3,
  choice4,
  pollquestion,

  polldays,
  pollhours,
  pollminutes,
  communityName
) => {
  return await api.post(
    "/newcommunitypost/addpoll",

    {
      choice1,
      choice2,
      choice3,
      choice4,
      question: pollquestion,

      durationday: polldays,
      durationhour: pollhours,
      durationminute: pollminutes,
      communityName,
    },

    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};
export const JoinCommunity = async (communityName) => {
  return await api.post(
    "/newcommunity/joincommunity",

    {
      communityName,
    },

    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};
export const acceptCommunityrequest = async ({ requestid, accept }) => {
  return await api.post(
    `/newcommunity/acceptcommunityrequest`,

    {
      requestid,
      accept,
    },

    {
      headers: {
        Authorization: `${localStorage.getItem("token")}`,
      },
    }
  );
};
