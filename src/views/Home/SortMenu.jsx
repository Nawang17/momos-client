import { Menu } from "@mantine/core";
import { CaretDown, FunnelSimple, Heart } from "phosphor-react";

export function SortMenu({ sortvalue, setsortvalue }) {
  return (
    <Menu shadow="md" width={100}>
      <Menu.Target>
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <div style={{ paddingRight: "3px" }}>
            <span style={{ color: "gray" }}>Sort by:</span> {sortvalue}
          </div>
          <CaretDown weight="fill" />
        </div>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          icon={<FunnelSimple size={14} />}
          onClick={() => {
            setsortvalue("Latest");
          }}
        >
          Latest
        </Menu.Item>
        <Menu.Item
          icon={<Heart color="red" size={14} />}
          onClick={() => {
            setsortvalue("Likes");
          }}
        >
          Likes
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
