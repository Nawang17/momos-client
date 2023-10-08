import { Popover, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Crown } from "phosphor-react";

const Topuserbadge = () => {
  const [opened, { close, open }] = useDisclosure(false);
  return (
    <Popover width={100} position="right" withArrow shadow="md" opened={opened}>
      <Popover.Target className="heartbeat-icon">
        <Crown
          onMouseEnter={open}
          onMouseLeave={close}
          style={{
            cursor: "pointer",
          }}
          size={16}
          color="#f7ce00"
          weight="fill"
        />
      </Popover.Target>

      <Popover.Dropdown Dropdown sx={{ pointerEvents: "none" }}>
        <Text size="sm">Top User badge</Text>
      </Popover.Dropdown>
    </Popover>
  );
};

export default Topuserbadge;
