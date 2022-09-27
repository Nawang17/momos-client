import { Menu } from "@mantine/core";

import {
  CopySimple,
  DotsThree,
  Export,
  Trash,
  UserMinus,
  UserPlus,
} from "phosphor-react";
export function PostMenu() {
  return (
    <Menu position="bottom-end" shadow="md" width={200}>
      <Menu.Target>
        <DotsThree size={20} />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item color="red" icon={<Trash color="red" size={14} />}>
          Delete
        </Menu.Item>
        <Menu.Item icon={<UserMinus size={14} />}>Unfollow Katoph</Menu.Item>
        <Menu.Item icon={<UserPlus size={14} />}>Follow Katoph</Menu.Item>
        <Menu.Item icon={<CopySimple size={14} />}>Copy link to Post</Menu.Item>
        <Menu.Item icon={<Export size={14} />}>Share Post via...</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
