import React, { useState } from "react";
import { Button, Input, Modal, Text } from "@mantine/core";
import { forgotPassword } from "../../api/UPDATE";

const ForgotPasswordModal = ({ opened, setOpened }) => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const onModalClose = () => {
    setOpened(false);
    setEmailSent(false);
    setEmail("");
    setError("");
  };
  const onResetClick = () => {
    setError("");
    forgotPassword(email)
      .then(() => {
        setEmailSent(true);
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };
  return (
    <>
      <Modal
        closeOnClickOutside={false}
        zIndex={1000}
        size={"lg"}
        opened={opened}
        onClose={() => onModalClose()}
        title="Password Reset"
      >
        {emailSent ? (
          <>
            <Text size={"sm"}>
              If an account matches{" "}
              <Text component="span" weight={"bold"}>
                {email}
              </Text>
              , you should receive an email with instructions on how to reset
              your password shortly.
            </Text>
            <Text pt={5} italic size={"sm"}>
              Make sure to also check your spam folder if you don't see the
              email in your inbox.
            </Text>

            <Button
              onClick={() => {
                onModalClose();
              }}
              mt={"lg"}
            >
              OK
            </Button>
          </>
        ) : (
          <>
            {error && (
              <Text color="red" size={"sm"}>
                {error}
              </Text>
            )}

            <Text size={"sm"}>
              Enter your email address, and you will recieve a password reset
              email.
            </Text>
            <Input
              mt={"md"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@youremail.com"
            />
            <Button
              onClick={() => {
                onResetClick();
              }}
              disabled={
                email.length < 1 ||
                email.indexOf("@") < 1 ||
                email.indexOf(".") < 1
              }
              mt={"lg"}
            >
              Reset Password
            </Button>
          </>
        )}
      </Modal>
    </>
  );
};

export default ForgotPasswordModal;
