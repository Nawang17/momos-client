import React, { useState } from "react";
import { Button, Input, Modal, Text } from "@mantine/core";
import { forgotPassword } from "../../api/UPDATE";
import { Trans } from "@lingui/macro";

const ForgotPasswordModal = ({ opened, setOpened }) => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const onModalClose = () => {
    setOpened(false);
    setEmailSent(false);
    setEmail("");
    setError("");
    setLoading(false);
  };
  const onResetClick = () => {
    setLoading(true);
    setError("");
    forgotPassword(email)
      .then(() => {
        setEmailSent(true);
      })
      .catch((err) => {
        setError(err.response.data);
        setLoading(false);
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
              <Trans>
                If an account matches
                <Text component="span" pl={5} weight={"bold"}>
                  {email}
                </Text>
                , you should receive an email with instructions on how to reset
                your password shortly.
              </Trans>
            </Text>
            <Text pt={5} italic size={"sm"}>
              <Trans>
                Make sure to also check your spam folder if you don't see the
                email in your inbox.
              </Trans>
            </Text>

            <Button
              onClick={() => {
                onModalClose();
              }}
              mt={"lg"}
            >
              <Trans>OK</Trans>
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
              <Trans>
                Enter your email address, and you will recieve a password reset
                email.
              </Trans>
            </Text>
            <Input
              mt={"md"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@youremail.com"
            />
            <Button
              loading={loading}
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
              <Trans>Reset Password</Trans>
            </Button>
          </>
        )}
      </Modal>
    </>
  );
};

export default ForgotPasswordModal;
