import {
  Button,
  Checkbox,
  Modal,
  NavLink,
  PasswordInput,
  Text,
} from "@mantine/core";
import { CaretRight, Lock } from "@phosphor-icons/react";
import React from "react";
import { useState } from "react";
import { updateUserPassword } from "../../../api/UPDATE";
import { showNotification } from "@mantine/notifications";

const ChangePassword = () => {
  const [opened, setOpened] = useState(false);
  const [CurrentPassword, setCurrentPassword] = useState("");
  const [NewPassword, setNewPassword] = useState("");
  const [ConfirmNewPassword, setConfirmNewPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onmodalclose = () => {
    setError("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setOpened(false);
    setLoading(false);
  };
  const handleupdatePassword = () => {
    setError("");
    setLoading(true);
    updateUserPassword(CurrentPassword, NewPassword, ConfirmNewPassword)
      .then(() => {
        onmodalclose();
        showNotification({
          color: "teal",
          icon: <Lock size={18} />,
          title: "Password Updated",
          autoClose: 3000,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.response?.data);
        setLoading(false);
      });
  };
  return (
    <>
      <NavLink
        onClick={() => setOpened(true)}
        label="Change password"
        rightSection={<CaretRight size="0.8rem" stroke={1.5} />}
      />
      <Modal
        closeOnClickOutside={false}
        onClose={() => onmodalclose()}
        title="Change Password"
        zIndex={1000}
        opened={opened}
      >
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
            value={CurrentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            label="Current Password"
          />

          <PasswordInput
            value={NewPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            label="New Password"
          />
          <PasswordInput
            value={ConfirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            label="Confirm New Password"
          />
          <Checkbox
            size="xs"
            color="green"
            checked={
              NewPassword.length >= 6 && NewPassword === ConfirmNewPassword
            }
            label="New Password must be minimum 6 Characters"
            radius="xl"
          />
          <Button
            loading={loading}
            disabled={
              NewPassword.length < 6 ||
              CurrentPassword === "" ||
              ConfirmNewPassword === "" ||
              NewPassword !== ConfirmNewPassword
            }
            onClick={() => handleupdatePassword()}
            color="blue"
          >
            Save changes
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ChangePassword;
