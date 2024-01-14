import {
  ActionIcon,
  Avatar,
  Button,
  Container,
  CopyButton,
  createStyles,
  Flex,
  Indicator,
  Loader,
  Menu,
  ScrollArea,
  Text,
  Textarea,
} from "@mantine/core";
import {
  ArrowLeft,
  Copy,
  DotsThreeOutline,
  PaperPlaneRight,
  Trash,
  WarningCircle,
} from "@phosphor-icons/react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getchatmessages } from "../../api/GET";
import { sendmessage } from "../../api/POST";
import { Sidebar } from "../../Components/Sidebar";
import { AuthContext } from "../../context/Auth";
import format from "date-fns/format";
import { showNotification } from "@mantine/notifications";
import { deleteChatmessage } from "../../api/DELETE";
import Verifiedbadge from "../../helper/VerifiedBadge";
import Topuserbadge from "../../helper/Topuserbadge";
import { formatText } from "../../helper/FormatText";
import { Trans } from "@lingui/macro";

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

export const Chat = ({ socket }) => {
  const navigate = useNavigate();

  const { classes } = useStyles();
  const { darkmode, UserInfo, onlineusers, topUser } = useContext(AuthContext);
  const [page, setpage] = useState(0);

  const viewport = useRef(null);
  const scrollToBottom = () =>
    viewport.current.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "smooth",
    });
  const [text, setText] = useState("");
  const [loading, setloading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [chatinfo, setChatinfo] = useState();
  const [msgcount, setmsgcount] = useState(0);
  const { roomid } = useParams();
  const mounted = useRef(false);
  const [scrolldown, setscrolldown] = useState(false);
  const [newmsgcount, setnewmsgcount] = useState(0);

  useEffect(() => {
    if (!UserInfo) {
      navigate("/");
    }
  }, [UserInfo]);
  useEffect(() => {
    socket.emit("joinroom", {
      roomid: roomid,
    });

    return () => {
      if (mounted.current) {
        socket.emit("leaveroom", {
          roomid: roomid,
        });
      }
      mounted.current = true;
    };
  }, [roomid]);
  useEffect(() => {
    async function getMessages() {
      await getchatmessages(roomid, 0)
        .then((res) => {
          setMessages(res.data.chatmessages.chats);
          setscrolldown(true);
          setChatinfo(res.data.chatmessages);
          setloading(false);
          setmsgcount(res.data.chatmsgcount);
        })
        .catch(() => {
          navigate("/");
        });
    }
    getMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
    window.scrollTo(0, 0);
    setscrolldown(false);
  }, [scrolldown]);

  useEffect(() => {
    socket.on("newmessage", (message) => {
      setMessages((messages) => [message, ...messages]);
      setscrolldown(true);
      setnewmsgcount((prev) => prev + 1);
    });
  }, []);

  const handlesendmessage = async () => {
    await sendmessage(chatinfo?.id, text)
      .then(() => {
        setText("");
      })
      .catch((err) => {
        if (err.response.status === 0) {
          showNotification({
            icon: <WarningCircle size={18} />,
            color: "red",
            title: "Internal Server Error",
            autoClose: 4000,
          });
        } else {
          showNotification({
            icon: <WarningCircle size={18} />,
            color: "red",
            title: err.response.data,
            autoClose: 4000,
          });
        }
      });
  };
  let map = {};
  const fetchMoreData = async () => {
    setpage(page + 1);
    // Math.round(messages.length / 7)
    await getchatmessages(roomid, page + 1)
      .then((res) => {
        setMessages((prev) => {
          return [...prev, ...res.data.chatmessages.chats];
        });

        setChatinfo(res.data.chatmessages);
        setmsgcount(res.data.chatmsgcount);
      })
      .catch(() => {
        navigate("/");
      });
  };

  return (
    <Container px={0} className={classes.wrapper}>
      <div className={classes.leftWrapper}>
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
            padding: "1rem 0rem 1rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <ActionIcon onClick={() => navigate(-1)}>
            <ArrowLeft size="20px" />
          </ActionIcon>
          <div
            onClick={() =>
              navigate(
                `/${
                  chatinfo?.userone?.username === UserInfo?.username
                    ? chatinfo?.usertwo?.username
                    : chatinfo?.userone?.username
                }`
              )
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
            }}
          >
            {" "}
            {chatinfo && (
              <Indicator
                disabled={
                  !onlineusers.includes(
                    chatinfo?.userone?.username === UserInfo?.username
                      ? chatinfo?.usertwo?.id
                      : chatinfo?.userone?.id
                  )
                }
                style={{
                  cursor: "pointer",
                }}
                withBorder
                inline
                color="green"
                size={9}
                offset={6}
                position="bottom-end"
              >
                <Avatar
                  size="30px"
                  radius={"xl"}
                  src={
                    chatinfo?.userone?.username === UserInfo?.username
                      ? chatinfo?.usertwo?.avatar
                      : chatinfo?.userone?.avatar
                  }
                  alt=""
                  loading="lazy"
                />
              </Indicator>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Flex align={"center"} gap={"4px"}>
                <Text weight={500}>
                  {chatinfo?.userone?.username === UserInfo?.username
                    ? chatinfo?.usertwo?.username
                    : chatinfo?.userone?.username}
                </Text>
                {chatinfo?.userone?.username === UserInfo?.username
                  ? chatinfo?.usertwo?.verified && <Verifiedbadge />
                  : chatinfo?.userone?.verified && <Verifiedbadge />}

                {chatinfo?.userone?.username === UserInfo?.username
                  ? chatinfo?.usertwo?.username === topUser && <Topuserbadge />
                  : chatinfo?.userone?.username === topUser && <Topuserbadge />}
              </Flex>
              {onlineusers.includes(
                chatinfo?.userone?.username === UserInfo?.username
                  ? chatinfo?.usertwo?.id
                  : chatinfo?.userone?.id
              ) && (
                <Text color={"dimmed"} size={10}>
                  <Trans>Active now</Trans>
                </Text>
              )}
            </div>
          </div>
        </div>
        <ScrollArea
          viewportRef={viewport}
          style={{
            height: "50vh",
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            // backgroundColor: "blue",
            color: darkmode ? "white" : "black",
            borderTop: darkmode ? "1px solid #2F3336" : "1px solid #E5E5E5",

            padding: "0.5rem 1.5rem 0rem 1.5rem",
          }}
        >
          {msgcount + newmsgcount > messages.length && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0.5rem 0rem",
              }}
            >
              {" "}
              <Button
                onClick={() => [fetchMoreData()]}
                color={"gray"}
                variant="subtle"
              >
                <Trans>Load older messages</Trans>
              </Button>
            </div>
          )}
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Loader />
            </div>
          ) : (
            messages
              .filter((obj) => !map[obj.id] && (map[obj.id] = true))
              .map((message) => {
                return (
                  <div key={message?.id}>
                    {message?.user?.username !== UserInfo?.username ? (
                      /* left side of chat */ <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          alignItems: "center",
                          marginBottom: "1.5rem",
                          justifyContent: "flex-start",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            <div
                              style={{
                                cursor: "pointer",
                                backgroundColor: darkmode
                                  ? "rgb(47, 51, 54)"
                                  : "rgb(239, 243, 244)",
                                padding: "0.5rem",
                                borderRadius: "8px 8px 8px 0px",
                                wordBreak: "break-word",

                                width: "fit-content",
                              }}
                            >
                              <Text
                                align="left"
                                color={darkmode ? "white" : "#0F1419"}
                                size={14}
                              >
                                {formatText(message?.message, navigate)}
                              </Text>
                            </div>
                            <Menu shadow width={200}>
                              <Menu.Target>
                                <ActionIcon>
                                  <DotsThreeOutline
                                    color={darkmode ? "#909296" : "#868e96"}
                                    size={15}
                                    weight="fill"
                                  />
                                </ActionIcon>
                              </Menu.Target>

                              <Menu.Dropdown>
                                <CopyButton value={message?.message}>
                                  {({ copied, copy }) => (
                                    <Menu.Item
                                      onClick={() => {
                                        copy();

                                        showNotification({
                                          icon: <Copy size={18} />,
                                          title: "Message copied",
                                          autoClose: 3000,
                                          color: "gray",
                                        });
                                      }}
                                      icon={<Copy size={19} weight="fill" />}
                                    >
                                      <Trans>Copy message</Trans>
                                    </Menu.Item>
                                  )}
                                </CopyButton>
                              </Menu.Dropdown>
                            </Menu>
                          </div>

                          <Text pt={5} size={12} color={"dimmed"}>
                            {format(
                              new Date(message?.createdAt),
                              "MMM d yyyy"
                            ) === format(new Date(), "MMM d yyyy")
                              ? format(new Date(message?.createdAt), "h:mm a")
                              : format(
                                  new Date(message?.createdAt),
                                  "MMM d yyyy h:mm a"
                                )}
                          </Text>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          alignItems: "center",
                          marginBottom: "1rem",
                          justifyContent: "flex-end",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            gap: "0.4rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.3rem",
                            }}
                          >
                            <Menu shadow width={200}>
                              <Menu.Target>
                                <ActionIcon>
                                  <DotsThreeOutline
                                    color={darkmode ? "#909296" : "#868e96"}
                                    size={15}
                                    weight="fill"
                                  />
                                </ActionIcon>
                              </Menu.Target>

                              <Menu.Dropdown>
                                <CopyButton value={message?.message}>
                                  {({ copied, copy }) => (
                                    <Menu.Item
                                      onClick={() => {
                                        copy();

                                        showNotification({
                                          icon: <Copy size={18} />,
                                          title: "Message copied",
                                          autoClose: 3000,
                                          color: "gray",
                                        });
                                      }}
                                      icon={<Copy size={19} weight="fill" />}
                                    >
                                      <Trans>Copy message</Trans>
                                    </Menu.Item>
                                  )}
                                </CopyButton>

                                <Menu.Item
                                  onClick={() => {
                                    deleteChatmessage(message.id)
                                      .then(() => {
                                        setMessages(
                                          messages.filter(
                                            (msg) => msg.id !== message.id
                                          )
                                        );
                                        showNotification({
                                          title: <Trans>Message deleted</Trans>,
                                          autoClose: 3000,
                                        });

                                        setmsgcount((prev) => prev - 1);
                                      })
                                      .catch((err) => {
                                        if (err.response.status === 0) {
                                          showNotification({
                                            icon: <WarningCircle size={18} />,
                                            color: "red",
                                            title: "Internal Server Error",
                                            autoClose: 4000,
                                          });
                                        } else {
                                          showNotification({
                                            icon: <WarningCircle size={18} />,
                                            color: "red",
                                            title: err.response.data,
                                            autoClose: 4000,
                                          });
                                        }
                                      });
                                  }}
                                  icon={
                                    <Trash
                                      color="red"
                                      size={19}
                                      weight="duotone"
                                    />
                                  }
                                >
                                  <Trans>Delete message</Trans>
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>

                            <div
                              style={{
                                cursor: "pointer",
                                backgroundColor: "rgb(29, 155, 240)",
                                padding: "0.5rem",
                                borderRadius: "8px 8px 0px 8px",

                                wordBreak: "break-word",

                                width: "fit-content",
                              }}
                            >
                              <Text align="left" color="white" size={14}>
                                {formatText(message?.message, navigate)}
                              </Text>
                            </div>
                          </div>

                          <Text align="right" size={12} color={"dimmed"}>
                            {format(
                              new Date(message?.createdAt),
                              "MMM d yyyy"
                            ) === format(new Date(), "MMM d yyyy")
                              ? format(new Date(message?.createdAt), "h:mm a")
                              : format(
                                  new Date(message?.createdAt),
                                  "MMM d yyyy h:mm a"
                                )}
                          </Text>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
              .reverse()
          )}
        </ScrollArea>

        <div
          style={{
            padding: "1.5rem 1rem 1rem 1rem",
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            borderTop: darkmode ? "1px solid #2F3336" : "1px solid #E5E5E5",
          }}
        >
          <Textarea
            autosize
            minRows={1}
            maxRows={3}
            maxLength={500}
            onKeyDown={(e) => {
              if (text === "") return;
              if (e.key === "Enter") {
                e.preventDefault();

                handlesendmessage();
                e.target.blur();
              }
            }}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            variant="filled"
            placeholder="Send a message"
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "0.8rem",
              paddingTop: "0.8rem",
            }}
          >
            <Text size={12} color={darkmode ? "white" : "black"}>
              {" "}
              {text.length} / 500
            </Text>
            <ActionIcon
              color="dark"
              variant="transparent"
              disabled={text.length === 0}
            >
              <PaperPlaneRight
                onClick={() => {
                  handlesendmessage();
                }}
                type="submit"
                style={{
                  cursor: "pointer",
                }}
                size={20}
              />
            </ActionIcon>
          </div>
        </div>
      </div>

      <Sidebar />
    </Container>
  );
};
