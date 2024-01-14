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
import { Trans } from "@lingui/macro";
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
          title: <Trans>Reply Deleted</Trans>,
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
        title: <Trans>Login required</Trans>,
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
              message: (
                <Trans>
                  You are now following {commentinfo?.user.username}
                </Trans>
              ),
              autoClose: 3000,
            });
          } else {
            showNotification({
              icon: <UserMinus size={18} />,
              message: (
                <Trans>
                  You are no longer following {commentinfo?.user.username}
                </Trans>
              ),
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
              <Trans>Edit</Trans>
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
                <Trans>Unfollow {commentinfo?.user.username}</Trans>
              </Menu.Item>
            ) : (
              <Menu.Item
                onClick={() => {
                  handleFollow();
                }}
                icon={<UserPlus size={14} />}
              >
                <Trans>Follow {commentinfo?.user.username}</Trans>
              </Menu.Item>
            ))}
          <Menu.Item
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              showNotification({
                icon: <CopySimple size={18} />,
                title: <Trans>Link copied to clipboard</Trans>,
                autoClose: 3000,
                color: "gray",
              });
            }}
            icon={<CopySimple size={14} />}
          >
            <Trans>Copy link to comment</Trans>
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
            <Trans>Share comment via...</Trans>
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
              <Trans>Delete</Trans>
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
          <div className="dpm-header">
            <Trans>Delete reply?</Trans>
          </div>
          <div className="dpm-body">
            <Trans>
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
