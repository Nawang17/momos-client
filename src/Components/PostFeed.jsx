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
export const PostFeed = ({ setPosts, posts, loading, sortby }) => {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      {!loading
        ? posts
            .sort((a, b) => {
              if (sortby === "Latest") {
                return b.id - a.id;
              } else if (sortby === "Likes") {
                return b.likes.length - a.likes.length;
              }
              return 0;
            })
            .map((post) => {
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <Text weight="500" align="center">
            No posts found
          </Text>
        </div>
      )}
    </div>
  );
};
