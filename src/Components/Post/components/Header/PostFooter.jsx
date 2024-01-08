import { Avatar, Button, Divider, Flex, Modal, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  ArrowsClockwise,
  BookmarkSimple,
  ChatCircle,
  Heart,
  Lock,
  WarningCircle,
} from "@phosphor-icons/react";
import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/Auth";
import { useMediaQuery } from "@mantine/hooks";
import Verifiedbadge from "../../../../helper/VerifiedBadge";
import Topuserbadge from "../../../../helper/Topuserbadge";
import { useState } from "react";
import { bookmarkPost, likePost } from "../../../../api/POST";

const PostFooter = ({ post, comments, setPosts, setOpenConfirm }) => {
  const { UserInfo, darkmode, topUser, bookmarkIds, setbookmarkIds } =
    useContext(AuthContext);
  const { pathname } = useLocation();
  const bigScreen = useMediaQuery("(min-width: 530px)");
  const showoverflow = useMediaQuery("(max-width: 390px)");
  const [likemodal, setlikemodal] = useState(false);
  const [bookmarkModalOpen, setbookmarkModalOpen] = useState(false);

  const navigate = useNavigate();
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
          setbookmarkModalOpen(true);
          setTimeout(() => {
            setbookmarkModalOpen(false);
          }, 2000);
        } else {
          setbookmarkModalOpen(false);
          setbookmarkIds((prev) => {
            return prev.filter((id) => id !== post.id);
          });
          showNotification({
            color: "gray",
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
      <Flex
        justify="space-between"
        p="0rem 1rem"
        mt="0.4rem"
        style={{
          fontSize: "13px",
          color: "#868e96",
          overflow: "auto",
        }}
      >
        {/* post stats info - # of likes, comments, reposts */}
        {/* big screen mean if screen width is >= 530px  */}
        {bigScreen ? (
          //if width is >= 530px and the post is like by > 3 users
          post?.likes?.length > 3 ? (
            <Flex gap="0.3rem" align="center">
              {/* show 3 of the most recent likers avatar  */}
              <Avatar.Group
                className="addPointer"
                onClick={() => {
                  //onclick show modal with a display of all users that liked the post
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
                />
              </Avatar.Group>
              {/* then with the recent likers avatar show the text liked by {name of latest liker} and the count of reset of likes */}
              <Text
                className="hoveru addPointer"
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
            </Flex>
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
          // if screen width is < 530px simply just show the count of total likes
          <Text
            className="hoveru addPointer"
            onClick={() => {
              //onclick show modal with a display of all users that liked the post
              setlikemodal(true);
            }}
          >
            {post?.likes?.length} likes
          </Text>
        )}

        <Flex align="center" gap="0.3rem">
          {/* total post comments count display  */}
          <Text
            className="hoveru addPointer"
            onClick={() => {
              if (
                //check if the post is a community post or the current path is a communnity page
                pathname.substring(0, pathname.indexOf("/", 1)) ===
                  "/community" ||
                post?.community?.name
              ) {
                //if post is a community post and that it is not already in the community post posts path then navigate to the community post path else dont

                if (pathname !== `/communitypost/${post.id}`) {
                  navigate(`/communitypost/${post.id}`);
                }
              } else {
                // if the current path is already the single post then dont navigate else navigate to the post path
                if (pathname !== `/post/${post.id}`) {
                  navigate(`/post/${post.id}`);
                }
              }
            }}
          >
            {/* count comments total by adding both comments and nested comments total length */}
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
          {/* Total post repost count */}
          <Text
            className="hoveru addPointer"
            onClick={() => {
              //if postquotes is greater than 0 then navigate to the reposts page  of the current post where u can view all the reposts for the current post
              if (post?.postquotesCount > 0) {
                navigate(`/reposts/${post.id}`);
              }
            }}
          >
            {post?.postquotesCount} reposts
          </Text>
        </Flex>
      </Flex>
      {/* divider that divides post stats info and post action buttons */}
      <div
        style={{
          padding: "0rem 0.5rem",
        }}
      >
        <Divider my={2} />
      </div>
      {/* post action buttons - like, comment, repost, save */}
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
        {bigScreen && (
          <Button
            onClick={() => {
              handlebookmark();
            }}
            color={bookmarkIds.includes(post.id) ? "yellow" : "gray"}
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
                  {likeuser?.user?.verified && <Verifiedbadge />}
                  {topUser === likeuser?.user?.username && <Topuserbadge />}
                </div>
              </div>
            );
          })
          .reverse()}
      </Modal>
    </>
  );
};

export default PostFooter;
