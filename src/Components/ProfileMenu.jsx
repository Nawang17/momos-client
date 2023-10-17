import { Avatar, Menu } from "@mantine/core";

import {
  BookmarkSimple,
  Crosshair,
  Info,
  MoonStars,
  SignIn,
  SignOut,
  Sun,
  UserCircle,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { showNotification } from "@mantine/notifications";
export function ProfileMenu({ socket }) {
  const {
    UserInfo,
    setUserInfo,

    setfollowingdata,
    darkmode,
    setdarkmode,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const handlelogout = () => {
    socket.emit("removeOnlinestatus", { token: localStorage.getItem("token") });
    setUserInfo(null);

    localStorage.removeItem("token");

    setfollowingdata([]);
    showNotification({
      icon: <SignOut size={18} />,
      title: "Logged out",
      autoClose: 3000,
      color: "gray",
    });
  };
  return (
    <Menu position="bottom-end" shadow="md" width={200}>
      <Menu.Target>
        {!UserInfo ? (
          <UserCircle size={28} color={darkmode ? "white" : "black"} />
        ) : (
          <Avatar
            size="28px"
            radius={"xl"}
            src={UserInfo?.avatar}
            alt=""
            loading="lazy"
          />
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
              View profile
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
              icon={
                darkmode ? (
                  <Sun color="#ffd43b" size={20} />
                ) : (
                  <MoonStars color="#228be6" size={20} />
                )
              }
            >
              {darkmode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              onClick={() => {
                navigate("/bookmarks");
              }}
              icon={<BookmarkSimple size={20} />}
            >
              Bookmarks
            </Menu.Item>
            <Menu.Divider />
            {UserInfo?.username === "katoph" && (
              <>
                <Menu.Item
                  onClick={() => {
                    navigate("/admin");
                  }}
                  icon={<Crosshair size={20} />}
                >
                  Admin
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
              About momos
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              icon={<SignOut size={20} />}
              onClick={() => {
                handlelogout();
              }}
            >
              Log Out
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
              Login
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                navigate("/Register");
              }}
              icon={<UserCircle size={14} />}
            >
              {" "}
              Register
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                navigate("/about");
              }}
              icon={<Info size={14} />}
            >
              {" "}
              About momos
            </Menu.Item>
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
