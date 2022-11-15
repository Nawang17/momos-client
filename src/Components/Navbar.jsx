import { useContext } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Text,
  ActionIcon,
} from "@mantine/core";
import { useLocation, useNavigate, s } from "react-router-dom";
import { ChatCircleDots, House } from "phosphor-react";
import { ProfileMenu } from "./ProfileMenu";
import Notis from "../views/Notis/Notis";
import { AuthContext } from "../context/Auth";

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
  const { UserInfo } = useContext(AuthContext);
  const { classes, cx } = useStyles();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Header height={60} mb={0} className={classes.root}>
      <Container className={classes.header}>
        <div
          style={{ textDecoration: "none", cursor: "pointer", color: "black" }}
          onClick={() => {
            if (pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              navigate("/");
            }
          }}
        >
          <Text size="xl" weight="700">
            momos
          </Text>
        </div>
        <Group spacing={5} className={classes.links}>
          {/* {items} */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {UserInfo && (
              <>
                <ActionIcon
                  onClick={() => {
                    if (pathname === "/") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    } else {
                      navigate("/");
                    }
                  }}
                >
                  <House size={28} color="black" />
                </ActionIcon>

                {/* <ActionIcon>
                  <ChatCircleDots size={28} color="black" />
                </ActionIcon>  */}
                <Notis />
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
