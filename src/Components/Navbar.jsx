import { useContext, useEffect, useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Text,
  ActionIcon,
  Alert,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChatCircleDots,
  House,
  MagnifyingGlass,
  MoonStars,
  Sun,
  UsersThree,
} from "@phosphor-icons/react";
import { ProfileMenu } from "./ProfileMenu";
import Notis from "../views/Notis/Notis";
import { AuthContext } from "../context/Auth";
import { useViewportSize } from "@mantine/hooks";

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
  const [noti, setnoti] = useState(null);
  const { height, width } = useViewportSize();
  useEffect(() => {
    socket.on("newnotification", (data) => {
      setnoti(data);

      setTimeout(() => {
        setnoti(null);
      }, 4000);
    });
  }, []);
  return (
    <Header
      style={{
        zIndex: 899,
      }}
      height={60}
      mb={0}
      className={classes.root}
    >
      {noti && (
        <Alert
          onClose={() => {
            setnoti(null);
          }}
          style={{
            cursor: "pointer",
            position: "fixed",
            top: "30px",
            left: "0px",
            right: "0px",
            zIndex: 999,
            width: "350px",
            margin: "auto",
          }}
          withCloseButton
          color={darkmode ? "gray" : "dark"}
          variant="filled"
        >
          <div
            onClick={() => {
              navigate(
                noti?.postId ? `/post/${noti?.postId}` : `/${noti?.username}`
              );
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <img
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
              }}
              src={noti?.avatar}
              alt=""
            />

            <Text size={"15px"}>
              <Text component="span" weight={500}>
                {noti?.username}
              </Text>{" "}
              {noti?.type}
            </Text>
          </div>
        </Alert>
      )}

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
                {width > 500 && (
                  <>
                    {" "}
                    <ActionIcon
                      onClick={() => {
                        if (pathname === "/") {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        } else {
                          navigate("/");
                        }
                      }}
                    >
                      <House
                        weight={pathname === "/" ? "fill" : "regular"}
                        size={28}
                        color={darkmode ? "white" : "black"}
                      />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => {
                        navigate("/discover");
                      }}
                    >
                      <MagnifyingGlass
                        weight={pathname === "/discover" ? "fill" : "regular"}
                        color={darkmode ? "white" : "black"}
                        size={28}
                      />
                    </ActionIcon>
                    <ActionIcon>
                      <ChatCircleDots
                        weight={
                          pathname === "/chatrooms" ||
                          pathname.split("/")[1] === "chat"
                            ? "fill"
                            : "regular"
                        }
                        onClick={() => {
                          navigate("/chatrooms");
                        }}
                        color={darkmode ? "white" : "black"}
                        size={28}
                      />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => {
                        navigate("/communities");
                      }}
                    >
                      <UsersThree
                        weight={
                          pathname === "/communities" ? "fill" : "regular"
                        }
                        color={darkmode ? "white" : "black"}
                        size={28}
                      />
                    </ActionIcon>
                  </>
                )}

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
