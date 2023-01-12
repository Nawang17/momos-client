import React, { useContext } from "react";
import { createStyles, ActionIcon, Skeleton, Text } from "@mantine/core";
import { Post } from "../../Components/Post";
import Reply from "./Reply";
import { ArrowLeft, Fish } from "phosphor-react";
import { Comments } from "./Comments";
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
  const [sortcommentby, setsortcommentby] = useState("Top");
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
      />
      {comments.length === 0 && !loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.6rem",
            fontWeight: "500",
            color: "#868e96",
            margin: "0 auto",
            maxWidth: "27rem",
            padding: "1rem",
          }}
        >
          <Fish weight="fill" color={"#868e96"} size={60} />
          <Text size={"15px"}>Be the first to comment</Text>
          <Text align="center" size={"15px"}>
            Nobody's responded to this post yet. Add your thoughts and get the
            conversation started.
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
