import React from "react";
import { AuthContext } from "../context/Auth";
import { useContext } from "react";
import { Avatar, Indicator, Text, createStyles } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import locale from "date-fns/locale/en-US";
import { formatDistance } from "../helper/DateFormat";
import Topuserbadge from "../helper/Topuserbadge";
import Verifiedbadge from "../helper/VerifiedBadge";
import { Trans } from "@lingui/macro";
const useStyles = createStyles(() => ({
  wrapper: {
    padding: "1rem 0rem 1rem 0rem",
    display: "flex",
    gap: "1rem",
    borderRadius: "4px",
    "@media (max-width: 700px)": {
      borderRadius: "0px",
    },
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
    gap: "0.3rem",
    width: "100%",
  },
  gifimg: {
    width: "100%",
    height: "auto",
  },
  img: {
    width: "100%",
    height: "auto",
  },

  body: {
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    paddingTop: "0.5rem",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fRight: {
    display: "flex",
    alignItems: "center",
    gap: "0.2rem",
    cursor: "pointer",
  },
  fLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.2rem",
    cursor: "pointer",
  },
}));
const RepliesFeed = ({ replies, loading, setreplies }) => {
  const { classes } = useStyles();
  const { darkmode, onlineusers, topUser } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {replies?.map((reply, index) => {
        return (
          <div
            key={index}
            className={classes.wrapper}
            style={{
              backgroundColor: darkmode ? "#1A1B1E" : "white",
              color: darkmode ? "white" : "black",
              cursor: "pointer",
            }}
          >
            <div
              onClick={() => {
                navigate(`/post/${reply?.postId}`);
              }}
              className={classes.right}
            >
              <div
                style={{
                  padding: "0rem 1rem ",
                }}
                className={classes.header}
              >
                <div
                  style={{
                    width: "100%",
                  }}
                  className={classes.hLeft}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                      width: "100%",
                    }}
                  >
                    <Indicator
                      disabled={!onlineusers.includes(reply?.userId)}
                      style={{
                        cursor: "pointer",
                      }}
                      withBorder
                      inline
                      color="green"
                      size={9}
                      offset={7}
                      position="bottom-end"
                    >
                      <Avatar
                        size="40px"
                        radius={"xl"}
                        src={reply?.user?.avatar}
                        alt=""
                        loading="lazy"
                      />
                    </Indicator>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.2rem",
                          }}
                        >
                          {" "}
                          <Text
                            style={{ cursor: "pointer" }}
                            weight={500}
                            size="15px"
                          >
                            {reply?.user?.username}
                          </Text>
                          {reply?.user?.verified && <Verifiedbadge />}
                          {topUser === reply?.user?.username && (
                            <Topuserbadge />
                          )}
                          <Text
                            color="dimmed"
                            style={{ cursor: "pointer" }}
                            weight={500}
                            size="15px"
                          >
                            ·
                          </Text>
                          <Text color="dimmed" size={12}>
                            {formatDistanceToNowStrict(
                              new Date(reply?.createdAt),
                              {
                                locale: {
                                  ...locale,
                                  formatDistance,
                                },
                              }
                            )}
                          </Text>
                          {reply?.createdAt !== reply?.updatedAt && (
                            <Text color="dimmed" size="12px">
                              <Trans> (edited) </Trans>
                            </Text>
                          )}
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {/* {!reply?.repliedtouser ? (
                            <CommentMenu
                              postinfo={reply}
                              setComments={setreplies}
                            />
                          ) : (
                            <NestedCommentMenu
                              setComments={setreplies}
                              commentuser={reply?.user?.username}
                              commentId={reply?.id}
                              replyingtoId={reply?.commentId}
                              userid={reply.userId}
                              profilefeed={true}
                            />
                          )} */}
                        </div>
                      </div>
                      <Text color="dimmed" size={"15px"}>
                        <Trans>
                          {" "}
                          Replying to{" "}
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/${
                                  reply?.repliedtouser
                                    ? reply?.repliedtouser?.username
                                    : reply?.post?.user?.username
                                }`
                              );
                            }}
                            style={{
                              cursor: "pointer",
                              fontSize: "15px",
                              fontWeight: 500,
                              color: "rgb(29, 161, 242)",
                            }}
                          >
                            @
                            {reply?.repliedtouser
                              ? reply?.repliedtouser?.username
                              : reply?.post?.user?.username}
                          </span>{" "}
                        </Trans>
                      </Text>
                      {reply?.text && (
                        <div
                          style={{
                            cursor: "pointer",
                          }}
                          className={classes.body}
                        >
                          <Text size="15px">{reply?.text}</Text>
                        </div>
                      )}
                      {reply?.gif && (
                        <div
                          style={{
                            padding: "0.3rem 0 0 0",
                          }}
                        >
                          <img
                            loading="lazy"
                            style={{
                              maxWidth: "100%",
                              height: "auto",
                              borderRadius: "0.5rem",
                            }}
                            src={reply?.gif}
                            alt=""
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RepliesFeed;
