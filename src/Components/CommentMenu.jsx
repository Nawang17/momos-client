import { Button, Menu, Modal } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

import {
  CopySimple,
  DotsThree,
  Export,
  Lock,
  Trash,
  UserMinus,
  UserPlus,
  WarningCircle,
} from "phosphor-react";
import { useContext, useState } from "react";

import { deleteComment } from "../api/DELETE";
import { follow } from "../api/POST";
import { AuthContext } from "../context/Auth";
export function CommentMenu({ postinfo, setComments }) {
  const { UserInfo, followingdata, setfollowingdata } = useContext(AuthContext);
  const [opened, setOpened] = useState(false);

  const handlePostDelete = () => {
    setOpened(false);
    deleteComment({ commentid: postinfo?.id })
      .then(() => {
        setComments((prev) => {
          return prev.filter((comment) => comment.id !== postinfo.id);
        });
        showNotification({
          icon: <Trash size={18} />,
          title: "Reply Deleted",
          autoClose: 4000,
          color: "red",
        });
      })
      .catch((err) => {
        if (err.response.status === 0) {
          showNotification({
            icon: <WarningCircle size={18} />,
            color: "red",
            title: "Internal Server Error",
            autoClose: 7000,
          });
        } else {
          showNotification({
            icon: <WarningCircle size={18} />,
            color: "red",
            title: err.response.data,
            autoClose: 7000,
          });
        }
      });
  };
  const handleFollow = () => {
    if (!UserInfo) {
      showNotification({
        icon: <Lock size={18} />,
        title: "Login required",
        autoClose: 5000,
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
              autoClose: 4000,
            });
          } else {
            showNotification({
              icon: <UserMinus size={18} />,
              message: `You are no longer following ${postinfo?.user.username}`,
              autoClose: 4000,
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
              autoClose: 7000,
            });
          } else {
            showNotification({
              icon: <WarningCircle size={18} />,
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
      <Menu position="bottom-end" shadow="md" width={200}>
        <Menu.Target>
          <DotsThree size={20} />
        </Menu.Target>

        <Menu.Dropdown>
          {(UserInfo?.username === postinfo?.user.username ||
            UserInfo?.username === "katoph") && (
            <Menu.Item
              onClick={() => {
                setOpened(true);
              }}
              color="red"
              icon={<Trash color="red" size={14} />}
            >
              Delete
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
                Unfollow {postinfo?.user.username}
              </Menu.Item>
            ) : (
              <Menu.Item
                onClick={() => {
                  handleFollow();
                }}
                icon={<UserPlus size={14} />}
              >
                Follow {postinfo?.user.username}
              </Menu.Item>
            ))}
          <Menu.Item
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              showNotification({
                icon: <CopySimple size={18} />,
                title: "Link copied to clipboard",
                autoClose: 4000,
                color: "gray",
              });
            }}
            icon={<CopySimple size={14} />}
          >
            Copy link to reply
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "Share reply",
                  url: window.location.href,
                });
              }
            }}
            icon={<Export size={14} />}
          >
            Share reply via...
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Modal
        overlayOpacity={0.3}
        padding={0}
        withCloseButton={false}
        size="xs"
        opened={opened}
        onClose={() => setOpened(false)}
      >
        <div className="dpm">
          <div className="dpm-header">Delete reply?</div>
          <div className="dpm-body">
            This can’t be undone and it will be removed from your profile, the
            timeline.
          </div>
          <div className="dpm-footer">
            <Button
              onClick={() => {
                handlePostDelete();
              }}
              radius="xl"
              color="red"
            >
              Delete
            </Button>
            <Button
              onClick={() => setOpened(false)}
              variant="outline"
              color="gray"
              radius="xl"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
