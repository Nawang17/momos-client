import React from "react";
import { createStyles, Skeleton, Text } from "@mantine/core";
import { Post } from "./Post";
const useStyles = createStyles(() => ({
  wrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
}));
export const PostFeed = ({ setPosts, posts, loading }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      {!loading
        ? posts.map((post) => {
            return <Post key={post.id} post={post} setPosts={setPosts} />;
          })
        : new Array(6).fill(0).map((_, i) => {
            return (
              <div
                key={i}
                style={{
                  background: "white",
                  padding: "1rem",

                  borderRadius: "4px",
                }}
              >
                <Skeleton height={50} circle mb="xl" />
                <Skeleton height={8} radius="xl" />
                <Skeleton height={8} mt={15} radius="xl" />
                <Skeleton height={8} mt={15} width="70%" radius="xl" />
              </div>
            );
          })}
      {posts.length === 0 && !loading && (
        <Text align="center">No posts created yet</Text>
      )}
    </div>
  );
};
