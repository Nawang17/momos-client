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
import { Trans } from "@lingui/macro";

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
          title: <Trans>Password Updated</Trans>,
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
        label=<Trans>Change password</Trans>
        rightSection={<CaretRight size="0.8rem" stroke={1.5} />}
      />
      <Modal
        closeOnClickOutside={false}
        onClose={() => onmodalclose()}
        title=<Trans>Change password</Trans>
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
            label=<Trans>Current Password</Trans>
          />

          <PasswordInput
            value={NewPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            label=<Trans>New Password</Trans>
          />
          <PasswordInput
            value={ConfirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            label=<Trans>Confirm New Password</Trans>
          />
          <Checkbox
            size="xs"
            color="green"
            checked={
              NewPassword.length >= 6 && NewPassword === ConfirmNewPassword
            }
            label=<Trans>New Password must be minimum 6 Character</Trans>
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
            <Trans>Save changes</Trans>
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ChangePassword;
