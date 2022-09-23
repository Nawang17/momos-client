import React from "react";
import { createStyles } from "@mantine/core";
import { Post } from "./Post";
const useStyles = createStyles(() => ({
  wrapper: {
    width: "100%",
    flex: 0.7,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    "@media (max-width: 700px)": {
      flex: 1,
    },
  },
}));
export const PostFeed = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <Post />
      <Post />

      <Post />
    </div>
  );
};
