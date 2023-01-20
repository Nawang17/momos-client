import { Button, Menu, Modal } from "@mantine/core";
import { showNotification } from "@mantine/notifications";

import {
  CopySimple,
  DotsThree,
  Export,
  Lock,
  Quotes,
  Trash,
  UserMinus,
  UserPlus,
  WarningCircle,
} from "phosphor-react";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { deletePost } from "../api/DELETE";
import { follow } from "../api/POST";
import { AuthContext } from "../context/Auth";
import CreatePostModal from "./CreatePostModal";
export function PostMenu({ postinfo, setPosts }) {
  const { UserInfo, followingdata, setfollowingdata, setUserlevelinfo } =
    useContext(AuthContext);
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [openConfirm, setOpenConfirm] = useState(false);
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
        } else {
          setUserlevelinfo((prev) => {
            return { ...prev, totalposts: prev.totalposts - 1 };
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
      <CreatePostModal
        opened={openConfirm}
        setOpened={setOpenConfirm}
        setHomePosts={setPosts}
        UserInfo={UserInfo}
        quotepostinfo={postinfo ? postinfo : null}
      />

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
            icon={<Quotes size={14} />}
          >
            Quote Post
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              navigator.clipboard.writeText(
                `https://momosz.com/post/${postinfo?.id}`
              );
              showNotification({
                icon: <CopySimple size={18} />,
                title: "Link copied to clipboard",
                autoClose: 3000,
                color: "gray",
              });
            }}
            icon={<CopySimple size={14} />}
          >
            Copy link to Post
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
            Share Post via...
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
          <div className="dpm-header">Delete Post?</div>
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
