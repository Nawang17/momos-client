import React from "react";
import { createStyles, ScrollArea, Skeleton, Text } from "@mantine/core";
import { Post } from "./Post";
import Hsuggestedacc from "./Hsuggestedacc";
import { useLocation } from "react-router-dom";
const useStyles = createStyles(() => ({
  wrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  horizontalsuggeastedaccounts: {
    display: "none",
    "@media (max-width: 700px)": {
      display: "block",
    },
    borderTop: "1px solid #e6e6e6",
    borderBottom: "1px solid #e6e6e6",
  },
}));
export const PostFeed = ({ setPosts, posts, loading, sortby }) => {
  const { classes } = useStyles();
  const { pathname } = useLocation();
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
            .map((post, id) => {
              return (
                <div key={post.id}>
                  {(id === 4 || id === 45) && pathname === "/" && (
                    <div
                      style={{
                        margin: "4px 0px 10px 0px",
                      }}
                      className={classes.horizontalsuggeastedaccounts}
                    >
                      <Text
                        style={{
                          paddingTop: "10px",
                        }}
                        weight={"500"}
                        size={"15px"}
                      >
                        Suggested Accounts
                      </Text>
                      <ScrollArea
                        offsetScrollbars
                        scrollbarSize={6}
                        scrollHideDelay={0}
                        mx="10"
                        style={{
                          maxWidth: "100%",
                          width: "auto",
                          height: 155,
                        }}
                      >
                        <Hsuggestedacc />
                      </ScrollArea>
                    </div>
                  )}
                  <Post key={post.id} post={post} setPosts={setPosts} />
                </div>
              );
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
