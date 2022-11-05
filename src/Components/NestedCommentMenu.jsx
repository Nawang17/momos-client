import { Button, Menu, Modal } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

import {
  CopySimple,
  DotsThree,
  Export,
  Trash,
  UserMinus,
  UserPlus,
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
          title: "Your comment was deleted",
          autoClose: 4000,
        });
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
  };
  const handleFollow = () => {
    follow({ followingid: userid })
      .then((res) => {
        if (res.data.followed) {
          setfollowingdata((prev) => [
            ...prev,
            res.data.newFollowing.following.username,
          ]);
          showNotification({
            message: `You are now following ${commentuser}`,
            autoClose: 4000,
          });
        } else {
          showNotification({
            message: `You are no longer following ${commentuser}`,
            autoClose: 4000,
          });

          setfollowingdata((prev) => {
            return prev.filter((item) => item !== commentuser);
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
  };
  return (
    <>
      <Menu position="bottom-end" shadow="md" width={200}>
        <Menu.Target>
          <DotsThree size={20} />
        </Menu.Target>

        <Menu.Dropdown>
          {UserInfo?.username === commentuser && (
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
          <Menu.Item icon={<CopySimple size={14} />}>
            Copy link to Post
          </Menu.Item>
          <Menu.Item icon={<Export size={14} />}>Share Post via...</Menu.Item>
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
          <div className="dpm-header">Delete Comment?</div>
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
