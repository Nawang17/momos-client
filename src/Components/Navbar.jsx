import { useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Text,
  ActionIcon,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  ChatCircleDots,
  House,
  PlusCircle,
  UserCircle,
} from "phosphor-react";
import { ProfileMenu } from "./ProfileMenu";
const useStyles = createStyles((theme) => ({
  root: {
    position: "sticky",
    zIndex: 99,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  //   links: {
  //     [theme.fn.smallerThan("xs")]: {
  //       display: "none",
  //     },
  //   },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

export function Navbar() {
  const links = [
    { label: "Home", link: "/" },
    // { label: "Login", link: "/Login" },
    // { label: "Register", link: "/Register" },
  ];
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();
  const navigate = useNavigate();
  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={cx(classes.link, {
        [classes.linkActive]: active === link.link,
      })}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
        navigate(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <Header height={60} mb={0} className={classes.root}>
      <Container className={classes.header}>
        <Link
          style={{ textDecoration: "none", cursor: "pointer", color: "black" }}
          to="/"
        >
          <Text size="lg" weight="600">
            momos
          </Text>
        </Link>
        <Group spacing={5} className={classes.links}>
          {/* {items} */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {true && (
              <>
                <ActionIcon
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  <House size={28} color="black" />
                </ActionIcon>
                <ActionIcon>
                  <PlusCircle size={28} color="black" />
                </ActionIcon>
                <ActionIcon>
                  <ChatCircleDots size={28} color="black" />
                </ActionIcon>
                <ActionIcon>
                  <Bell size={28} color="black" />
                </ActionIcon>
              </>
            )}

            <ActionIcon>
              <ProfileMenu />
            </ActionIcon>
          </div>
        </Group>
      </Container>
    </Header>
  );
}
