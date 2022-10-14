import { Menu } from "@mantine/core";

import { Gear, SignIn, UserCircle } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { showNotification } from "@mantine/notifications";
export function ProfileMenu() {
  const { UserInfo, setUserInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Menu position="bottom-end" shadow="md" width={200}>
      <Menu.Target>
        {!UserInfo ? (
          <UserCircle size={28} color="black" />
        ) : (
          <img
            style={{ width: "27px", height: "27px", borderRadius: "50%" }}
            src={UserInfo?.avatar}
            alt=""
          />
        )}
      </Menu.Target>

      <Menu.Dropdown>
        {UserInfo ? (
          <>
            <Menu.Item icon={<UserCircle size={14} />}>Profile</Menu.Item>
            <Menu.Item icon={<Gear size={14} />}>Settings</Menu.Item>
            <Menu.Divider />
            <Menu.Item
              onClick={() => {
                setUserInfo(null);
                showNotification({
                  title: "You have been logged out",
                  autoClose: 5000,
                });
                localStorage.removeItem("token");
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
          </>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
