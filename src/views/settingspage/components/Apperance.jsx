import { Modal, NavLink, Text } from "@mantine/core";
import { CaretRight, Check, MoonStars, Sun } from "@phosphor-icons/react";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { AuthContext } from "../../../context/Auth";
import { Trans } from "@lingui/macro";

const Apperance = () => {
  const [opened, setOpened] = useState(false);
  const { darkmode, setdarkmode } = useContext(AuthContext);
  return (
    <>
      <NavLink
        onClick={() => setOpened(true)}
        label=<Trans>Display theme</Trans>
        rightSection={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Text color="dimmed" size={13}>
              {darkmode ? <Trans>Dark Mode</Trans> : <Trans>Light Mode</Trans>}
            </Text>
            <CaretRight size="0.8rem" stroke={1.5} />
          </div>
        }
      />

      <Modal
        onClose={() => setOpened(false)}
        title="Display Theme"
        zIndex={1000}
        opened={opened}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <NavLink
            onClick={() => {
              setdarkmode(!darkmode);
              if (darkmode) {
                document.body.style.backgroundColor = "#f0f2f5";
              } else {
                document.body.style.backgroundColor = "#101113";
              }
              localStorage.setItem("darkmode", !darkmode);
            }}
            label=<Trans>Light Mode</Trans>
            icon={<Sun color="gold" size="1.5rem" weight="fill" />}
            rightSection={!darkmode && <Check size="1.2rem" />}
          />
          <NavLink
            onClick={() => {
              setdarkmode(!darkmode);
              if (darkmode) {
                document.body.style.backgroundColor = "#f0f2f5";
              } else {
                document.body.style.backgroundColor = "#101113";
              }
              localStorage.setItem("darkmode", !darkmode);
            }}
            label=<Trans>Dark Mode</Trans>
            icon={<MoonStars color="skyblue" size="1.5rem" weight="fill" />}
            rightSection={darkmode && <Check size="1.2em" />}
          />
        </div>
      </Modal>
    </>
  );
};

export default Apperance;
