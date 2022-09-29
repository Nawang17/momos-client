import { ActionIcon, Menu } from "@mantine/core";

import {
  CopySimple,
  DotsThree,
  Export,
  Gear,
  Lock,
  SignIn,
  Trash,
  UserCircle,
  UserMinus,
  UserPlus,
} from "phosphor-react";
import { useNavigate } from "react-router-dom";

export function ProfileMenu() {
  const navigate = useNavigate();

  return (
    <Menu position="bottom-end" shadow="md" width={200}>
      <Menu.Target>
        {!true ? (
          <UserCircle size={28} color="black" />
        ) : (
          <img
            style={{ width: "27px", height: "27px", borderRadius: "50%" }}
            src="https://res.cloudinary.com/dwzjfylgh/image/upload/v1648215217/dd23namcxikmc35qewa2.jpg"
            alt=""
          />
        )}
      </Menu.Target>

      <Menu.Dropdown>
        {true ? (
          <>
            <Menu.Item icon={<UserCircle size={14} />}>Profile</Menu.Item>
            <Menu.Item icon={<Gear size={14} />}>Settings</Menu.Item>
            <Menu.Divider />
            <Menu.Item>Log Out</Menu.Item>
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
