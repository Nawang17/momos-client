import {
  Button,
  Input,
  Modal,
  NavLink,
  PasswordInput,
  Text,
} from "@mantine/core";
import { CaretRight } from "@phosphor-icons/react";
import React, { useState } from "react";

const ChangeEmail = () => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      {" "}
      <NavLink
        onClick={() => setOpened(true)}
        label="Change email"
        rightSection={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Text color="dimmed" size={13}>
              gello@gmail.com
            </Text>
            <CaretRight size="0.8rem" stroke={1.5} />
          </div>
        }
      />{" "}
      <Modal
        closeOnClickOutside={false}
        onClose={() => setOpened(false)}
        title="Change email"
        zIndex={1000}
        opened={opened}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Input.Wrapper label="New Email Address">
            <Input placeholder="you@youremail.com" />
          </Input.Wrapper>

          <PasswordInput label="Password" />
          <Text color="dimmed" size={13}>
            To confirm your new email, enter your current password.
          </Text>
          <Button color="blue">Save changes</Button>
        </div>
      </Modal>
    </>
  );
};

export default ChangeEmail;
