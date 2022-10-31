import React from "react";
import { createStyles, Text } from "@mantine/core";
import { ChatCircle, CircleWavyCheck, Heart } from "phosphor-react";
import { PostMenu } from "./PostMenu";
import { Link, useNavigate } from "react-router-dom";
const useStyles = createStyles(() => ({
  wrapper: {
    background: "white",
    padding: "1rem",
    display: "flex",
    gap: "1rem",
    borderRadius: "4px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    cursor: "pointer",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
  right: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    width: "100%",
  },
  image: {
    width: "100%",
    borderRadius: "4px",
  },
  body: {
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
  },
  footer: {
    display: "flex",
    gap: "1rem",
  },
  fRight: {
    display: "flex",
    alignItems: "center",
    gap: "0.2rem",
  },
  fLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.2rem",
  },
}));
export const Post = ({ post, setPosts }) => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  return (
    <div className={classes.wrapper}>
      <div className={classes.left}>
        <img
          onClick={() => navigate(`/${post.user.username}`)}
          loading="lazy"
          className={classes.avatar}
          src={post.user.avatar}
          alt=""
        />
      </div>
      <div className={classes.right}>
        <div className={classes.header}>
          <div className={classes.hLeft}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
            >
              <Text
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/${post.user.username}`)}
                weight={500}
                size="15px"
              >
                {post.user.username}
              </Text>
              {post.user.verified && (
                <CircleWavyCheck size={17} color="#0ba6da" weight="fill" />
              )}
            </div>

            <Text color="dimmed" size="sm">
              {post.createdAt}
            </Text>
          </div>
          <div className={classes.hRight}>
            <PostMenu postinfo={post} setPosts={setPosts} />
          </div>
        </div>
        {post.text && (
          <div className={classes.body}>
            <Text size="15px">{post?.text}</Text>
          </div>
        )}

        {post.image && (
          <img
            loading="lazy"
            className={classes.image}
            src={post?.image}
            alt=""
          />
        )}

        <div className={classes.footer}>
          <div className={classes.fLeft}>
            <Heart color="gray" weight="light" size={19} />
            <Text color={"gray"} size="14px">
              {post.likes.length}
            </Text>
          </div>
          <Link style={{ textDecoration: "none" }} to={`/post/${post.id}`}>
            <div className={classes.fRight}>
              <ChatCircle color="gray" weight="light" size={17} />
              <Text size="14px" color={"gray"}>
                1
              </Text>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
