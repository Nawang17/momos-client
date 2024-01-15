import { Modal, NavLink, Radio, Text } from "@mantine/core";
import { CaretRight, Check, Globe } from "@phosphor-icons/react";
import React, { useContext } from "react";
import { useState } from "react";

import { dynamicActivate } from "../../../i18n";
import { showNotification } from "@mantine/notifications";
import { Trans } from "@lingui/macro";
import { AuthContext } from "../../../context/Auth";
import { lngs } from "../../../i18n";
const Translation = () => {
  const { currentLng, setcurrentLng } = useContext(AuthContext);

  const [opened, setOpened] = useState(false);

  return (
    <>
      <NavLink
        onClick={() => setOpened(true)}
        label=<Trans>Language</Trans>
        rightSection={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <img
              src={lngs[localStorage.getItem("language")]?.flag}
              alt=""
              loading="lazy"
            />

            <Text color="dimmed" size={13}>
              {currentLng}
              {currentLng === "Korean" && " (Beta)"}
            </Text>
            <CaretRight size="0.8rem" stroke={1.5} />
          </div>
        }
      />

      <Modal
        onClose={() => setOpened(false)}
        title="Language selection"
        zIndex={1000}
        opened={opened}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {Object.keys(lngs).map((languageCode) => (
            <NavLink
              key={languageCode}
              onClick={() => {
                if (currentLng === lngs[languageCode].nativeName) {
                  setOpened(false);
                  return;
                }
                showNotification({
                  icon: <Globe size={18} />,
                  title: (
                    <Trans>
                      Language changed to {lngs[languageCode].nativeName}
                    </Trans>
                  ),
                  color: "blue",
                });
                localStorage.setItem("language", languageCode);
                dynamicActivate(languageCode);
                setcurrentLng(lngs[languageCode].nativeName);
                setOpened(false);
              }}
              label={
                <>
                  {lngs[languageCode].nativeName}
                  {languageCode === "ko" && " (Beta)"}
                </>
              }
              icon={
                <img src={lngs[languageCode]?.flag} alt="" loading="lazy" />
              }
              rightSection={
                <Radio
                  checked={
                    currentLng === lngs[languageCode].nativeName && (
                      <Check size="1.2em" />
                    )
                  }
                />
              }
            />
          ))}
        </div>
      </Modal>
    </>
  );
};

export default Translation;
