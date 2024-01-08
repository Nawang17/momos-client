import React, { useContext } from "react";
import { createStyles, ActionIcon, Skeleton, Text } from "@mantine/core";
import { Post } from "../../Components/Post/Post";
import Reply from "./Reply";
import { ArrowLeft, ChatCircleDots } from "@phosphor-icons/react";
import { Comments } from "../SinglePost/Comments";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Auth";
import { useState } from "react";

const useStyles = createStyles(() => ({
  wrapper: {
    width: "100%",
    flex: 0.7,
    display: "flex",
    flexDirection: "column",
    "@media (max-width: 700px)": {
      flex: 1,
    },
  },
}));
export const SinglePostFeed = ({
  singlePostData,
  loading,
  setPosts,
  comments,
  setComments,
}) => {
  const navigate = useNavigate();

  const { classes } = useStyles();
  const [sortcommentby, setsortcommentby] = useState("Latest");
  const { darkmode } = useContext(AuthContext);
  return (
    <div className={classes.wrapper}>
      <div
        style={{
          backgroundColor: darkmode ? "#1A1B1E" : "white",
          color: darkmode ? "white" : "black",
          padding: "1rem 0rem 0rem 1rem",
        }}
      >
        <ActionIcon onClick={() => navigate(-1)}>
          <ArrowLeft size="20px" />
        </ActionIcon>
      </div>
      {!loading ? (
        <Post post={singlePostData} setPosts={setPosts} comments={comments} />
      ) : (
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            padding: "1rem",

            borderRadius: "4px",
          }}
        >
          <Skeleton height={50} circle mb="xl" />
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={15} radius="xl" />
          <Skeleton height={8} mt={15} width="70%" radius="xl" />
        </div>
      )}

      <Reply
        singlePostData={singlePostData}
        setComments={setComments}
        comments={comments}
        sortcommentby={sortcommentby}
        setsortcommentby={setsortcommentby}
        postUser={singlePostData?.user?.username}
      />
      {comments.length === 0 && !loading ? (
        <div
          style={{
            color: "#868e96",
            display: "flex",
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            gap: "0.6rem",
          }}
        >
          <ChatCircleDots weight="fill" color={"#868e96"} size={60} />
          <Text weight={"500"} size={"15px"}>
            {" "}
            No comments yet
          </Text>
          <Text weight={"500"} size={"15px"}>
            Be the first to share what you think!
          </Text>
        </div>
      ) : (
        <Comments
          comments={comments}
          setComments={setComments}
          postuser={singlePostData?.user.username}
          sortcommentby={sortcommentby}
        />
      )}
    </div>
  );
};
