import React, { useContext, useState } from "react";
import { Button, Progress, Radio, Text } from "@mantine/core";
import { AuthContext } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import reactStringReplace from "react-string-replace";
import { formatDistanceToNowStrict } from "date-fns";
import locale from "date-fns/locale/en-US";
import { pollvote } from "../api/POST";
import { showNotification } from "@mantine/notifications";
import { CheckCircle, Lock, WarningCircle } from "phosphor-react";

const PostPolls = ({ post }) => {
  const [poll, setpoll] = useState(post);
  const formatDistanceLocale = {
    lessThanXSeconds: "{{count}}s",
    xSeconds: "{{count}}s",
    halfAMinute: "30s",
    lessThanXMinutes: "{{count}}m",
    xMinutes: "{{count}} mintues",
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
  function hasDatePassed(dateString) {
    const now = new Date();
    const dateToCheck = new Date(dateString);
    return dateToCheck < now;
  }

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
  const { UserInfo, darkmode } = useContext(AuthContext);
  const navigate = useNavigate();
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
          navigate(`/search/q/%23${match}`);
        }}
        style={{ color: "#1d9bf0" }}
        key={match + i}
      >
        #{match}
      </span>
    ));

    return replacedText;
  };

  const handlePollvote = async (pollchoice) => {
    if (!UserInfo) {
      return showNotification({
        icon: <Lock size={18} />,
        color: "red",
        title: "Login required",
        autoClose: 3000,
      });
    } else {
      await pollvote({
        pollid: pollchoice?.pollId,
        pollchoiceid: pollchoice?.id,
        postid: post?.id,
      })
        .then((res) => {
          setpoll((prev) => {
            return {
              ...prev,
              poll: {
                ...prev.poll,
                pollchoices: prev.poll.pollchoices.map((val) => {
                  if (val?.id === pollchoice?.id) {
                    return {
                      ...val,
                      pollvotes: [
                        ...val.pollvotes,
                        {
                          user: {
                            username: UserInfo?.username,
                            avatar: UserInfo?.avatar,
                          },
                        },
                      ],
                    };
                  } else {
                    return val;
                  }
                }),
              },
            };
          });
        })
        .catch((err) => {
          if (err.response.status === 0) {
            showNotification({
              icon: <WarningCircle size={18} />,
              color: "red",
              title: "Internal Server Error",
              autoClose: 4000,
            });
          } else {
            showNotification({
              icon: <WarningCircle size={18} />,
              color: "red",
              title: err.response.data,
              autoClose: 4000,
            });
          }
        });
    }
  };
  return (
    <div
      style={{
        padding: "0.5rem 1rem",
        margin: "0.2rem 1rem",

        border: darkmode ? "1px solid #3f4448" : "1px solid #e6ecf0",
        borderRadius: "0.5rem",
      }}
    >
      {post.text && (
        <div
          style={{
            cursor: "pointer",

            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            paddingTop: "0.5rem",
          }}
        >
          <Text weight={600} size="15px">
            {postvalue(post?.text)}
          </Text>
        </div>
      )}

      {hasDatePassed(poll?.poll?.duration) ||
      poll?.user?.username === UserInfo?.username ||
      poll?.poll?.pollchoices?.find((val) => {
        return val?.pollvotes?.find((vals) => {
          return vals?.user?.username === UserInfo?.username;
        });
      }) ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "0.5rem",
          }}
        >
          {poll?.poll?.pollchoices
            ?.sort((a, b) => a.id - b.id)
            .map((val) => {
              return (
                <div
                  key={val.id}
                  style={{
                    display: "flex",
                    gap: "0.8rem",
                    fontSize: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      width: "100%",
                    }}
                  >
                    {/* put a check mark here if the user has voted for this option */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.2rem",
                      }}
                    >
                      <Text>{val?.choice}</Text>

                      {val?.pollvotes?.find((val) => {
                        return val?.user?.username === UserInfo?.username;
                      }) && <CheckCircle size={16} />}
                    </div>
                    <Progress
                      label={
                        val?.pollvotes?.length === 0
                          ? 0
                          : Math.floor(
                              (val?.pollvotes?.length /
                                poll?.poll?.pollchoices
                                  .map((val) => {
                                    return val?.pollvotes?.length;
                                  })
                                  .reduce((a, b) => a + b)) *
                                100
                            ) + "%"
                      }
                      color={
                        val?.pollvotes?.length ===
                        poll?.poll?.pollchoices

                          .map((val) => {
                            return val?.pollvotes?.length;
                          })
                          .reduce((a, b) => {
                            return Math.max(a, b);
                          })
                          ? "green"
                          : "blue"
                      }
                      value={
                        val?.pollvotes?.length === 0
                          ? 0
                          : Math.floor(
                              (val?.pollvotes?.length /
                                poll?.poll?.pollchoices
                                  .map((val) => {
                                    return val?.pollvotes?.length;
                                  })
                                  .reduce((a, b) => a + b)) *
                                100
                            )
                      }
                      size="xl"
                    />
                  </div>{" "}
                </div>
              );
            })}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
            marginTop: "0.5rem",
          }}
        >
          {poll?.poll?.pollchoices
            ?.sort((a, b) => a.id - b.id)
            .map((val) => {
              return (
                <Button
                  onClick={() => handlePollvote(val)}
                  radius={20}
                  key={val.id}
                  variant="outline"
                >
                  {val?.choice}
                </Button>
              );
            })}
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "0.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            fontSize: "14px",
          }}
        >
          <Text color="dimmed">
            {poll?.poll?.pollchoices?.reduce((acc, val) => {
              return acc + val?.pollvotes?.length;
            }, 0)}{" "}
            votes
          </Text>
          &#183;
          <Text color="dimmed">
            {new Date() > new Date(post?.poll?.duration) ? (
              <Text color="dimmed"> Poll closed </Text>
            ) : (
              <Text>
                {formatDistanceToNowStrict(new Date(post?.poll?.duration), {
                  locale: {
                    ...locale,
                    formatDistance,
                  },
                })}{" "}
                left{" "}
              </Text>
            )}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default PostPolls;
