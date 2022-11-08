import { createStyles, Modal, Text } from "@mantine/core";
import { ChatCircle, CircleWavyCheck, Heart } from "phosphor-react";
import { PostMenu } from "./PostMenu";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { likePost } from "../api/POST";
import { showNotification } from "@mantine/notifications";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import locale from "date-fns/locale/en-US";
import { useState } from "react";
const useStyles = createStyles(() => ({
  wrapper: {
    background: "white",
    padding: "1rem",
    display: "flex",
    gap: "1rem",
    borderRadius: "4px",
    cursor: "pointer",
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
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [viewimg, setviewimg] = useState("");

  const { likedpostIds, setLikedpostIds, UserInfo } = useContext(AuthContext);
  const handleLike = () => {
    if (!UserInfo) {
      showNotification({
        title: "Please login to like the post",
        autoClose: 4000,
      });
    } else {
      likePost({ postid: post.id, targetid: post.user.id })
        .then((res) => {
          if (res.data.liked) {
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
          } else {
            setPosts((prev) =>
              prev.map((p) => {
                if (p.id === post.id) {
                  const likearr = p.likes;
                  likearr.pop();
                  return { ...p, likes: likearr };
                } else {
                  return p;
                }
              })
            );
            setLikedpostIds((prev) => {
              return prev.filter((id) => id !== post.id);
            });
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

  return (
    <>
      <div
        onClick={() => {
          navigate(`/post/${post.id}`);
        }}
        className={classes.wrapper}
      >
        <div className={classes.left}>
          <img
            onClick={(event) => {
              navigate(`/${post.user.username}`);
              event.stopPropagation();
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
                  onClick={(event) => {
                    navigate(`/${post.user.username}`);
                    event.stopPropagation();
                  }}
                  weight={500}
                  size="15px"
                >
                  {post.user.username}
                </Text>
                {post.user.verified && (
                  <CircleWavyCheck size={17} color="#0ba6da" weight="fill" />
                )}
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
            <div className={classes.body}>
              <Text size="15px">{post?.text}</Text>
            </div>
          )}

          {post.image && (
            <div>
              <img
                onClick={(event) => {
                  setviewimg(post?.image);
                  setOpened(true);
                  event.stopPropagation();
                }}
                loading="lazy"
                className={classes.image}
                src={post?.image}
                alt=""
              />
            </div>
          )}

          <div className={classes.footer}>
            <div
              onClick={(event) => {
                handleLike();
                event.stopPropagation();
              }}
              className={classes.fLeft}
            >
              {!likedpostIds.includes(post.id) ? (
                <Heart color="gray" weight="light" size={19} />
              ) : (
                <Heart color="red" weight="fill" size={19} />
              )}

              <Text
                className="unclickablevalue"
                color={!likedpostIds.includes(post.id) ? "gray" : "red"}
                size="14px"
              >
                {post.likes.length}
              </Text>
            </div>

            <div className={classes.fRight}>
              <ChatCircle color="gray" weight="light" size={17} />
              <Text className="unclickablevalue" size="14px" color={"gray"}>
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
