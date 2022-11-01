import React from "react";
import { createStyles, Text } from "@mantine/core";
import { PostMenu } from "../../Components/PostMenu";
import { CircleWavyCheck } from "phosphor-react";
import { formatDistanceToNow } from "date-fns";
const useStyles = createStyles(() => ({
  wrapper: {
    background: "white",
    padding: "1rem",
    display: "flex",
    gap: "1rem",
  },
  replywrapper: {
    background: "white",
    padding: "0.2rem 1rem 0.5rem 4.5rem",
    display: "flex",
    gap: "0.5rem",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },
  replyavatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
  right: {
    display: "flex",
    flexDirection: "column",
    gap: "0.1rem",
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
  hLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.2rem",
  },
}));
export const Comments = ({ comments }) => {
  const { classes } = useStyles();

  return (
    <>
      {/* commentfeed */}
      {comments.map((comment) => {
        return (
          <div className={classes.wrapper}>
            <div className={classes.left}>
              <img
                loading="lazy"
                className={classes.avatar}
                src={comment.user.avatar}
                alt=""
              />
            </div>
            <div className={classes.right}>
              <div className={classes.header}>
                <div className={classes.hLeft}>
                  <Text weight={500} size="15px">
                    {comment.user.username}
                  </Text>
                  {comment.user.verified && (
                    <CircleWavyCheck size={17} color="#0ba6da" weight="fill" />
                  )}
                </div>
                <div className={classes.hRight}>
                  <PostMenu />
                </div>
              </div>
              <div className={classes.body}>
                <Text size="15px">{comment.text}</Text>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Text color="dimmed" size="13px">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                    includeSeconds: true,
                  })}
                </Text>
                <Text color="dimmed" weight={"500"} size="13px">
                  Reply
                </Text>
              </div>
            </div>
          </div>
        );
      })}

      {/* repliesfeed */}

      {/* <div className={classes.replywrapper}>
        <div className={classes.left}>
          <img
            loading="lazy"
            className={classes.replyavatar}
            src="https://res.cloudinary.com/dwzjfylgh/image/upload/v1648215217/dd23namcxikmc35qewa2.jpg"
            alt=""
          />
        </div>
        <div className={classes.right}>
          <div className={classes.header}>
            <div className={classes.hLeft}>
              <Text weight={500} size="15px">
                katoph
              </Text>
            </div>
            <div className={classes.hRight}>
              <PostMenu />
            </div>
          </div>
          <div className={classes.body}>
            <Text size="15px">WOW THIS IS A REPLY TO A REPLY</Text>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Text color="dimmed" size="13px">
              1h
            </Text>
            <Text color="dimmed" weight={"500"} size="13px">
              Reply
            </Text>
          </div>
        </div>
      </div> */}
    </>
  );
};
