import { Popover, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SketchLogo } from "@phosphor-icons/react";
import React from "react";

const UserRankBadge = ({ usertotalpoints }) => {
  const [opened, { close, open }] = useDisclosure(false);

  const getRankInfo = () => {
    const totalPoints = usertotalpoints ? usertotalpoints : 0;
    if (totalPoints >= 200) {
      return {
        backgroundColor: "#d381e5",
        rankName: "Diamond",
        color: "white",
        icon: (
          <SketchLogo
            onMouseEnter={open}
            onMouseLeave={close}
            style={{
              cursor: "pointer",
            }}
            size={16}
            color="#d381e5"
            weight="fill"
          />
        ),
      };
    } else if (totalPoints >= 150) {
      return {
        backgroundColor: "#3ba7b4",
        rankName: "Platinum",
        color: "white",
        icon: (
          <SketchLogo
            onMouseEnter={open}
            onMouseLeave={close}
            style={{
              cursor: "pointer",
            }}
            size={16}
            color="#3ba7b4"
            weight="fill"
          />
        ),
      };
    } else if (totalPoints >= 100) {
      return {
        backgroundColor: "#ffd700",
        rankName: "Gold",
        color: "black",
        icon: (
          <SketchLogo
            onMouseEnter={open}
            onMouseLeave={close}
            style={{
              cursor: "pointer",
            }}
            size={16}
            color="#ffd700"
            weight="fill"
          />
        ),
      };
    } else if (totalPoints >= 50) {
      return {
        backgroundColor: "#c0c0c0",
        rankName: "Silver",
        color: "black",
        icon: (
          <SketchLogo
            size={16}
            onMouseEnter={open}
            onMouseLeave={close}
            style={{
              cursor: "pointer",
            }}
            color="RGB(192, 192, 192) "
            weight="fill"
          />
        ),
      };
    } else {
      return {
        backgroundColor: "#cd7f32",
        rankName: "Bronze",
        color: "white",
        icon: (
          <SketchLogo
            onMouseEnter={open}
            onMouseLeave={close}
            style={{
              cursor: "pointer",
            }}
            size={16}
            color="RGB(205, 127, 50)"
            weight="fill"
          />
        ),
      };
    }
  };

  return (
    <Popover position="right" withArrow shadow="md" opened={opened}>
      <Popover.Target>{getRankInfo().icon}</Popover.Target>

      <Popover.Dropdown Dropdown sx={{ pointerEvents: "none" }}>
        <Text size="sm">{getRankInfo().rankName} Rank</Text>
      </Popover.Dropdown>
    </Popover>
  );
};

export default UserRankBadge;
