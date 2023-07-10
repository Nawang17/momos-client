import { Menu, Button, Text, ActionIcon } from "@mantine/core";
import { useContext } from "react";
import { AuthContext } from "../../context/Auth";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { openConfirmModal } from "@mantine/modals";
import {
  DotsThreeOutline,
  SignOut,
  Trash,
  TrashSimple,
  WarningCircle,
} from "phosphor-react";
import { deleteCommunity, leaveCommunity } from "../../api/DELETE";

export const CommunityProfileMenu = ({ profiledata }) => {
  const { UserInfo } = useContext(AuthContext);
  const { name } = useParams();
  const navigate = useNavigate();

  const handleLeaveCommunity = () => {
    openConfirmModal({
      title: "Are you sure you want to leave this community?",
      children: (
        <Text size="sm">
          You will no longer be able to post or comment in this community. You
          can rejoin at any time.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => {
        return;
      },
      onConfirm: () => {
        leaveCommunity(name)
          .then(() => {
            showNotification({
              icon: <SignOut size={18} />,
              color: "blue",
              title: "You have left the community",
              autoClose: 4000,
            });
            navigate(-1);
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
      },
    });
  };
  const handledeleteCommunity = () => {
    openConfirmModal({
      title: "Are you sure you want to delete this community?",
      children: (
        <Text size="sm">
          All posts and members of this community will be deleted forever. This
          action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Yes, delete it", cancel: "No, don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => {
        return;
      },
      onConfirm: () => {
        deleteCommunity(name)
          .then(() => {
            showNotification({
              icon: <Trash size={18} />,
              color: "blue",
              title: "You have deleted the community",
              autoClose: 4000,
            });
            navigate(-1);
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
      },
    });
  };
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon>
          <DotsThreeOutline weight="fill" size={20} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        {profiledata?.communitymembers?.some(
          (obj) => !obj.isOwner && obj.user.username === UserInfo.username
        ) ? (
          <Menu.Item
            icon={<SignOut size={14} />}
            onClick={() => handleLeaveCommunity()}
          >
            Leave Community
          </Menu.Item>
        ) : (
          <Menu.Item
            color="red"
            icon={<TrashSimple size={14} />}
            onClick={() => {
              handledeleteCommunity();
            }}
          >
            Delete Community
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
