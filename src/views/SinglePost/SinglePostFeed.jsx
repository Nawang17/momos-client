import React from "react";
import { createStyles, ActionIcon } from "@mantine/core";
import { Post } from "../../Components/Post";
import Reply from "./Reply";
import { ArrowLeft } from "phosphor-react";
import { Comments } from "./Comments";
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
export const SinglePostFeed = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <div style={{ background: "white", padding: "1rem 0rem 0rem 1rem" }}>
        <ActionIcon>
          <ArrowLeft size="20px" />
        </ActionIcon>
      </div>
      <Post />
      <Reply />
      <Comments />
      <Comments />

      <Comments />
    </div>
  );
};
