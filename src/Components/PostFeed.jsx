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
export const PostFeed = ({ posts }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      {posts.map((post) => {
        return <Post key={post.id} post={post} />;
      })}

      {/* <Text align="center">End of Posts</Text> */}
    </div>
  );
};
