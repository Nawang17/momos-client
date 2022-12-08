import { createStyles, Modal, Text } from "@mantine/core";
import { ChatCircle, CircleWavyCheck, Heart } from "phosphor-react";
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
    gap: "1rem",
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

export const Post = ({ post, setPosts }) => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [viewimg, setviewimg] = useState("");
  const { likedpostIds, setLikedpostIds, UserInfo, darkmode } =
    useContext(AuthContext);
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
    aboutXMonths: "{{count}}m",
    xMonths: "{{count}}m",
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
      showNotification({
        title: "Please login to like the post",
        autoClose: 4000,
      });
    } else {
      if (likedpostIds.includes(post.id)) {
        setLikedpostIds(likedpostIds.filter((id) => id !== post.id));
        setPosts((prev) => {
          return prev.map((p) => {
            if (p.id === post.id) {
              const likearr = p.likes;
              likearr.pop();
              return { ...p, likes: likearr };
            } else {
              return p;
            }
          });
        });
      } else {
        setLikedpostIds((prev) => [...prev, post.id]);
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === post.id) {
              return {
                ...p,
                likes: [...p.likes, 0],
              };
            } else {
              return p;
            }
          })
        );
      }

      await likePost({ postid: post.id })
        .then((res) => {
          if (res.data.liked) {
            if (likedpostIds.includes(post.id)) {
              console.log("liking");
              setPosts((prev) =>
                prev.map((p) => {
                  if (p.id === post.id) {
                    return {
                      ...p,
                      likes: [...p.likes, 0],
                    };
                  }
                  return p;
                })
              );
              setLikedpostIds((prev) => {
                return [...prev, post.id];
              });
            }
          } else {
            if (!likedpostIds.includes(post.id)) {
              console.log("disliking");
              setPosts((prev) =>
                prev.map((p) => {
                  if (p.id === post.id) {
                    const likeaarr = p.likes;
                    likeaarr.pop();
                    return { ...p, likes: likeaarr };
                  } else {
                    return p;
                  }
                })
              );
              setLikedpostIds((prev) => {
                return prev.filter((id) => id !== post.id);
              });
            }
          }
        })
        .catch((err) => {
          if (err.response.status === 0) {
            showNotification({
              color: "red",
              title: "Internal Server Error",

              autoClose: 7000,
            });
          } else {
            showNotification({
              color: "red",
              title: err.response.data,
              autoClose: 7000,
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
  const { pathname } = useLocation();

  return (
    <>
      <div
        style={{
          backgroundColor: darkmode ? "#1A1B1E" : "white",
          color: darkmode ? "white" : "black",
          borderRadius: pathname !== `/post/${post?.id}` ? "4px" : "0px",
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

          <div className={classes.footer}>
            <div
              onClick={() => {
                handleLike();
              }}
              className={classes.fLeft}
            >
              {!likedpostIds.includes(post.id) ? (
                <Heart color="gray" weight="light" size={19} />
              ) : (
                <Heart color={"red"} weight="fill" size={19} />
              )}

              <Text
                className="unclickablevalue"
                color={
                  !likedpostIds.includes(post.id) ? "rgb(134, 142, 150)" : "red"
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
                {post.comments.length}
              </Text>
            </div>
          </div>
        </div>
      </div>
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
