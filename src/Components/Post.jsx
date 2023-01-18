import { createStyles, Modal, Text } from "@mantine/core";
import {
  ChatCircle,
  CircleWavyCheck,
  Heart,
  Lock,
  WarningCircle,
} from "phosphor-react";
import { PostMenu } from "./PostMenu";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { likePost } from "../api/POST";
import { showNotification } from "@mantine/notifications";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import locale from "date-fns/locale/en-US";
import { useState } from "react";
import reactStringReplace from "react-string-replace";

const useStyles = createStyles(() => ({
  wrapper: {
    background: "white",
    padding: "1rem",
    display: "flex",
    gap: "1rem",
    borderRadius: "4px",
    "@media (max-width: 700px)": {
      borderRadius: "0px",
    },

    // "&:hover": {
    //   background: "#f5f5f5",
    // },
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
    borderRadius: "4px",
  },
  img: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
    border: "1px solid #f5f5f5",
  },

  body: {
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
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

export const Post = ({ post, setPosts, comments }) => {
  const { pathname } = useLocation();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [viewimg, setviewimg] = useState("");
  const { UserInfo, darkmode } = useContext(AuthContext);
  const [likemodal, setlikemodal] = useState(false);
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

  const handleLike = async () => {
    if (!UserInfo) {
      return showNotification({
        icon: <Lock size={18} />,
        color: "red",
        title: "Login required",
        autoClose: 3000,
      });
    } else {
      if (
        post?.likes.find((like) => {
          return like?.user?.username === UserInfo?.username;
        })
      ) {
        setPosts((prev) => {
          return prev.map((p) => {
            if (p.id === post.id) {
              let likearr = p.likes;
              likearr = likearr.filter(
                (likeuser) => likeuser?.user?.username !== UserInfo?.username
              );

              return { ...p, likes: likearr };
            } else {
              return p;
            }
          });
        });
      } else {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === post.id) {
              return {
                ...p,
                likes: [
                  ...p.likes,
                  {
                    user: {
                      username: UserInfo?.username,
                      avatar: UserInfo?.avatar,
                    },
                  },
                ],
              };
            } else {
              return p;
            }
          })
        );
      }

      await likePost({ postId: post.id })
        .then((res) => {
          if (res.data.liked) {
            if (
              post?.likes.find((like) => {
                return like?.user?.username === UserInfo?.username;
              })
            ) {
              setPosts((prev) =>
                prev.map((p) => {
                  if (p.id === post.id) {
                    return {
                      ...p,
                      likes: [
                        ...p.likes,
                        {
                          user: {
                            username: UserInfo?.username,
                            avatar: UserInfo?.avatar,
                          },
                        },
                      ],
                    };
                  }
                  return p;
                })
              );
            }
          } else {
            if (
              !post?.likes.find((like) => {
                return like?.user?.username === UserInfo?.username;
              })
            ) {
              setPosts((prev) =>
                prev.map((p) => {
                  if (p.id === post.id) {
                    let likeaarr = p.likes;
                    likeaarr = likeaarr.filter(
                      (likeuser) =>
                        likeuser?.user?.username !== UserInfo?.username
                    );

                    return { ...p, likes: likeaarr };
                  } else {
                    return p;
                  }
                })
              );
            }
          }
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
              navigate(`/${post.user.username}`);
            }}
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
                  onClick={() => {
                    navigate(`/${post.user.username}`);
                  }}
                  weight={500}
                  size="15px"
                >
                  {post.user.username}
                </Text>
                {post?.user?.verified &&
                  (post?.user?.id !== 5 ? (
                    <CircleWavyCheck size={17} color="#0ba6da" weight="fill" />
                  ) : (
                    <CircleWavyCheck size={17} color="#0ba6da" weight="fill" />
                  ))}

                <Text color="dimmed">·</Text>
                <Text color="dimmed" size="sm">
                  {formatDistanceToNowStrict(new Date(post.createdAt), {
                    locale: {
                      ...locale,
                      formatDistance,
                    },
                  })}
                </Text>
              </div>
            </div>
            <div className={classes.hRight}>
              <PostMenu postinfo={post} setPosts={setPosts} />
            </div>
          </div>
          {post.text && (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate(`/post/${post.id}`);
              }}
              className={classes.body}
            >
              <Text size="15px">{postvalue(post?.text)}</Text>
            </div>
          )}
          {post.image && (
            <div>
              {post?.filetype === "image" ? (
                <img
                  style={{
                    border: darkmode
                      ? "1px solid #2f3136"
                      : "1px solid #e6ecf0",
                  }}
                  onClick={() => {
                    setviewimg(post?.image);
                    setOpened(true);
                  }}
                  loading="lazy"
                  className={classes.img}
                  src={post?.image}
                  alt=""
                />
              ) : (
                <video
                  poster={post?.image.slice(0, -3) + "jpg"}
                  // preload="none"
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                  controls
                >
                  <source src={post?.image} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
          {post.hasquote && post.post && (
            <div
              onClick={() => {
                navigate(`/post/${post.post.id}`);
              }}
              style={{
                cursor: "pointer",
                fontSize: "0.9rem",

                border: darkmode ? "1px solid #2f3136" : "1px solid #e6ecf0",
                display: "flex",
                flexDirection: "column",
                paddingBottom: !post?.post.image ? "0.7rem" : "0",
                gap: "0.5rem",
                borderRadius: "0.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "0.3rem",
                  alignItems: "center",
                  padding: "0.7rem 0.7rem 0 0.7rem",
                }}
              >
                <img
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                  }}
                  src={post?.post.user?.avatar}
                  alt=""
                />
                <div
                  style={{
                    display: "flex",
                    gap: "0.2rem",
                    alignItems: "center",
                  }}
                >
                  <Text size="15px" weight={500}>
                    {" "}
                    {post?.post.user?.username}
                  </Text>
                  {post?.post.user.verified &&
                    (post?.post.user.id !== 5 ? (
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
                </div>
                <Text color={"dimmed"}>·</Text>
                <Text color={"dimmed"}>
                  {" "}
                  {formatDistanceToNowStrict(new Date(post?.post.createdAt), {
                    locale: {
                      ...locale,
                      formatDistance,
                    },
                  })}
                </Text>
              </div>
              {post?.post.text && (
                <Text
                  size="15px"
                  style={{
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    padding: "0 0.7rem 0 0.7rem",
                  }}
                >
                  {post?.post.text}
                </Text>
              )}

              {post?.post.image && (
                <>
                  {post?.post.filetype === "image" ? (
                    <img
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "0 0 0.5rem 0.5rem",
                      }}
                      loading="lazy"
                      src={post?.post.image}
                      alt=""
                    />
                  ) : (
                    <video
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      poster={post?.post.image.slice(0, -3) + "jpg"}
                      // preload="none"
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "0 0 0.5rem 0.5rem",
                      }}
                      controls
                    >
                      <source src={post?.post.image} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </>
              )}
            </div>
          )}
          {post.hasquote && !post.post && (
            <div
              style={{
                backgroundColor: darkmode ? "#2f3136" : "#f5f8fa",
                cursor: "pointer",
                fontSize: "0.9rem",

                border: darkmode ? "1px solid #2f3136" : "1px solid #e6ecf0",
                display: "flex",

                padding: "0.7rem",

                borderRadius: "0.5rem",
              }}
            >
              <Text color={"dimmed"}>
                {" "}
                This post was deleted by the author.{" "}
              </Text>
            </div>
          )}

          {/* link preview  */}
          {post.previewlink && (
            <div
              onClick={(e) => {
                e.stopPropagation();

                window.open(post?.previewlink?.url, "_blank");
              }}
              style={{
                cursor: "pointer",
                border: darkmode ? "1px solid #2f3136" : "1px solid #e6ecf0",

                borderRadius: "8px",
              }}
            >
              {post?.previewlink?.image && (
                <img
                  loading="lazy"
                  style={{
                    width: "100%",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                  }}
                  src={post?.previewlink?.image}
                  alt=""
                />
              )}

              <div
                style={{
                  padding: "0.5rem",
                }}
              >
                <Text size={"14px"} color={"dimmed"}>
                  {" "}
                  {post?.previewlink?.title}
                </Text>
                <Text size={"14px"}>
                  {post?.previewlink?.description?.length > 115
                    ? post?.previewlink?.description.substring(0, 115) + "..."
                    : post?.previewlink?.description}
                </Text>
              </div>
            </div>
          )}

          <div className={classes.footer}>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
              }}
            >
              <div
                onClick={() => {
                  handleLike();
                }}
                className={classes.fLeft}
              >
                {!post?.likes.find((like) => {
                  return like?.user?.username === UserInfo?.username;
                }) ? (
                  <Heart color="gray" weight="light" size={19} />
                ) : (
                  <Heart color={"rgb(255, 69, 0)"} weight="fill" size={19} />
                )}

                <Text
                  className="unclickablevalue"
                  color={
                    !post?.likes.find((like) => {
                      return like?.user?.username === UserInfo?.username;
                    })
                      ? "rgb(134, 142, 150)"
                      : "rgb(255, 69, 0)"
                  }
                  size="14px"
                >
                  {post.likes.length}
                </Text>
              </div>

              <div
                onClick={() => {
                  navigate(`/post/${post.id}`);
                }}
                className={classes.fRight}
              >
                <ChatCircle color="gray" weight="light" size={17} />
                <Text
                  className="unclickablevalue"
                  size="14px"
                  color={"rgb(134, 142, 150)"}
                >
                  {comments
                    ? `${comments?.reduce((acc, curr) => {
                        return acc + curr.nestedcomments?.length;
                      }, comments.length)}`
                    : `${post.comments?.reduce((acc, curr) => {
                        return acc + curr.nestedcomments?.length;
                      }, post.comments.length)}`}
                </Text>
              </div>
            </div>
            {pathname === `/post/${post.id}` && (
              <div
                onClick={() => {
                  setlikemodal(true);
                }}
                style={{
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  color: "rgb(134, 142, 150)",
                }}
              >
                View Likes
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal
        title={`Likes (${post.likes.length})`}
        overflow="inside"
        opened={likemodal}
        onClose={() => {
          setlikemodal(false);
        }}
      >
        {post?.likes
          ?.map((likeuser) => {
            return (
              <div
                key={likeuser?.user?.username}
                onClick={() => {
                  navigate(`/${likeuser?.user?.username}`);
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
                  src={likeuser?.user?.avatar}
                  alt=""
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  <Text weight={500}> {likeuser?.user?.username}</Text>
                  {likeuser?.user?.verified && (
                    <CircleWavyCheck size={17} color="#0ba6da" weight="fill" />
                  )}
                </div>
              </div>
            );
          })
          .reverse()}
      </Modal>
      <Modal
        padding={0}
        size="lg"
        withCloseButton={false}
        opened={opened}
        onClose={() => {
          setOpened(false);
          setviewimg("");
        }}
      >
        <div style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}>
          <img
            loading="lazy"
            style={{ width: "100%", height: "auto" }}
            src={viewimg}
            alt=""
          />
        </div>
        {/* revert */}
      </Modal>
    </>
  );
};
