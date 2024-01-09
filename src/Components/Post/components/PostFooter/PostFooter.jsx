import { Avatar, Button, Divider, Flex, Text } from "@mantine/core";
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
import { useState } from "react";
import { likePost } from "../../../../api/POST";
import LikesUsersModal from "../PostModals/LikesUsersModal";
import { handlebookmark } from "../../common/functions";

const PostFooter = ({
  post,
  comments,
  setPosts,
  setOpenConfirm,
  setbookmarkModalOpen,
}) => {
  const { UserInfo, darkmode, bookmarkIds, setbookmarkIds } =
    useContext(AuthContext);
  const { pathname } = useLocation();
  const bigScreen = useMediaQuery("(min-width: 530px)");
  const showoverflow = useMediaQuery("(max-width: 390px)");
  const [likemodalstate, setlikemodalstate] = useState(false);
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
                  setlikemodalstate(true);
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
                  setlikemodalstate(true);
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
                setlikemodalstate(true);
              }}
            >
              {post?.likes?.length} likes
            </Text>
          )
        ) : (
          // if screen width is < 530px simply just show the count of total likes
          <Text
            className="hoveru addPointer"
            onClick={() => {
              //onclick show modal with a display of all users that liked the post
              setlikemodalstate(true);
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

      <Flex
        justify="space-between"
        p="0rem 1rem"
        style={{
          overflow: showoverflow ? "auto" : "hidden", //if screen width is < 390px then show overflow else dont
        }}
      >
        {/* like button */}
        <Button
          onClick={() => {
            handleLike();
          }}
          color={
            //if the current user has liked the post then color the like button red else color it gray
            !post?.likes?.find((like) => {
              return like?.user?.username === UserInfo?.username;
            })
              ? "gray"
              : "red"
          }
          size="xs"
          leftIcon={
            <Heart
              weight={
                !post?.likes?.find((like) => {
                  return like?.user?.username === UserInfo?.username;
                })
                  ? "light"
                  : "fill"
              }
              color={
                !post?.likes?.find((like) => {
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
        {/* comment button  */}
        <Button
          onClick={() => {
            if (
              //check if the post is a community post or the current path is a communnity page
              pathname.substring(0, pathname.indexOf("/", 1)) ===
                "/community" ||
              post?.community?.name
            ) {
              //if post is a community post and that it is not already in the community post posts path then navigate to the community post path else dont
              navigate(`/communitypost/${post?.id}`);
            } else {
              // if the current path is already the single post then dont navigate else navigate to the post path
              navigate(`/post/${post?.id}`);
            }
          }}
          color={"gray"}
          size="xs"
          leftIcon={<ChatCircle size={18} />}
          variant="subtle"
        >
          Comment
        </Button>
        {/* repost button */}
        <Button
          onClick={() => {
            //if the current user is logged in then open the repost modal else show a notification that login is required
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
        {/* only show the save button if the screen width is >= 530px */}
        {bigScreen && (
          <Button
            onClick={() => {
              handlebookmark(
                UserInfo,
                setbookmarkIds,
                setbookmarkModalOpen,
                post
              );
            }}
            color={bookmarkIds?.includes(post?.id) ? "yellow" : "gray"}
            size="xs"
            leftIcon={
              <BookmarkSimple
                weight={bookmarkIds?.includes(post?.id) ? "fill" : "regular"}
                size={18}
              />
            }
            variant="subtle"
          >
            {bookmarkIds?.includes(post?.id) ? "Saved" : "Save"}
          </Button>
        )}
      </Flex>
      {/* modal that shows the users that liked the post */}
      <LikesUsersModal
        post={post}
        likemodalstate={likemodalstate}
        setlikemodalstate={setlikemodalstate}
      />
    </>
  );
};

export default PostFooter;
