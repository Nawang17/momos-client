import {
  Button,
  Input,
  Modal,
  NavLink,
  PasswordInput,
  Text,
} from "@mantine/core";
import { CaretRight, Envelope } from "@phosphor-icons/react";
import React, { useState } from "react";
import { updateUserEmail } from "../../../api/UPDATE";
import { showNotification } from "@mantine/notifications";
import { Trans } from "@lingui/macro";

const ChangeEmail = ({ usersettingsInfo, setUsersettingsInfo }) => {
  const [opened, setOpened] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const onmodalclose = () => {
    setError("");
    setEmail("");
    setPassword("");
    setOpened(false);
    setLoading(false);
  };
  const handleupdateEmail = () => {
    setError("");
    setLoading(true);
    updateUserEmail(email, password)
      .then(() => {
        setUsersettingsInfo({ ...usersettingsInfo, email: email });
        onmodalclose();
        showNotification({
          color: "teal",
          icon: <Envelope size={18} />,
          title: <Trans>Email updated</Trans>,
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
        label=<Trans>Change email</Trans>
        rightSection={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Text color="dimmed" size={13}>
              {usersettingsInfo?.email}
            </Text>
            <CaretRight size="0.8rem" stroke={1.5} />
          </div>
        }
      />
      <Modal
        closeOnClickOutside={false}
        onClose={() => onmodalclose()}
        title=<Trans>Change email</Trans>
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
          <Input.Wrapper label=<Trans>New Email Address</Trans>>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@youremail.com"
            />
          </Input.Wrapper>

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label=<Trans>Password</Trans>
          />
          <Text color="dimmed" size={13}>
            <Trans>
              To confirm your new email, enter your current password.
            </Trans>
          </Text>
          <Button
            loading={loading}
            disabled={email === "" || password === ""}
            onClick={() => {
              handleupdateEmail();
            }}
            color="blue"
          >
            <Trans>Save changes</Trans>
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ChangeEmail;
