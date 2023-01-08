import { useContext, useState } from "react";
import { createStyles, Text } from "@mantine/core";
import { CircleWavyCheck, Heart, Lock } from "phosphor-react";
import { CommentMenu } from "../../Components/CommentMenu";
import { useNavigate } from "react-router-dom";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import locale from "date-fns/locale/en-US";
import NestedReplyModal from "../../Components/NestedReplyModal";
import { AuthContext } from "../../context/Auth";
import { showNotification } from "@mantine/notifications";
import { NestedCommentMenu } from "../../Components/NestedCommentMenu";
import reactStringReplace from "react-string-replace";
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
export const Comments = ({ comments, setComments, postuser }) => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const formatDistanceLocale = {
    lessThanXSeconds: "{{count}}s",
    xSeconds: "{{count}}s",
    halfAMinute: "30s",
    lessThanXMinutes: "{{count}}m",
    xMinutes: "{{count}}m",
    aboutXHours: "{{count}}h",
    xHours: "{{count}}h",
    xDays: "{{count}}d",
    aboutXWeeks: "{{count}}w",
    xWeeks: "{{count}}w",
    aboutXMonths: "{{count}}mo",
    xMonths: "{{count}}mo",
    aboutXYears: "{{count}}y",
    xYears: "{{count}}y",
    overXYears: "{{count}}y",
    almostXYears: "{{count}}y",
  };

  function formatDistance(token, count, options) {
    options = options || {};

    const result = formatDistanceLocale[token].replace("{{count}}", count);

    if (options.addSuffix) {
      if (options.comparison > 0) {
        return "in " + result;
      } else {
        return result + " ago";
      }
    }

    return result;
  }
  const [opened, setOpened] = useState(false);
  const { UserInfo, darkmode } = useContext(AuthContext);
  const [replypost, setReplyPost] = useState(null);
  const postvalue = (text) => {
    let replacedText;

    // Match URLs
    replacedText = reactStringReplace(text, /(https?:\/\/\S+)/g, (match, i) => (
      <span
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = match;
        }}
        className="link-style"
        style={{
          color: "#1d9bf0",
        }}
        key={match + i}
      >
        {match}
      </span>
    ));

    // Match @-mentions

    replacedText = reactStringReplace(replacedText, /@(\w+)/g, (match, i) => (
      <span
        className="link-style"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/${match}`);
        }}
        style={{ color: "#1d9bf0" }}
        key={match + i}
      >
        @{match}
      </span>
    ));
    // Match hashtags
    replacedText = reactStringReplace(replacedText, /#(\w+)/g, (match, i) => (
      <span
        className="link-style"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/search/q/${match}`);
        }}
        style={{ color: "#1d9bf0" }}
        key={match + i}
      >
        #{match}
      </span>
    ));

    return replacedText;
  };
  return (
    <>
      {/* commentfeed */}
      {comments
        .map((comment) => {
          return (
            <div key={comment.id}>
              <div
                style={{
                  backgroundColor: darkmode ? "#1A1B1E" : "white",
                  color: darkmode ? "white" : "black",
                }}
                className={classes.wrapper}
              >
                <div className={classes.left}>
                  <img
                    onClick={() => {
                      navigate(`/${comment.user.username}`);
                    }}
                    style={{ cursor: "pointer" }}
                    loading="lazy"
                    className={classes.avatar}
                    src={comment.user.avatar}
                    alt=""
                  />
                </div>
                <div className={classes.right}>
                  <div className={classes.header}>
                    <div className={classes.hLeft}>
                      <Text
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          navigate(`/${comment.user.username}`);
                        }}
                        weight={500}
                        size="15px"
                      >
                        {comment.user.username}
                      </Text>
                      {comment?.user.verified &&
                        (comment?.user.id !== 5 ? (
                          <CircleWavyCheck
                            size={17}
                            color="#0ba6da"
                            weight="fill"
                          />
                        ) : (
                          <CircleWavyCheck
                            size={17}
                            color="#0ba6da"
                            weight="fill"
                          />
                        ))}
                      <Text color="dimmed">·</Text>
                      <Text color="dimmed" size="13px">
                        {formatDistanceToNowStrict(
                          new Date(comment.createdAt),
                          {
                            locale: {
                              ...locale,
                              formatDistance,
                            },
                          }
                        )}
                      </Text>
                    </div>
                    <div className={classes.hRight}>
                      <CommentMenu
                        postinfo={comment}
                        setComments={setComments}
                      />
                    </div>
                  </div>
                  <div className={classes.body}>
                    <Text color={"dimmed"} size="15px">
                      Replying to{" "}
                      <span
                        onClick={() => {
                          navigate(`/${postuser}`);
                        }}
                        style={{
                          cursor: "pointer",
                          fontSize: "15px",
                          fontWeight: 500,
                          color: "rgb(29, 161, 242)",
                        }}
                      >
                        @{postuser}
                      </span>
                    </Text>
                    <Text size="15px">{postvalue(comment?.text)}</Text>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.2rem",
                        cursor: "pointer",
                      }}
                      onClick={() => {}}
                    >
                      {true ? (
                        <Heart color="gray" weight="light" size={15} />
                      ) : (
                        <Heart
                          color={"rgb(255, 69, 0)"}
                          weight="fill"
                          size={15}
                        />
                      )}
                      <Text
                        className="unclickablevalue"
                        color={
                          !false ? "rgb(134, 142, 150)" : "rgb(255, 69, 0)"
                        }
                        size="13px"
                      ></Text>
                    </div>

                    <Text
                      onClick={() => {
                        if (!UserInfo) {
                          showNotification({
                            icon: <Lock size={18} />,
                            color: "red",
                            title: "Login required",
                            autoClose: 3000,
                          });
                        } else {
                          setOpened(!opened);
                          setReplyPost({
                            replyingto: comment.user.username,
                            postId: comment.postId,
                            replyingtouserid: comment.userId,
                            commentId: comment.id,
                          });
                        }
                      }}
                      style={{ cursor: "pointer" }}
                      color="dimmed"
                      weight={"500"}
                      size="13px"
                    >
                      Reply
                    </Text>
                  </div>
                </div>
              </div>

              {comment.nestedcomments.map((data) => {
                return (
                  <div
                    style={{
                      backgroundColor: darkmode ? "#1A1B1E" : "white",
                      color: darkmode ? "white" : "black",
                    }}
                    key={data.id}
                    className={classes.replywrapper}
                  >
                    <div className={classes.left}>
                      <img
                        onClick={() => {
                          navigate(`/${data.user.username}`);
                        }}
                        style={{ cursor: "pointer" }}
                        loading="lazy"
                        className={classes.replyavatar}
                        src={data.user.avatar}
                        alt=""
                      />
                    </div>
                    <div className={classes.right}>
                      <div className={classes.header}>
                        <div className={classes.hLeft}>
                          <div
                            style={{
                              display: "flex",
                              gap: "0.1rem",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              onClick={() => {
                                navigate(`/${data.user.username}`);
                              }}
                              style={{ cursor: "pointer" }}
                              weight={500}
                              size="14px"
                            >
                              {data?.user.username}
                            </Text>
                            {data?.user.verified &&
                              (data?.user.id !== 5 ? (
                                <CircleWavyCheck
                                  size={17}
                                  color="#0ba6da"
                                  weight="fill"
                                />
                              ) : (
                                <CircleWavyCheck
                                  size={17}
                                  color="#0ba6da"
                                  weight="fill"
                                />
                              ))}
                            <Text color="dimmed">·</Text>
                            <Text color="dimmed" size="13px">
                              {formatDistanceToNowStrict(
                                new Date(data?.createdAt),
                                {
                                  locale: {
                                    ...locale,
                                    formatDistance,
                                  },
                                }
                              )}
                            </Text>
                          </div>
                        </div>
                        <div className={classes.hRight}>
                          <NestedCommentMenu
                            setComments={setComments}
                            commentuser={data?.user.username}
                            commentId={data?.id}
                            replyingtoId={data.commentId}
                            userid={data.userId}
                          />
                        </div>
                      </div>
                      <div className={classes.body}>
                        <Text color={"dimmed"} size="15px">
                          Replying to{" "}
                          <span
                            onClick={() => {
                              navigate(`/${data?.repliedtouser.username}`);
                            }}
                            style={{
                              cursor: "pointer",
                              fontSize: "15px",
                              fontWeight: 500,
                              color: "rgb(29, 161, 242)",
                            }}
                          >
                            @{data?.repliedtouser.username}
                          </span>
                        </Text>
                        <Text size="15px">{postvalue(data?.text)}</Text>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.2rem",
                            cursor: "pointer",
                          }}
                          onClick={() => {}}
                        >
                          {true ? (
                            <Heart color="gray" weight="light" size={15} />
                          ) : (
                            <Heart
                              color={"rgb(255, 69, 0)"}
                              weight="fill"
                              size={15}
                            />
                          )}
                          <Text
                            className="unclickablevalue"
                            color={
                              !false ? "rgb(134, 142, 150)" : "rgb(255, 69, 0)"
                            }
                            size="13px"
                          ></Text>
                        </div>

                        <Text
                          onClick={() => {
                            if (!UserInfo) {
                              showNotification({
                                color: "red",
                                icon: <Lock size={18} />,
                                title: "Login required",
                                autoClose: 3000,
                              });
                            } else {
                              setOpened(!opened);
                              setReplyPost({
                                replyingto: data.user.username,
                                postId: data.postId,
                                replyingtouserid: data.userId,
                                commentId: data.commentId,
                              });
                            }
                          }}
                          style={{ cursor: "pointer" }}
                          color="dimmed"
                          weight={"500"}
                          size="13px"
                        >
                          Reply
                        </Text>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })
        .reverse()}

      {/* repliesfeed */}

      <NestedReplyModal
        setOpened={setOpened}
        opened={opened}
        UserInfo={UserInfo}
        replypost={replypost}
        setReplyPost={setReplyPost}
        setComments={setComments}
      />
    </>
  );
};
