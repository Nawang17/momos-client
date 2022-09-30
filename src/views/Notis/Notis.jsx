import { Popover, Text, ActionIcon } from "@mantine/core";
import { Bell } from "phosphor-react";
import { useState } from "react";
export default function Notis() {
  const [opened, setOpened] = useState(false);
  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      width={300}
      position="bottom"
      shadow="md"
    >
      <Popover.Target>
        <ActionIcon onClick={() => setOpened((o) => !o)}>
          <Bell size={28} color="black" />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown>
        <div>
          <Text size={"sm"} weight="bold">
            Notifications
          </Text>
          <div
            style={{
              display: "flex",
              paddingTop: "10px",
              flexDirection: "column",
              gap: "1.1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
            >
              <img
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                }}
                src="https://res.cloudinary.com/dwzjfylgh/image/upload/v1648215217/dd23namcxikmc35qewa2.jpg"
                alt=""
              />
              <Text size="14px">Katoph started following you.</Text>
              <Text color={"dimmed"} size="14px">
                1w
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
            >
              <img
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                }}
                src="https://res.cloudinary.com/dwzjfylgh/image/upload/v1648215217/dd23namcxikmc35qewa2.jpg"
                alt=""
              />
              <Text size="14px">Katoph started following you.</Text>
              <Text color={"dimmed"} size="14px">
                1w
              </Text>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
            >
              <img
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                }}
                src="https://res.cloudinary.com/dwzjfylgh/image/upload/v1648215217/dd23namcxikmc35qewa2.jpg"
                alt=""
              />
              <Text size="14px">Katoph started following you.</Text>
              <Text color={"dimmed"} size="14px">
                1w
              </Text>
            </div>
          </div>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}
