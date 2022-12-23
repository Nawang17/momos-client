import React, { useContext } from "react";
import { createStyles, ScrollArea, Skeleton, Text } from "@mantine/core";
import { Post } from "./Post";
import Hsuggestedacc from "./Hsuggestedacc";
import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { AuthContext } from "../context/Auth";
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
      margin: "0px 0px 8px 0px",
      padding: "0px 15px",
    },
  },
}));
export const PostFeed = ({ setPosts, posts, loading }) => {
  const { classes } = useStyles();
  const { pathname } = useLocation();
  const screenwidth = useMediaQuery("(min-width: 440px)");
  const navigate = useNavigate();
  const { darkmode } = useContext(AuthContext);
  return (
    <div className={classes.wrapper}>
      {!loading
        ? posts.map((post, id) => {
            return (
              <div key={post.id}>
                {(id === 6 || id === 50 || id === 80) && pathname === "/" && (
                  <div
                    style={{
                      backgroundColor: darkmode ? "#1A1B1E" : "white",
                      color: darkmode ? "white" : "black",
                    }}
                    className={classes.horizontalsuggeastedaccounts}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "15px",
                      }}
                    >
                      <Text weight={"500"} size={"14px"}>
                        Suggested for you
                      </Text>
                      <Text
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          navigate("/suggestedaccounts");
                        }}
                        color="#1DA1F2"
                        weight={"500"}
                        size={"14px"}
                      >
                        {" "}
                        See all
                      </Text>
                    </div>
                    <ScrollArea
                      offsetScrollbars
                      type={screenwidth ? "hover" : "never"}
                      mx="10"
                      style={{
                        maxWidth: "100%",
                        width: "auto",
                        height: 215,
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
            );
          })}
      {posts.length === 0 && !loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            alignItems: "center",

            padding: "0.2rem 0",
          }}
        >
          <Text
            color={darkmode ? "white" : "black"}
            weight="500"
            align="center"
            fontSize="13px"
          >
            No posts found
          </Text>
        </div>
      )}
    </div>
  );
};
