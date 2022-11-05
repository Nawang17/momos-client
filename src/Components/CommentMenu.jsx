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
    follow({ followingid: postinfo?.user.id })
      .then((res) => {
        if (res.data.followed) {
          setfollowingdata((prev) => [
            ...prev,
            res.data.newFollowing.following.username,
          ]);
          showNotification({
            message: `You are now following ${postinfo?.user.username}`,
            autoClose: 4000,
          });
        } else {
          showNotification({
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
          {UserInfo?.username === postinfo?.user.username && (
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
