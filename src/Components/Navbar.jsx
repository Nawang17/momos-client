import { useContext } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Text,
  ActionIcon,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChatCircleDots,
  House,
  MagnifyingGlass,
  MoonStars,
  Sun,
} from "phosphor-react";
import { ProfileMenu } from "./ProfileMenu";
import Notis from "../views/Notis/Notis";
import { AuthContext } from "../context/Auth";

const useStyles = createStyles((theme) => ({
  root: {
    position: "sticky",
    zIndex: 99,
    "@media (min-width: 700px)": {
      borderBottom: "none",
    },
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

export function Navbar({ socket }) {
  const { UserInfo, setdarkmode, darkmode } = useContext(AuthContext);
  const { classes, cx } = useStyles();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Header
      style={{
        zIndex: 899,
      }}
      height={60}
      mb={0}
      className={classes.root}
    >
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
          <Text color={darkmode ? "white" : "black"} size="xl" weight="700">
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
                  <House size={28} color={darkmode ? "white" : "black"} />
                </ActionIcon>

                <ActionIcon
                  onClick={() => {
                    navigate("/discover");
                  }}
                >
                  <MagnifyingGlass
                    color={darkmode ? "white" : "black"}
                    size={28}
                  />
                </ActionIcon>
                <ActionIcon>
                  <ChatCircleDots
                    onClick={() => {
                      navigate("/chatrooms");
                    }}
                    color={darkmode ? "white" : "black"}
                    size={28}
                  />
                </ActionIcon>
                <Notis darkmode={darkmode} />
              </>
            )}
            {!UserInfo && (
              <ActionIcon
                variant="transparent"
                onClick={() => {
                  setdarkmode(!darkmode);
                  if (darkmode) {
                    document.body.style.backgroundColor = "#f0f2f5";
                  } else {
                    document.body.style.backgroundColor = "#101113";
                  }
                  localStorage.setItem("darkmode", !darkmode);
                }}
              >
                {darkmode ? (
                  <Sun color="#ffd43b" size={28} />
                ) : (
                  <MoonStars color="#228be6" size={28} />
                )}
              </ActionIcon>
            )}

            <ActionIcon>
              <ProfileMenu socket={socket} />
            </ActionIcon>
          </div>
        </Group>
      </Container>
    </Header>
  );
}
