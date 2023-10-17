import { Button, Menu, Modal } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

import {
  CopySimple,
  DotsThree,
  Export,
  Lock,
  Pencil,
  Trash,
  UserMinus,
  UserPlus,
  WarningCircle,
} from "@phosphor-icons/react";
import { useContext, useState } from "react";

import { deleteComment } from "../api/DELETE";
import { follow } from "../api/POST";
import { AuthContext } from "../context/Auth";
import NestedReplyModal from "./NestedReplyModal";
export function CommentMenu({ commentinfo, setComments, replyingto }) {
  const { UserInfo, followingdata, setfollowingdata } = useContext(AuthContext);
  const [opened, setOpened] = useState(false);
  const [editopen, seteditopen] = useState(false);
  const handlePostDelete = () => {
    setOpened(false);
    deleteComment({ commentid: commentinfo?.id })
      .then(() => {
        setComments((prev) => {
          return prev.filter((comment) => comment.id !== commentinfo.id);
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
      follow({ followingid: commentinfo?.user.id })
        .then((res) => {
          if (res.data.followed) {
            setfollowingdata((prev) => [
              ...prev,
              res.data.newFollowing.following.username,
            ]);
            showNotification({
              icon: <UserPlus size={18} />,
              message: `You are now following ${commentinfo?.user.username}`,
              autoClose: 3000,
            });
          } else {
            showNotification({
              icon: <UserMinus size={18} />,
              message: `You are no longer following ${commentinfo?.user.username}`,
              autoClose: 3000,
            });

            setfollowingdata((prev) => {
              return prev.filter((item) => item !== commentinfo?.user.username);
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
          {" "}
          {UserInfo?.username === commentinfo?.user.username && (
            <Menu.Item
              onClick={() => {
                seteditopen(true);
              }}
              icon={<Pencil size={14} />}
            >
              Edit
            </Menu.Item>
          )}
          {UserInfo?.username !== commentinfo?.user.username &&
            (followingdata?.includes(commentinfo?.user.username) ? (
              <Menu.Item
                onClick={() => {
                  handleFollow();
                }}
                icon={<UserMinus size={14} />}
              >
                Unfollow {commentinfo?.user.username}
              </Menu.Item>
            ) : (
              <Menu.Item
                onClick={() => {
                  handleFollow();
                }}
                icon={<UserPlus size={14} />}
              >
                Follow {commentinfo?.user.username}
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
            Copy link to comment
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
            Share comment via...
          </Menu.Item>
          {(UserInfo?.username === commentinfo?.user.username ||
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
      <NestedReplyModal
        setOpened={seteditopen}
        opened={editopen}
        UserInfo={UserInfo}
        setComments={setComments}
        editcommentinfo={commentinfo}
        editreplyingto={replyingto}
      />
    </>
  );
}
