import { Menu, Button, Text, ActionIcon } from "@mantine/core";
import { useContext } from "react";
import { AuthContext } from "../../context/Auth";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { openConfirmModal } from "@mantine/modals";
import {
  DotsThreeOutline,
  ShareNetwork,
  SignOut,
  Trash,
  TrashSimple,
  WarningCircle,
} from "@phosphor-icons/react";
import { deleteCommunity, leaveCommunity } from "../../api/DELETE";
import { Trans } from "@lingui/macro";

export const CommunityProfileMenu = ({ profiledata }) => {
  const { UserInfo } = useContext(AuthContext);
  const { name } = useParams();
  const navigate = useNavigate();

  const handleLeaveCommunity = () => {
    openConfirmModal({
      centered: true,
      title: "Are you sure you want to leave this community?",
      children: (
        <Text size="sm">
          <Trans>
            You will no longer be able to post or comment in this community. You
            can rejoin at any time.
          </Trans>
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
              title: <Trans>You have left the community </Trans>,
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
      centered: true,
      title: <Trans>Are you sure you want to delete this community? </Trans>,
      children: (
        <Text size="sm">
          <Trans>
            All posts and members of this community will be deleted forever.
            This action cannot be undone.
          </Trans>
        </Text>
      ),
      labels: {
        confirm: <Trans>Yes, delete it </Trans>,
        cancel: <Trans>No, don't delete it </Trans>,
      },
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
              title: <Trans>You have deleted the community </Trans>,
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
        <Menu.Item
          icon={<ShareNetwork size={14} />}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "Share community",
                url: window.location.href,
              });
            }
          }}
        >
          <Trans>Share</Trans>
        </Menu.Item>
        {profiledata?.communitymembers?.some(
          (obj) => !obj.isOwner && obj.user.username === UserInfo.username
        ) ? (
          <Menu.Item
            icon={<SignOut size={14} />}
            onClick={() => handleLeaveCommunity()}
          >
            <Trans> Leave Community </Trans>
          </Menu.Item>
        ) : (
          <Menu.Item
            color="red"
            icon={<TrashSimple size={14} />}
            onClick={() => {
              handledeleteCommunity();
            }}
          >
            <Trans> Delete Community </Trans>
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};
