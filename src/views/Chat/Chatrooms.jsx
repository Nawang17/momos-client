import {
  ActionIcon,
  Avatar,
  Button,
  Container,
  createStyles,
  Indicator,
  Input,
  Loader,
  Menu,
  Modal,
  NavLink,
  Text,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import locale from "date-fns/locale/en-US";
import {
  ArrowLeft,
  ChatCircleDots,
  DotsThreeOutline,
  Lock,
  MagnifyingGlass,
  MinusSquare,
  NotePencil,
  UserCircle,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getchat, getchatrooms, searchusers } from "../../api/GET";
import { Sidebar } from "../../Components/Sidebar";
import { AuthContext } from "../../context/Auth";
import { updateChatroomStatus } from "../../api/UPDATE";
const useStyles = createStyles(() => ({
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    paddingBottom: "5rem",
    paddingTop: "0.5rem",
    "@media (max-width: 700px)": {
      paddingTop: "0rem",
    },
  },
  leftWrapper: {
    flex: 0.7,
    "@media (max-width: 700px)": {
      flex: 1,
    },
  },
}));

export const Chatrooms = () => {
  const formatDistanceLocale = {
    lessThanXSeconds: "{{count}}s",
    xSeconds: "{{count}}s",
    halfAMinute: "30s",
    lessThanXMinutes: "{{count}}m",
    xMinutes: "{{count}}m",
    aboutXHours: "{{count}}h",
    xHours: "{{count}}h",
    xDays: "{{count}}d",
    aboutXWeeks: "{{count}}w",
    xWeeks: "{{count}}w",
    aboutXMonths: "{{count}}mo",
    xMonths: "{{count}}mo",
    aboutXYears: "{{count}}y",
    xYears: "{{count}}y",
    overXYears: "{{count}}y",
    almostXYears: "{{count}}y",
  };

  function formatDistance(token, count, options) {
    options = options || {};

    const result = formatDistanceLocale[token].replace("{{count}}", count);

    if (options.addSuffix) {
      if (options.comparison > 0) {
        return "in " + result;
      } else {
        return result + " ago";
      }
    }

    return result;
  }

  const { classes } = useStyles();
  const { darkmode, UserInfo, onlineusers } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [chatrooms, setChatrooms] = useState([]);
  const [filterchat, setFilterchat] = useState("");
  const [opened, setOpened] = useState(false);
  const [searchuser, setSearchuser] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchuser, 500);
  const [searchloading, setsearchLoading] = useState(false);
  const [searchresults, setSearchresults] = useState([]);
  useEffect(() => {
    async function searchuser() {
      setsearchLoading(true);
      await searchusers({ searchvalue: debouncedSearch }).then((res) => {
        if (!res.data) {
          setSearchresults([]);
        }
        setSearchresults(res.data);
      });

      setsearchLoading(false);
    }

    if (debouncedSearch) {
      searchuser();
    }
  }, [debouncedSearch]);
  // useEffect(() => {
  //   if (!UserInfo) {
  //     navigate("/");
  //   }
  // }, [UserInfo]);
  useEffect(() => {
    async function getchatroomsfunc() {
      await getchatrooms()
        .then((res) => {
          setChatrooms(res.data.chatrooms);
          setLoading(false);
        })
        .catch(() => {
          navigate("/");
          setLoading(true);
        });
    }
    getchatroomsfunc();
  }, []);
  return (
    <Container px={0} className={classes.wrapper}>
      <div className={classes.leftWrapper}>
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
            padding: "1rem 1rem 0rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.3rem",
            }}
          >
            <ActionIcon onClick={() => navigate(-1)}>
              <ArrowLeft
                style={{
                  color: darkmode ? "white" : "black",
                }}
                size="20px"
              />
            </ActionIcon>
            <Text
              style={{
                fontSize: "1rem",
                fontWeight: "700",
              }}
            >
              Chats
            </Text>
          </div>
          <ActionIcon onClick={() => setOpened(true)}>
            <NotePencil
              style={{
                color: darkmode ? "white" : "black",
              }}
              size="20px"
            />
          </ActionIcon>
        </div>
        <div
          style={{
            padding: "1rem  ",
            backgroundColor: darkmode ? "#1A1B1E" : "white",
          }}
        >
          {" "}
          <Input
            onChange={(e) => setFilterchat(e.target.value)}
            icon={<MagnifyingGlass size={16} />}
            placeholder="Search for a chat"
          />
        </div>

        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            display: "flex",
            flexDirection: "column",
            paddingBottom: "2rem",
          }}
        >
          {!loading ? (
            chatrooms.length !== 0 ? (
              chatrooms
                .filter((val) => {
                  return val?.userone.username !== UserInfo?.username
                    ? val.userone.username
                        .toLowerCase()
                        .includes(filterchat.toLowerCase())
                    : val.usertwo.username
                        .toLowerCase()
                        .includes(filterchat.toLowerCase());
                })

                .map((rooms) => (
                  <NavLink
                    onClick={() => {
                      navigate(`/chat/${rooms.roomid}`);
                    }}
                    key={rooms.id}
                    style={{
                      padding: "1rem 1rem ",
                    }}
                    label={
                      rooms?.userone?.username !== UserInfo?.username
                        ? rooms?.userone?.username
                        : rooms?.usertwo?.username
                    }
                    description={
                      rooms?.chats[0]?.message
                        ? rooms?.chats[0]?.message.length > 80
                          ? rooms?.chats[0]?.user.username ===
                            UserInfo?.username
                            ? "You: " +
                              rooms?.chats[0]?.message.substring(0, 80) +
                              "..."
                            : rooms?.chats[0]?.message.substring(0, 80) + "..."
                          : rooms?.chats[0]?.user.username ===
                            UserInfo?.username
                          ? "You: " + rooms?.chats[0]?.message
                          : rooms?.chats[0]?.message
                        : "No messages yet"
                    }
                    rightSection={
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "0.5rem",
                        }}
                      >
                        <Menu shadow="md" width={200}>
                          <Menu.Target>
                            <ActionIcon
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <DotsThreeOutline
                                size={18}
                                weight="fill"
                                color="gray"
                              />
                            </ActionIcon>
                          </Menu.Target>

                          <Menu.Dropdown>
                            <Menu.Item
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  `/${
                                    rooms?.userone?.username !==
                                    UserInfo?.username
                                      ? rooms?.userone?.username
                                      : rooms?.usertwo?.username
                                  }`
                                );
                              }}
                              icon={<UserCircle size={18} weight="fill" />}
                            >
                              Profile
                            </Menu.Item>
                            <Menu.Item
                              onClick={(e) => {
                                e.stopPropagation();
                                updateChatroomStatus(rooms?.roomid)
                                  .then((res) => {
                                    showNotification({
                                      title: "Success",
                                      message: "Chat closed successfully",
                                      color: "green",
                                      autoClose: 3000,
                                    });
                                    chatrooms.splice(
                                      chatrooms.indexOf(rooms),
                                      1
                                    );
                                    setChatrooms([...chatrooms]);
                                  })
                                  .catch(() => {
                                    showNotification({
                                      title: "Error",
                                      message: "Something went wrong",
                                      color: "red",
                                      autoClose: 3000,
                                    });
                                  });
                              }}
                              icon={<MinusSquare size={18} weight="fill" />}
                            >
                              Close DM
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                        {/* {rooms?.chats[0]?.createdAt && (
                          <Text size={11} color="dimmed">
                            {formatDistanceToNowStrict(
                              new Date(rooms?.chats[0]?.createdAt),
                              {
                                locale: {
                                  ...locale,
                                  formatDistance,
                                },
                              }
                            )}
                          </Text>
                        )} */}
                      </div>
                    }
                    icon={
                      <Indicator
                        disabled={
                          !onlineusers.includes(
                            rooms.userone.username !== UserInfo?.username
                              ? rooms.userone.id
                              : rooms.usertwo.id
                          )
                        }
                        style={{
                          cursor: "pointer",
                        }}
                        withBorder
                        inline
                        color="green"
                        size={9}
                        offset={7}
                        position="bottom-end"
                      >
                        <Avatar
                          size="40px"
                          radius={"xl"}
                          src={
                            rooms.userone.username !== UserInfo?.username
                              ? rooms.userone.avatar
                              : rooms.usertwo.avatar
                          }
                          alt=""
                          loading="lazy"
                        />
                      </Indicator>
                    }
                  />
                ))
            ) : (
              <div
                style={{
                  backgroundColor: darkmode ? "#1A1B1E" : "white",
                  color: darkmode ? "white" : "black",

                  padding: "1rem",
                }}
              >
                <Text weight={700} size={25}>
                  Welcome to your inbox!
                </Text>
                <Text mt={5} color={"dimmed"}>
                  Chat with other users in private
                </Text>
                <Button
                  mt={20}
                  leftIcon={<ChatCircleDots />}
                  onClick={() => setOpened(true)}
                >
                  Start a new chat
                </Button>
              </div>
            )
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Loader />
            </div>
          )}
        </div>
      </div>

      <Sidebar />
      <>
        <Modal
          zIndex={1000}
          overflow="inside"
          opened={opened}
          onClose={() => {
            setOpened(false);
            setSearchuser("");
            setSearchresults([]);
          }}
          title="Start a new chat"
        >
          <>
            <Input
              onChange={(e) => setSearchuser(e.target.value)}
              icon={<MagnifyingGlass size={16} />}
              placeholder="Search for a user"
            />
            {!searchloading ? (
              searchresults.map((user) => {
                return (
                  <NavLink
                    key={user.id}
                    onClick={async () => {
                      if (!UserInfo) {
                        showNotification({
                          icon: <Lock size={18} />,
                          title: "Login required",
                          autoClose: 3000,
                          color: "red",
                        });
                      } else {
                        await getchat(user?.id).then((res) => {
                          navigate(`/chat/${res.data.chatroomid}`);
                        });
                      }
                    }}
                    style={{
                      marginTop: "1rem",
                      padding: "0.5rem",
                    }}
                    label={user?.username}
                    icon={
                      <img
                        style={{
                          borderRadius: "50%",
                          width: "2.5rem",
                          height: "2.5rem",
                        }}
                        src={user?.avatar}
                        alt=""
                        loading="lazy"
                      />
                    }
                  />
                );
              })
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "1rem",
                  }}
                >
                  <Loader />
                </div>
              </>
            )}
          </>
        </Modal>
      </>
    </Container>
  );
};
