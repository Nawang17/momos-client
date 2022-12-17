import React, { useContext } from "react";
import { createStyles, ActionIcon, Skeleton } from "@mantine/core";
import { Post } from "../../Components/Post";
import Reply from "./Reply";
import { ArrowLeft } from "phosphor-react";
import { Comments } from "./Comments";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Auth";

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
        <Post post={singlePostData} setPosts={setPosts} />
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

      <Reply singlePostData={singlePostData} setComments={setComments} />
      <Comments comments={comments} setComments={setComments} />
    </div>
  );
};
