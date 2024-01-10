import { Button, Menu, Modal } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

import {
  BookmarkSimple,
  CopySimple,
  DotsThree,
  Export,
  Lock,
  Trash,
  UserMinus,
  UserPlus,
  WarningCircle,
} from "@phosphor-icons/react";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { deletePost } from "../../../../api/DELETE";
import { follow } from "../../../../api/POST";
import { AuthContext } from "../../../../context/Auth";
import { handlebookmark } from "../../common/functions";
import { Trans } from "@lingui/macro";

export function PostMenu({ postinfo, setPosts, setbookmarkModalOpen }) {
  const {
    UserInfo,
    followingdata,
    setfollowingdata,
    bookmarkIds,
    setbookmarkIds,
  } = useContext(AuthContext);
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const handlePostDelete = () => {
    setOpened(false);
    deletePost({ postid: postinfo?.id })
      .then(() => {
        setPosts((prev) => {
          return prev.filter((post) => post.id !== postinfo.id);
        });
        showNotification({
          icon: <Trash size={18} />,
          title: "Post Deleted",
          autoClose: 3000,
          color: "red",
        });
        if (pathname === `/post/${postinfo?.id}`) {
          navigate("/");
        } else if (pathname === `/communitypost/${postinfo?.id}`) {
          navigate(-1);
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
  };
  const handleFollow = () => {
    if (!UserInfo) {
      showNotification({
        icon: <Lock size={18} />,
        title: "Login required",
        autoClose: 3000,
        color: "red",
      });
    } else {
      follow({ followingid: postinfo?.user.id })
        .then((res) => {
          if (res.data.followed) {
            setfollowingdata((prev) => [
              ...prev,
              res.data.newFollowing.following.username,
            ]);
            showNotification({
              icon: <UserPlus size={18} />,
              message: `You are now following ${postinfo?.user.username}`,
              autoClose: 3000,
            });
          } else {
            showNotification({
              icon: <UserMinus size={18} />,
              message: `You are no longer following ${postinfo?.user.username}`,
              autoClose: 3000,
            });

            setfollowingdata((prev) => {
              return prev.filter((item) => item !== postinfo?.user.username);
            });
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
      <Menu position="bottom-end" shadow="md" width={200}>
        <Menu.Target
          style={{
            cursor: "pointer",
          }}
        >
          <DotsThree size={20} />
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            onClick={() => {
              handlebookmark(
                UserInfo,
                setbookmarkIds,
                setbookmarkModalOpen,
                postinfo
              );
            }}
            icon={
              <BookmarkSimple
                weight={bookmarkIds.includes(postinfo?.id) ? "fill" : "regular"}
                size={14}
              />
            }
          >
            {bookmarkIds.includes(postinfo?.id) ? (
              <Trans>Unsave</Trans>
            ) : (
              <Trans>Save</Trans>
            )}
          </Menu.Item>
          {(UserInfo?.username === postinfo?.user.username ||
            UserInfo?.username === "katoph") && (
            <Menu.Item
              onClick={() => {
                setOpened(true);
              }}
              icon={<Trash size={14} />}
            >
              <Trans>Delete</Trans>
            </Menu.Item>
          )}
          {UserInfo?.username !== postinfo?.user.username &&
            (followingdata?.includes(postinfo?.user.username) ? (
              <Menu.Item
                onClick={() => {
                  handleFollow();
                }}
                icon={<UserMinus size={14} />}
              >
                <Trans>Unfollow {postinfo?.user.username}</Trans>
              </Menu.Item>
            ) : (
              <Menu.Item
                onClick={() => {
                  handleFollow();
                }}
                icon={<UserPlus size={14} />}
              >
                <Trans>Follow {postinfo?.user.username}</Trans>
              </Menu.Item>
            ))}

          <Menu.Item
            onClick={() => {
              navigator.clipboard.writeText(
                `https://momosz.com/post/${postinfo?.id}`
              );
              showNotification({
                icon: <CopySimple size={18} />,
                title: <Trans>Link copied to clipboard</Trans>,
                autoClose: 3000,
                color: "gray",
              });
            }}
            icon={<CopySimple size={14} />}
          >
            <Trans>Copy link to Post</Trans>
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "Share Post",
                  url: `https://momosz.com/post/${postinfo?.id}`,
                });
              }
            }}
            icon={<Export size={14} />}
          >
            <Trans>Share Post via...</Trans>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Modal
        zIndex={1000}
        overlayOpacity={0.3}
        padding={0}
        withCloseButton={false}
        size="xs"
        opened={opened}
        onClose={() => setOpened(false)}
      >
        <div className="dpm">
          <div className="dpm-header">
            <Trans>Delete Post?</Trans>
          </div>
          <div className="dpm-body">
            <Trans>
              {" "}
              This can’t be undone and it will be removed from your profile, the
              timeline.
            </Trans>
          </div>
          <div className="dpm-footer">
            <Button
              onClick={() => {
                handlePostDelete();
              }}
              radius="xl"
              color="red"
            >
              <Trans>Delete</Trans>
            </Button>
            <Button
              onClick={() => setOpened(false)}
              variant="outline"
              color="gray"
              radius="xl"
            >
              <Trans>Cancel</Trans>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
