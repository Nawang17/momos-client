import React from "react";
import { createStyles, ScrollArea, Skeleton, Text } from "@mantine/core";
import { Post } from "./Post";
import Hsuggestedacc from "./Hsuggestedacc";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
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
      backgroundColor: "white",
      display: "block",
      margin: "4px 0px 10px 0px",
      padding: "0px 15px",
      borderRadius: "4px",
    },
  },
}));
export const PostFeed = ({ setPosts, posts, loading, sortby }) => {
  const { classes } = useStyles();
  const { pathname } = useLocation();
  const screenwidth = useMediaQuery("(min-width: 440px)");
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
                  {(id === 5 || id === 60) && pathname === "/" && (
                    <div className={classes.horizontalsuggeastedaccounts}>
                      <Text
                        style={{
                          paddingTop: "15px",
                        }}
                        weight={"500"}
                        size={"15px"}
                      >
                        Suggested Accounts
                      </Text>
                      <ScrollArea
                        offsetScrollbars
                        // scrollbarSize={6}
                        // scrollHideDelay={0}
                        screenwidth
                        type={screenwidth ? "hover" : "never"}
                        mx="10"
                        style={{
                          maxWidth: "100%",
                          width: "auto",
                          height: 160,
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
