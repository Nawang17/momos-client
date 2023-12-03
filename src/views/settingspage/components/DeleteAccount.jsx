import {
  Button,
  Divider,
  Modal,
  NavLink,
  PasswordInput,
  Text,
} from "@mantine/core";
import { CaretRight, Trash } from "@phosphor-icons/react";
import React from "react";
import { useState } from "react";
import { deleteAccount } from "../../../api/DELETE";
import { showNotification } from "@mantine/notifications";
import { useContext } from "react";
import { AuthContext } from "../../../context/Auth";
import { useNavigate } from "react-router-dom";

const DeleteAccount = ({ socket }) => {
  const navigate = useNavigate();

  const {
    setUserInfo,

    setfollowingdata,
  } = useContext(AuthContext);
  const [opened, setOpened] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = () => {
    setError("");
    setLoading(true);
    deleteAccount(currentPassword)
      .then(() => {
        showNotification({
          icon: <Trash size={18} />,
          title: "Your account has been deleted",
          autoClose: 5000,
          color: "red",
        });
        socket.emit("removeOnlinestatus", {
          token: localStorage.getItem("token"),
        });

        setUserInfo(null);
        setfollowingdata([]);
        localStorage.removeItem("token");
        navigate("/");
        onCloseModal();
      })
      .catch((err) => {
        setError(err?.response?.data);
        setLoading(false);
      });
  };
  const onCloseModal = () => {
    setOpened(false);
    setCurrentPassword("");
    setError("");
    setLoading(false);
  };

  return (
    <>
      <NavLink
        onClick={() => setOpened(true)}
        label="Delete account"
        rightSection={<CaretRight size="0.8rem" stroke={1.5} />}
        color="red"
      />
      <Modal
        closeOnClickOutside={false}
        onClose={() => onCloseModal()}
        title="Delete account"
        zIndex={1000}
        opened={opened}
      >
        <Text align="center" size={14} weight={700} color="red">
          This is a permanent action that cannot be undone. Your account will be
          destroyed and all your data will be lost.
        </Text>

        <Divider my="sm" />
        <Text pb={15} align="center" size={14} weight={700}>
          To delete your account, enter your password and click the Delete
          Account button.
        </Text>
        {error && (
          <Text size={13} weight={500} color="red">
            {error}
          </Text>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <PasswordInput
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.currentTarget.value)}
            label="Current Password"
          />
          <Button
            disabled={currentPassword === ""}
            loading={loading}
            onClick={() => handleDeleteAccount()}
            color="red"
          >
            Delete Account
          </Button>
          <Button onClick={() => onCloseModal()}>Cancel</Button>
        </div>
      </Modal>
    </>
  );
};

export default DeleteAccount;
