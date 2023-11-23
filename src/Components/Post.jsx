import {
  Avatar,
  Button,
  createStyles,
  Divider,
  Flex,
  Image,
  Indicator,
  Modal,
  Text,
} from "@mantine/core";
import {
  ArrowsClockwise,
  BookmarkSimple,
  ChatCircle,
  CircleWavyCheck,
  Globe,
  Heart,
  Link,
  Lock,
  LockLaminated,
  Users,
  UsersThree,
  WarningCircle,
} from "@phosphor-icons/react";
import { useMediaQuery } from "@mantine/hooks";
import { PostMenu } from "./PostMenu";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/Auth";
import { bookmarkPost, likePost } from "../api/POST";
import { showNotification } from "@mantine/notifications";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import locale from "date-fns/locale/en-US";
import { useState } from "react";
import reactStringReplace from "react-string-replace";
import CreatePostModal from "./CreatePostModal";
import PostPolls from "./PostPolls";
import Topuserbadge from "../helper/Topuserbadge";
import { useImageSize } from "react-image-size";
import ImageViewer from "react-simple-image-viewer";

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
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "0.5rem",
  },
  img: {
    width: "100%",
    height: "100%",
    borderRadius: "4px",
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
  const { name } = useParams();
  const { classes } = useStyles();
  const navigate = useNavigate();

  const [dimensions] = useImageSize(
    post?.filetype === "image" ? post?.image : post?.gif
  );
  const [opened, setOpened] = useState(false);
  const [viewimg, setviewimg] = useState("");
  const {
    UserInfo,
    darkmode,
    onlineusers,
    topUser,
    socket,
    bookmarkIds,
    setbookmarkIds,
  } = useContext(AuthContext);
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
  useEffect(() => {
    socket.on("post-deleted", (data) => {
      if (pathname === `/post/${Number(data)}`) {
        navigate("/");
      }
    });
  }, []);
  const handlebookmark = async () => {
    if (!UserInfo) {
      return showNotification({
        icon: <Lock size={18} />,
        color: "red",
        title: "Login required",
        autoClose: 3000,
      });
    }

    await bookmarkPost({ postId: post.id })
      .then((res) => {
        if (res.data.bookmarked) {
          setbookmarkIds((prev) => {
            return [...prev, post.id];
          });
          showNotification({
            icon: <BookmarkSimple size={18} />,
            message: "Post saved successfully",
            autoClose: 3000,
          });
        } else {
          setbookmarkIds((prev) => {
            return prev.filter((id) => id !== post.id);
          });
          showNotification({
            icon: <BookmarkSimple size={18} />,
            message: "Post unsaved successfully",
            autoClose: 3000,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
              {post?.community?.name &&
                pathname !== `/community/${post?.community?.name}` && (
                  <Flex
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigate(`/community/${post?.community?.name}`);
                    }}
                    pb={6}
                    gap={6}
                    align={"center"}
                  >
                    <UsersThree weight="light" size={14} />
                    <Text color="dimmed" size={14}>
                      {post?.community?.name}
                    </Text>
                  </Flex>
                )}

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
                if (
                  pathname.substring(0, pathname.indexOf("/", 1)) ===
                    "/community" ||
                  post?.community?.name
                ) {
                  navigate(`/communitypost/${post.id}`);
                } else {
                  navigate(`/post/${post.id}`);
                }
              }}
              className={classes.body}
            >
              <Text size="15px">{postvalue(post?.text)}</Text>
            </div>
          )}
          {post.image && (
            <div
              style={{
                padding: "0.5rem 1rem 0rem 1rem",
              }}
            >
              {post?.filetype === "image" ? (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom:
                      dimensions?.width < dimensions?.height ? "75%" : "0",

                    /* 4:3 aspect ratio (change as needed) */
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <img
                    style={{
                      position:
                        dimensions?.width < dimensions?.height
                          ? "absolute"
                          : "static",
                      objectFit:
                        dimensions?.width < dimensions?.height
                          ? "cover"
                          : "fill",
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
                </div>
              ) : (
                <video
                  poster={post?.image.slice(0, -3) + "jpg"}
                  style={{ width: "100%", height: "auto", borderRadius: "4px" }}
                  controls
                >
                  <source src={post?.image} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          {post?.gif && (
            <div
              style={{
                padding: "0.5rem 1rem 0rem 1rem",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingBottom:
                    dimensions?.width < dimensions?.height ? "75%" : "0",

                  /* 4:3 aspect ratio (change as needed) */
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <img
                  onClick={() => {
                    setviewimg(post?.gif);
                    setOpened(true);
                  }}
                  style={{
                    position:
                      dimensions?.width < dimensions?.height
                        ? "absolute"
                        : "static",
                    objectFit:
                      dimensions?.width < dimensions?.height ? "cover" : "fill",
                  }}
                  loading="lazy"
                  className={classes.img}
                  src={post?.gif}
                  alt=""
                />
              </div>
            </div>
          )}
          {post?.poll && <PostPolls post={post} />}

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

                  window.open(
                    post?.text?.match(/https?:\/\/[^\s]+/)?.[0],
                    "_blank"
                  );
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

          {/* community link preview */}
          {post.comshare && (
            <Flex
              onClick={() => {
                navigate(`/community/${post.comshare.name}`);
              }}
              style={{
                border: darkmode ? "1px solid #2f3136" : "1px solid #e6ecf0",
                cursor: "pointer",
                borderRadius: "8px",
                padding: "0.5rem",
              }}
              mx={"1rem"}
              justify={"space-between"}
              wrap={"wrap"}
              gap={10}
            >
              <Flex gap={10}>
                <Image
                  width={100}
                  height={100}
                  miw={"auto"}
                  radius={post.comshare.banner ? "sm" : "0"}
                  withPlaceholder
                  src={post.comshare.banner}
                />

                <Flex
                  style={{
                    width: "100%",
                  }}
                  gap={5}
                  direction={"column"}
                >
                  <Text weight={600}>{post.comshare.name}</Text>
                  <Flex gap={3} align={"center"}>
                    <Users size={15} weight="light" />

                    <Text size={"sm"} color="dimmed">
                      {post.comshare.communitymembers.length}{" "}
                      {post.comshare.communitymembers.length > 1
                        ? "members"
                        : "member"}
                    </Text>
                  </Flex>
                  <Flex gap={3} align={"center"}>
                    {post.comshare.private ? (
                      <LockLaminated size={15} weight="light" />
                    ) : (
                      <Globe size={15} weight="light" />
                    )}

                    <Text size={"sm"} color="dimmed">
                      {post.comshare.private ? "Private" : "Public"}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          )}

          {/* quoted post */}

          {post.hasquote && post.post && (
            <div
              style={{
                padding: "0rem 1rem 0rem 1rem",
              }}
            >
              {" "}
              <div
                onClick={() => {
                  if (
                    pathname.substring(0, pathname.indexOf("/", 1)) ===
                      "/community" ||
                    post?.community?.name
                  ) {
                    navigate(`/communitypost/${post.post.id}`);
                  } else {
                    navigate(`/post/${post.post.id}`);
                  }
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
                    {topUser === post?.post.user?.username && <Topuserbadge />}
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

          {/* quote delete */}
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
                  if (
                    pathname.substring(0, pathname.indexOf("/", 1)) ===
                      "/community" ||
                    post?.community?.name
                  ) {
                    if (pathname !== `/communitypost/${post.id}`) {
                      navigate(`/communitypost/${post.id}`);
                    }
                  } else {
                    if (pathname !== `/post/${post.id}`) {
                      navigate(`/post/${post.id}`);
                    }
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
                if (
                  pathname.substring(0, pathname.indexOf("/", 1)) ===
                    "/community" ||
                  post?.community?.name
                ) {
                  navigate(`/communitypost/${post.id}`);
                } else {
                  navigate(`/post/${post.id}`);
                }
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
                  handlebookmark();
                }}
                color={"gray"}
                size="xs"
                leftIcon={
                  <BookmarkSimple
                    weight={bookmarkIds.includes(post.id) ? "fill" : "regular"}
                    size={18}
                  />
                }
                variant="subtle"
              >
                {bookmarkIds.includes(post.id) ? "Saved" : "Save"}
              </Button>
            )}
          </div>
          {/* Check if the current page path is the home page ("/") or a specific community page ("/community/{name}")
 If true, proceed to the next set of conditions */}
          {(pathname === "/" || pathname === `/community/${name}`) &&
            /* Check if there are more than 1 comments with non-null text and no gif in the post
             */
            (post?.comments.filter((val) => {
              return val?.text !== null && val?.gif === null;
            }).length > 1 ||
              /* OR
 Check if the most recent comment's text is non-null and the comment was created within the last 10 days */
              (post?.comments[post?.comments.length - 1]?.text !== null &&
                // Check if the difference between the current date and the recent comment's createdAt date is less than 10 days
                new Date() -
                  new Date(
                    post?.comments[post?.comments.length - 1]?.createdAt
                  ) <
                  10 * 24 * 60 * 60 * 1000)) && ( // 10 days in milliseconds
              <>
                <div
                  onClick={() => {
                    if (
                      pathname.substring(0, pathname.indexOf("/", 1)) ===
                      "/community"
                    ) {
                      navigate(`/communitypost/${post.id}`);
                    } else {
                      navigate(`/post/${post.id}`);
                    }
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    gap: "1rem",
                    paddingTop: "0.7rem",
                  }}
                >
                  {post?.comments

                    .slice(post?.comments.length === 2 ? -1 : -2)
                    .map((com) => {
                      if (com?.text === null && com?.gif) {
                        return null;
                      }
                      return (
                        <div
                          key={com.id}
                          style={{
                            padding: "0 1rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "0.5rem",
                            }}
                          >
                            {/* left */}
                            <div>
                              <Indicator
                                disabled={!onlineusers.includes(com?.user?.id)}
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
                                    navigate(`/${com?.user?.username}`);
                                  }}
                                  size="40px"
                                  radius={"xl"}
                                  src={com?.user?.avatar}
                                  alt=""
                                  loading="lazy"
                                />
                              </Indicator>
                            </div>
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
                                  size={"15px"}
                                  weight={500}
                                >
                                  {com?.user?.username}
                                </Text>

                                {com?.user?.verified &&
                                  (com?.user?.id !== 5 ? (
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
                                {topUser === com?.user?.username && (
                                  <Topuserbadge />
                                )}
                                <Text color="dimmed">·</Text>
                                <Text size={"12px"} color="dimmed">
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
                                  <Text size="15px">
                                    {postvalue(com?.text)}
                                  </Text>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                    .reverse()}
                </div>

                <Text
                  onClick={() => {
                    if (
                      pathname.substring(0, pathname.indexOf("/", 1)) ===
                      "/community"
                    ) {
                      navigate(`/communitypost/${post.id}`);
                    } else {
                      navigate(`/post/${post.id}`);
                    }
                  }}
                  color="dimmed"
                  size={"14px"}
                  style={{
                    padding: "0.1rem 0.1rem 0.5rem 4rem",
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
        communityName={post?.community?.name}
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
      {opened && (
        <div
          style={{
            zIndex: 1000,
          }}
        >
          <ImageViewer
            backgroundStyle={{
              zIndex: 1000,
            }}
            src={[viewimg]}
            currentIndex={0}
            disableScroll={false}
            closeOnClickOutside={true}
            onClose={() => {
              setOpened(false);
              setviewimg("");
            }}
          />
        </div>
      )}
    </>
  );
};
