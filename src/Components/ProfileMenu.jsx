import { Avatar, Indicator, Menu, Modal, NavLink, Radio } from "@mantine/core";

import {
  BookmarkSimple,
  CaretDown,
  Check,
  Crosshair,
  Gear,
  Globe,
  Info,
  MoonStars,
  SignIn,
  SignOut,
  Sun,
  UserCircle,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/Auth";
import { showNotification } from "@mantine/notifications";
import { Trans } from "@lingui/macro";
import { dynamicActivate } from "../i18n";
import { lngs } from "../i18n";
export function ProfileMenu({ socket }) {
  const {
    UserInfo,
    setUserInfo,
    setfollowingdata,
    darkmode,
    setdarkmode,
    currentLng,
    setcurrentLng,
    onlinelist,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);

  const handlelogout = () => {
    socket.emit("removeOnlinestatus", { token: localStorage.getItem("token") });
    setUserInfo(null);

    localStorage.removeItem("token");

    setfollowingdata([]);
    showNotification({
      icon: <SignOut size={18} />,
      title: <Trans>Logged out</Trans>,
      autoClose: 3000,
      color: "gray",
    });
  };
  return (
    <>
      <Menu position="bottom-end" shadow="md" width={200}>
        <Menu.Target>
          {!UserInfo ? (
            <UserCircle size={28} color={darkmode ? "white" : "black"} />
          ) : (
            <Indicator
              disabled={!onlinelist?.includes(UserInfo?.username)}
              withBorder
              inline
              color="green"
              size={9}
              offset={5}
              position="bottom-end"
            >
              <Avatar
                size="28px"
                radius={"xl"}
                src={UserInfo?.avatar}
                alt=""
                loading="lazy"
              />
            </Indicator>
          )}
        </Menu.Target>

        <Menu.Dropdown>
          {UserInfo ? (
            <>
              <Menu.Item
                onClick={() => {
                  navigate(`/${UserInfo?.username}`);
                }}
                icon={
                  <UserCircle color={darkmode ? "white" : "black"} size={20} />
                }
              >
                <Trans>View profile</Trans>
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  navigate("/bookmarks");
                }}
                icon={<BookmarkSimple size={20} />}
              >
                <Trans>Bookmarks</Trans>
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  navigate("/settings");
                }}
                icon={<Gear size={20} />}
              >
                <Trans>Settings</Trans>
              </Menu.Item>

              <Menu.Divider />
              <Menu.Item
                onClick={() => {
                  setdarkmode(!darkmode);
                  if (darkmode) {
                    document.body.style.backgroundColor = "#f0f2f5";
                  } else {
                    document.body.style.backgroundColor = "#101113";
                  }
                  localStorage.setItem("darkmode", !darkmode);
                }}
                icon={darkmode ? <Sun size={20} /> : <MoonStars size={20} />}
              >
                {darkmode ? (
                  <Trans>Light Mode</Trans>
                ) : (
                  <Trans>Dark Mode</Trans>
                )}
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  setOpened(true);
                }}
                icon={<Globe size={20} />}
                rightSection={<CaretDown size={20} />}
              >
                {currentLng}
              </Menu.Item>

              {UserInfo?.username === "katoph" && (
                <>
                  <Menu.Item
                    onClick={() => {
                      navigate("/admin");
                    }}
                    icon={<Crosshair size={20} />}
                  >
                    <Trans>Admin</Trans>
                  </Menu.Item>
                  <Menu.Divider />
                </>
              )}

              <Menu.Item
                onClick={() => {
                  navigate("/about");
                }}
                icon={<Info size={20} />}
              >
                {" "}
                <Trans>About momos</Trans>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                icon={<SignOut size={20} />}
                onClick={() => {
                  handlelogout();
                }}
              >
                <Trans>Log Out</Trans>
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item
                onClick={() => {
                  navigate("/Login");
                }}
                icon={<SignIn size={14} />}
              >
                {" "}
                <Trans>Login</Trans>
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  navigate("/Register");
                }}
                icon={<UserCircle size={14} />}
              >
                {" "}
                <Trans>Register</Trans>
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  navigate("/about");
                }}
                icon={<Info size={14} />}
              >
                {" "}
                <Trans>About momos</Trans>
              </Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>
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
}
