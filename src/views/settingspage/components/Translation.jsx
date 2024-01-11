import { Modal, NavLink, Text } from "@mantine/core";
import { CaretRight, Check, Translate } from "@phosphor-icons/react";
import React from "react";
import { useState } from "react";

import { dynamicActivate } from "../../../i18n";
import { showNotification } from "@mantine/notifications";
const lngs = {
  en: { nativeName: "English", flag: "https://flagsapi.com/US/shiny/24.png" },
  ko: { nativeName: "Korean", flag: "https://flagsapi.com/KR/shiny/24.png" },
};

const Translation = () => {
  const [opened, setOpened] = useState(false);
  const [currentLng, setcurrentLng] = useState(
    lngs[localStorage.getItem("language")]?.nativeName || "English"
  );
  return (
    <>
      <NavLink
        onClick={() => setOpened(true)}
        label="Language"
        rightSection={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
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
                showNotification({
                  icon: <Translate size={18} />,
                  title: `Language changed to ${lngs[languageCode].nativeName}`,
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
              icon={<img src={lngs[languageCode]?.flag} alt=""></img>}
              rightSection={
                currentLng === lngs[languageCode].nativeName && (
                  <Check size="1.2em" />
                )
              }
            />
          ))}
        </div>
      </Modal>
    </>
  );
};

export default Translation;
