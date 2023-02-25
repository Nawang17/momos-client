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

import { deleteNestedComment } from "../api/DELETE";
import { follow } from "../api/POST";
import { AuthContext } from "../context/Auth";
export function NestedCommentMenu({
  commentuser,
  setComments,
  commentId,
  replyingtoId,
  userid,
}) {
  const { UserInfo, followingdata, setfollowingdata } = useContext(AuthContext);
  const [opened, setOpened] = useState(false);

  const handlePostDelete = () => {
    setOpened(false);
    deleteNestedComment({ commentid: commentId })
      .then(() => {
        setComments((prev) => {
          return prev.map((comment) => {
            if (comment.id === replyingtoId) {
              return {
                ...comment,
                nestedcomments: comment.nestedcomments.filter(
                  (nestedcomment) => nestedcomment.id !== commentId
                ),
              };
            }
            return comment;
          });
        });

        showNotification({
          icon: <Trash size={18} />,
          title: "Reply Deleted",
          autoClose: 3000,
          color: "red",
        });
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
      follow({ followingid: userid })
        .then((res) => {
          if (res.data.followed) {
            setfollowingdata((prev) => [
              ...prev,
              res.data.newFollowing.following.username,
            ]);
            showNotification({
              icon: <UserPlus size={18} />,
              message: `You are now following ${commentuser}`,
              autoClose: 3000,
            });
          } else {
            showNotification({
              icon: <UserMinus size={18} />,
              message: `You are no longer following ${commentuser}`,
              autoClose: 3000,
            });

            setfollowingdata((prev) => {
              return prev.filter((item) => item !== commentuser);
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
          {(UserInfo?.username === commentuser ||
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

          {UserInfo?.username !== commentuser &&
            (followingdata?.includes(commentuser) ? (
              <Menu.Item
                onClick={() => {
                  handleFollow();
                }}
                icon={<UserMinus size={14} />}
              >
                Unfollow {commentuser}
              </Menu.Item>
            ) : (
              <Menu.Item
                onClick={() => {
                  handleFollow();
                }}
                icon={<UserPlus size={14} />}
              >
                Follow {commentuser}
              </Menu.Item>
            ))}
          <Menu.Item
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              showNotification({
                icon: <CopySimple size={18} />,
                title: "Link copied to clipboard",
                autoClose: 3000,
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
        zIndex={1000}
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
