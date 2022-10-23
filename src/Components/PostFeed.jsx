import React from "react";
import { createStyles, Text } from "@mantine/core";
import { Post } from "./Post";
const useStyles = createStyles(() => ({
  wrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
}));
export const PostFeed = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <Post />
      <Post />
      <Post />

      <Post />
      <Post />
      <Post />
      <Text align="center" weight={"500"}>
        End of Posts
      </Text>
    </div>
  );
};
