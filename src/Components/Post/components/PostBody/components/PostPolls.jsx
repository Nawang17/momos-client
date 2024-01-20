import React, { useContext, useState } from "react";
import { Button, Modal, Progress, Text } from "@mantine/core";
import { AuthContext } from "../../../../../context/Auth";
import { useNavigate } from "react-router-dom";

import { formatDistanceToNowStrict } from "date-fns";
import locale from "date-fns/locale/en-US";
import { pollvote } from "../../../../../api/POST";
import { showNotification } from "@mantine/notifications";
import { CheckCircle, Lock, WarningCircle } from "@phosphor-icons/react";
import { formatDistance } from "../../../../../helper/DateFormat";
import Verifiedbadge from "../../../../../helper/VerifiedBadge";
import Topuserbadge from "../../../../../helper/Topuserbadge";
import { formatText } from "../../../../../helper/FormatText";
import { Trans } from "@lingui/macro";
const PostPolls = ({ post }) => {
  const [poll, setpoll] = useState(post);
  //check if post is closed
  function hasDatePassed(dateString) {
    const now = new Date();
    const dateToCheck = new Date(dateString);
    return dateToCheck < now;
  }

  const { UserInfo, darkmode, topUser } = useContext(AuthContext);
  const [votemodal, setvotemodal] = useState(false);
  const navigate = useNavigate();

  const handlePollvote = async (pollchoice) => {
    if (!UserInfo) {
      return showNotification({
        icon: <Lock size={18} />,
        color: "red",
        title: <Trans>Login required </Trans>,
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
              title: <Trans>Internal Server Error</Trans>,
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
    <>
      {post?.poll && (
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
                {formatText(post?.text, navigate)}
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
              <Text
                className="hoveru"
                onClick={() => {
                  if (
                    poll?.poll?.pollchoices?.reduce((acc, val) => {
                      return acc + val?.pollvotes?.length;
                    }, 0) > 0
                  ) {
                    setvotemodal(true);
                  }
                }}
                style={{
                  cursor: "pointer",
                }}
                color="dimmed"
              >
                <Trans>
                  {poll?.poll?.pollchoices?.reduce((acc, val) => {
                    return acc + val?.pollvotes?.length;
                  }, 0)}{" "}
                  {poll?.poll?.pollchoices?.reduce((acc, val) => {
                    return acc + val?.pollvotes?.length;
                  }, 0) > 1
                    ? "Votes"
                    : "Vote"}
                </Trans>
              </Text>
              <Text color="dimmed"> &#183; </Text>
              <Text color="dimmed">
                {new Date() > new Date(post?.poll?.duration) ? (
                  <Text color="dimmed">
                    <Trans>Poll closed</Trans>
                  </Text>
                ) : (
                  <Text>
                    <Trans>
                      {formatDistanceToNowStrict(
                        new Date(post?.poll?.duration),
                        {
                          locale: {
                            ...locale,
                            formatDistance,
                          },
                        }
                      )}{" "}
                      left{" "}
                    </Trans>
                  </Text>
                )}
              </Text>
            </div>
          </div>
        </div>
      )}

      <Modal
        zIndex={1000}
        title={
          <Trans>
            `Poll Votes ($
            {poll?.poll?.pollchoices?.reduce((acc, val) => {
              return acc + val?.pollvotes?.length;
            }, 0)}
            )`
          </Trans>
        }
        overflow="inside"
        opened={votemodal}
        onClose={() => {
          setvotemodal(false);
        }}
      >
        {poll?.poll?.pollchoices?.map((val) => {
          return val?.pollvotes?.map((vals) => {
            return (
              <div
                key={vals?.user?.username}
                onClick={() => {
                  navigate(`/${vals?.user?.username}`);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 0.5rem 0.5rem 0",
                  cursor: "pointer",
                }}
              >
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                  src={vals?.user?.avatar}
                  alt=""
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <Text weight={500}> {vals?.user?.username}</Text>
                  {vals?.user?.verified && <Verifiedbadge />}
                  {topUser === vals?.user.username && <Topuserbadge />}
                </div>
              </div>
            );
          });
        })}
      </Modal>
    </>
  );
};

export default PostPolls;
