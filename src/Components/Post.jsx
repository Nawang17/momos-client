import {
  Avatar,
  Button,
  createStyles,
  Divider,
  Indicator,
  Modal,
  Text,
} from "@mantine/core";
import {
  ArrowsClockwise,
  ChatCircle,
  CircleWavyCheck,
  Heart,
  Link,
  Lock,
  Share,
  WarningCircle,
} from "phosphor-react";
import { useMediaQuery } from "@mantine/hooks";
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
import CreatePostModal from "./CreatePostModal";
import PostPolls from "./PostPolls";
import Topuserbadge from "../helper/Topuserbadge";

const useStyles = createStyles(() => ({
  wrapper: {
    background: "white",
    padding: "1rem 0rem 0.5rem 0rem",
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

export const Post = ({ post, setPosts, comments }) => {
  const { pathname } = useLocation();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [viewimg, setviewimg] = useState("");
  const { UserInfo, darkmode, onlineusers, topUser } = useContext(AuthContext);
  const [likemodal, setlikemodal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const matches = useMediaQuery("(min-width: 530px)");
  const showoverflow = useMediaQuery("(max-width: 390px)");
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

  return (
    <>
      <div
        style={{
          backgroundColor: darkmode ? "#1A1B1E" : "white",
          color: darkmode ? "white" : "black",
        }}
        className={classes.wrapper}
      >
        <div className={classes.right}>
          <div
            style={{
              padding: "0rem 1rem ",
            }}
            className={classes.header}
          >
            <div className={classes.hLeft}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Indicator
                  disabled={!onlineusers.includes(post?.user?.id)}
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
                    onClick={() => {
                      navigate(`/${post.user.username}`);
                    }}
                    size="40px"
                    radius={"xl"}
                    src={post.user.avatar}
                    alt=""
                    loading="lazy"
                  />
                </Indicator>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.2rem",
                    }}
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
                    {topUser === post.user.username && <Topuserbadge />}

                    {post?.user?.verified &&
                      (post?.user?.id !== 5 ? (
                        <CircleWavyCheck
                          size={16}
                          color="#0ba6da"
                          weight="fill"
                        />
                      ) : (
                        <CircleWavyCheck
                          size={16}
                          color="#0ba6da"
                          weight="fill"
                        />
                      ))}
                  </div>

                  <Text color="dimmed" size={12}>
                    {formatDistanceToNowStrict(new Date(post.createdAt), {
                      locale: {
                        ...locale,
                        formatDistance,
                      },
                    })}
                  </Text>
                </div>
              </div>
            </div>
            <div className={classes.hRight}>
              <PostMenu postinfo={post} setPosts={setPosts} />
            </div>
          </div>
          {post.text && !post?.poll && (
            <div
              style={{
                cursor: "pointer",

                padding: "0rem 1rem 0rem 1rem",
              }}
              onClick={() => {
                navigate(`/post/${post.id}`);
              }}
              className={classes.body}
            >
              <Text size="15px">{postvalue(post?.text)}</Text>
            </div>
          )}
          {post.image && (
            <div
              style={{
                paddingTop: "0.5rem",
              }}
            >
              {post?.filetype === "image" ? (
                <img
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
                  style={{ width: "100%", height: "auto" }}
                  controls
                >
                  <source src={post?.image} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
          {post?.gif && (
            <>
              <img
                style={{
                  paddingTop: "0.5rem",
                }}
                onClick={() => {
                  setviewimg(post?.gif);
                  setOpened(true);
                }}
                loading="lazy"
                className={classes.img}
                src={post?.gif}
                alt=""
              />
            </>
          )}
          {post?.poll && <PostPolls post={post} />}
          {post.hasquote && post.post && (
            <div
              style={{
                padding: "0rem 1rem 0rem 1rem",
              }}
            >
              {" "}
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
                  paddingBottom:
                    !post?.post.image && !post?.post.gif ? "0.7rem" : "0",
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
                  <Indicator
                    disabled={!onlineusers.includes(post?.post.user?.id)}
                    style={{
                      cursor: "pointer",
                    }}
                    withBorder
                    inline
                    color="green"
                    size={5}
                    offset={3}
                    position="bottom-end"
                  >
                    <Avatar
                      size="18px"
                      radius={"xl"}
                      src={post?.post.user?.avatar}
                      alt=""
                      loading="lazy"
                    />
                  </Indicator>

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
                    {topUser === post.user.username && <Topuserbadge />}
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
                {post?.post?.gif && (
                  <>
                    <img
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "0 0 0.5rem 0.5rem",
                      }}
                      loading="lazy"
                      src={post?.post.gif}
                      alt=""
                    />
                  </>
                )}
              </div>
            </div>
          )}
          {post.hasquote && !post.post && (
            <div
              style={{
                padding: "0rem 1rem 0rem 1rem",
              }}
            >
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
            </div>
          )}
          {/* link preview  */}
          {post.previewlink && (
            <div
              style={{
                padding: "0rem 1rem 0rem 1rem",
              }}
            >
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
                <div
                  style={{
                    display: "flex",
                    padding: "0.5rem",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      paddingTop: "0.2rem",
                    }}
                  >
                    <Link />
                  </div>
                  <div>
                    {post?.previewlink?.url && (
                      <Text size={"14px"} color={"dimmed"}>
                        {post?.previewlink?.url
                          ? post?.previewlink?.url
                              .replace("https://", "")
                              .replace("http://", "")
                              .replace("www.", "")
                              .split(/[/?#]/)[0]
                          : ""}
                      </Text>
                    )}

                    {post?.previewlink?.title && (
                      <Text size={"14px"}> {post?.previewlink?.title}</Text>
                    )}

                    {post?.previewlink?.description && (
                      <Text color={"dimmed"} size={"14px"}>
                        {post?.previewlink?.description}
                      </Text>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* new footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "13px",
              color: "#868e96",
              marginTop: "0.4rem",
              overflow: "auto",
              padding: "0rem 1rem",
            }}
          >
            {/* poststatsinfo */}
            {matches ? (
              post?.likes?.length > 3 ? (
                <div
                  style={{
                    display: "flex",
                    gap: "0.3rem",
                    alignItems: "center",
                  }}
                >
                  <Avatar.Group
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setlikemodal(true);
                    }}
                    spacing="sm"
                  >
                    <Avatar
                      size="sm"
                      src={post?.likes[post?.likes?.length - 1]?.user?.avatar}
                      radius="xl"
                    />
                    <Avatar
                      size="sm"
                      src={post?.likes[post?.likes?.length - 2]?.user?.avatar}
                      radius="xl"
                    />
                    <Avatar
                      size="sm"
                      src={post?.likes[post?.likes?.length - 3]?.user?.avatar}
                      radius="xl"
                    />{" "}
                  </Avatar.Group>
                  <Text
                    className="hoveru"
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setlikemodal(true);
                    }}
                  >
                    Liked by{" "}
                    <Text weight={500} component="span">
                      {post?.likes[post?.likes?.length - 1]?.user?.username}{" "}
                    </Text>{" "}
                    and{" "}
                    <Text weight={500} component="span">
                      {post.likes.length - 1} others
                    </Text>
                  </Text>
                </div>
              ) : (
                <Text
                  className="hoveru"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setlikemodal(true);
                  }}
                >
                  {post.likes.length} likes
                </Text>
              )
            ) : (
              <Text
                className="hoveru"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  setlikemodal(true);
                }}
              >
                {post.likes.length} likes
              </Text>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <Text
                className="hoveru"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (pathname !== `/post/${post.id}`) {
                    navigate(`/post/${post.id}`);
                  }
                }}
              >
                {comments
                  ? `${comments?.reduce((acc, curr) => {
                      return acc + curr.nestedcomments?.length;
                    }, comments.length)}`
                  : `${post.comments?.reduce((acc, curr) => {
                      return acc + curr.nestedcomments?.length;
                    }, post.comments.length)}`}{" "}
                comments
              </Text>
              <Text>·</Text>
              <Text
                className="hoveru"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (post?.postquotesCount > 0) {
                    navigate(`/reposts/${post.id}`);
                  }
                }}
              >
                {" "}
                {post?.postquotesCount} reposts
              </Text>
            </div>
          </div>
          <div
            style={{
              padding: "0rem 0.5rem",
            }}
          >
            <Divider my={2} />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              overflow: showoverflow ? "auto" : "hidden",
              padding: "0rem 1rem ",
            }}
          >
            <Button
              onClick={() => {
                handleLike();
              }}
              color={
                !post?.likes.find((like) => {
                  return like?.user?.username === UserInfo?.username;
                })
                  ? "gray"
                  : "red"
              }
              size="xs"
              leftIcon={
                <Heart
                  weight={
                    !post?.likes.find((like) => {
                      return like?.user?.username === UserInfo?.username;
                    })
                      ? "light"
                      : "fill"
                  }
                  color={
                    !post?.likes.find((like) => {
                      return like?.user?.username === UserInfo?.username;
                    })
                      ? darkmode
                        ? "#e9ecef"
                        : "#868e96"
                      : "red"
                  }
                  size={18}
                />
              }
              variant="subtle"
            >
              Like
            </Button>
            <Button
              onClick={() => {
                navigate(`/post/${post.id}`);
              }}
              color={"gray"}
              size="xs"
              leftIcon={<ChatCircle size={18} />}
              variant="subtle"
            >
              Comment
            </Button>
            <Button
              onClick={() => {
                if (UserInfo) {
                  setOpenConfirm(true);
                } else {
                  showNotification({
                    icon: <Lock size={18} />,
                    title: "Login required",
                    autoClose: 3000,
                    color: "red",
                  });
                }
              }}
              color={"gray"}
              size="xs"
              leftIcon={<ArrowsClockwise size={18} />}
              variant="subtle"
            >
              Repost
            </Button>
            {matches && (
              <Button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Share Post",
                      url: `https://momosz.com/post/${post?.id}`,
                    });
                  }
                }}
                color={"gray"}
                size="xs"
                leftIcon={<Share size={18} />}
                variant="subtle"
              >
                Share
              </Button>
            )}
          </div>
          {pathname === "/" && post?.comments.length > 1 && (
            <>
              <div
                onClick={() => {
                  navigate(`/post/${post.id}`);
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  gap: "0.5rem",
                  paddingTop: "0.5rem",
                }}
              >
                {post?.comments
                  .sort((a, b) => {
                    return b?.commentlikes.length - a?.commentlikes.length;
                  })
                  .slice(0, post?.comments.length === 2 ? 1 : 2)
                  .map((com) => {
                    return (
                      <div
                        key={com.id}
                        style={{
                          padding: "0 1.2rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                          }}
                        >
                          {/* left */}
                          <img
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/${com?.user?.username}`);
                            }}
                            width={32}
                            height={32}
                            style={{
                              borderRadius: "50%",
                            }}
                            src={com?.user?.avatar}
                            alt=""
                          />
                          <div
                            style={{
                              width: "100%",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.2rem",
                              }}
                            >
                              <Text
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/${com?.user?.username}`);
                                }}
                                size={"14px"}
                                weight={500}
                              >
                                {com?.user?.username}
                              </Text>
                              {topUser === com?.user?.username && (
                                <Topuserbadge />
                              )}
                              <Text color="dimmed">·</Text>
                              <Text size={"13px"} color="dimmed">
                                {formatDistanceToNowStrict(
                                  new Date(com?.createdAt),
                                  {
                                    locale: {
                                      ...locale,
                                      formatDistance,
                                    },
                                  }
                                )}
                              </Text>
                            </div>
                            {com.text && (
                              <div
                                style={{
                                  cursor: "pointer",
                                  paddingTop: "0",
                                }}
                                className={classes.body}
                              >
                                <Text size="14px">{postvalue(com?.text)}</Text>
                              </div>
                            )}
                            {com.gif && (
                              <div
                                style={{
                                  cursor: "pointer",
                                  paddingTop: "0.3rem",
                                }}
                              >
                                <img
                                  style={{
                                    width: "100%",
                                    height: "auto",
                                    borderRadius: "0.5rem",
                                  }}
                                  loading="lazy"
                                  src={com.gif}
                                  alt=""
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <Text
                onClick={() => {
                  navigate(`/post/${post.id}`);
                }}
                color="dimmed"
                size={"14px"}
                style={{
                  padding: "0.1rem 0.1rem 0.5rem 3.7rem",
                  cursor: "pointer",
                }}
              >
                See all{" "}
                {comments
                  ? `${comments?.reduce((acc, curr) => {
                      return acc + curr.nestedcomments?.length;
                    }, comments.length)}`
                  : `${post.comments?.reduce((acc, curr) => {
                      return acc + curr.nestedcomments?.length;
                    }, post.comments.length)}`}{" "}
                comments
              </Text>
            </>
          )}
        </div>
      </div>
      <CreatePostModal
        opened={openConfirm}
        setOpened={setOpenConfirm}
        setHomePosts={setPosts}
        UserInfo={UserInfo}
        quotepostinfo={post}
      />

      {/* like data modal  */}
      <Modal
        zIndex={1000}
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
                  {topUser === likeuser?.user?.username && <Topuserbadge />}
                  {likeuser?.user?.verified && (
                    <CircleWavyCheck size={17} color="#0ba6da" weight="fill" />
                  )}
                </div>
              </div>
            );
          })
          .reverse()}
      </Modal>
      {/* view img modal  */}
      <Modal
        zIndex={1000}
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
      </Modal>
    </>
  );
};
