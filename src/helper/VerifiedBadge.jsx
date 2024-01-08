import { Popover, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SealCheck } from "@phosphor-icons/react";

const Verifiedbadge = () => {
  const [opened, { close, open }] = useDisclosure(false);
  return (
    <Popover position="right" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <SealCheck
          onMouseEnter={open}
          onMouseLeave={close}
          style={{
            cursor: "pointer",
          }}
          size={15}
          weight="fill"
        />
      </Popover.Target>

      <Popover.Dropdown Dropdown sx={{ pointerEvents: "none" }}>
        <Text size="sm">Verified user badge</Text>
      </Popover.Dropdown>
    </Popover>
  );
};

export default Verifiedbadge;
