import {
  Popover,
  Text,
  ActionIcon,
  ScrollArea,
  Skeleton,
  Button,
  Flex,
} from "@mantine/core";
import { formatDistanceToNowStrict } from "date-fns";
import locale from "date-fns/locale/en-US";

import {
  At,
  Bell,
  BellRinging,
  ChatTeardropDots,
  GitPullRequest,
  Heart,
  ThumbsUp,
  Trash,
  User,
  WarningCircle,
} from "@phosphor-icons/react";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notis } from "../../api/GET";
import { acceptCommunityrequest } from "../../api/POST";
import { showNotification } from "@mantine/notifications";
import { formatDistance } from "../../helper/DateFormat";
import { Trans } from "@lingui/macro";
import { AuthContext } from "../../context/Auth";
export default function Notis() {
  const { unseennotiCount, setunseennotiCount, darkmode } =
    useContext(AuthContext);
  const [opened, setOpened] = useState(false);
  const [Notis, setnotis] = useState([]);
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);
  const [notitype, setnotitype] = useState("All activity");

  const handlecommunityrequest = (requestid, accept) => {
    acceptCommunityrequest({ requestid, accept })
      .then((res) => {
        showNotification({
          icon: <ThumbsUp size={18} />,
          message: res.data,
          autoClose: 5000,
        });
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
            icon: <Trash size={18} />,
            color: "red",
            title: err.response.data,
            autoClose: 4000,
          });
        }
      });
  };
  useEffect(() => {
    const getnotis = async () => {
      notis()
        .then((res) => {
          setnotis(res?.data?.notis);
          setloading(false);
          setunseennotiCount(0);
        })
        .catch((err) => {
          setloading(true);
        });
    };
    if (opened) {
      getnotis();
    } else {
      setloading(true);
      setnotis([]);
      setnotitype("All activity");
    }
  }, [opened]);
  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      width={300}
      position="bottom"
      shadow="md"
    >
      <Popover.Target>
        <ActionIcon
          style={{
            position: "relative",
          }}
          variant="transparent"
          onClick={() => setOpened((o) => !o)}
        >
          <Bell
            weight={opened ? "fill" : "regular"}
            size={28}
            color={darkmode ? "white" : "black"}
          />
          {unseennotiCount > 0 && (
            <div
              style={{
                background: "#ff4500",
                borderRadius: "12px",
                boxShadow: darkmode ? "0 0 0 2px #25262b" : "0 0 0 2px #fff",
                boxSizing: "border-box",
                color: "#fff",
                fontSize: "10px",
                fontWeight: 700,
                height: "16px",
                left: 15,
                lineHeight: "16px",
                padding: "0 4px",
                position: "absolute",
                textAlign: "center",
                top: -4,
                verticalAlign: "middle",
                minWidth: "16px",
                width: "auto",
                zIndex: 1,
              }}
            >
              {unseennotiCount}
            </div>
          )}
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown>
        <ScrollArea
          style={{
            height: 400,

            color: darkmode ? "white" : "black",
          }}
        >
          <div>
            <Text size={"xl"} weight="bold">
              <Trans>Notifications</Trans>
            </Text>
            <Flex py={5} wrap={"wrap"} align={"center"} gap={"xs"}>
              <Button
                onClick={() => setnotitype("All activity")}
                variant={notitype === "All activity" ? "filled" : "default"}
                color="gray"
                size="xs"
                radius="xl"
              >
                <Trans> All activity</Trans>
              </Button>
              <Button
                onClick={() => setnotitype("Likes")}
                variant={notitype === "Likes" ? "filled" : "default"}
                color="gray"
                size="xs"
                radius="xl"
              >
                <Trans>Likes</Trans>
              </Button>
              <Button
                onClick={() => setnotitype("Comments")}
                variant={notitype === "Comments" ? "filled" : "default"}
                color="gray"
                size="xs"
                radius="xl"
              >
                <Trans>Comments</Trans>
              </Button>
              <Button
                onClick={() => setnotitype("Mentions")}
                variant={notitype === "Mentions" ? "filled" : "default"}
                color="gray"
                size="xs"
                radius="xl"
              >
                <Trans>Mentions</Trans>
              </Button>
              <Button
                onClick={() => setnotitype("Followers")}
                variant={notitype === "Followers" ? "filled" : "default"}
                color="gray"
                size="xs"
                radius="xl"
              >
                <Trans>Followers</Trans>
              </Button>
              <Button
                onClick={() => setnotitype("COMMUNITY_JOIN_REQUEST")}
                variant={
                  notitype === "COMMUNITY_JOIN_REQUEST" ? "filled" : "default"
                }
                color="gray"
                size="xs"
                radius="xl"
              >
                <Trans>Requests</Trans>
              </Button>
            </Flex>
            {!loading && notitype === "All activity" && Notis.length === 0 && (
              <Flex
                direction={"column"}
                align={"center"}
                justify={"center"}
                pt={40}
              >
                <BellRinging size={50} color={darkmode ? "white" : "black"} />

                <Text pt={10} align="center" size={"sm"}>
                  <Trans>You will see all your notifications here</Trans>
                </Text>
              </Flex>
            )}
            {!loading &&
              notitype === "Likes" &&
              Notis.filter((val) => {
                return val.type === "LIKE";
              }).length === 0 && (
                <Flex
                  direction={"column"}
                  align={"center"}
                  justify={"center"}
                  pt={40}
                >
                  <Heart size={50} color={darkmode ? "white" : "black"} />
                  <Text weight={700} size={"sm"}>
                    <Trans>Likes on your posts and comments</Trans>
                  </Text>
                  <Text pt={10} align="center" size={"sm"}>
                    <Trans>
                      {" "}
                      When someone likes your post or comment, you'll see it
                      here
                    </Trans>{" "}
                  </Text>
                </Flex>
              )}
            {!loading &&
              notitype === "Comments" &&
              Notis.filter((val) => {
                return val.type === "COMMENT" || val.type === "REPLY";
              }).length === 0 && (
                <Flex
                  direction={"column"}
                  align={"center"}
                  justify={"center"}
                  pt={40}
                >
                  <ChatTeardropDots
                    size={50}
                    color={darkmode ? "white" : "black"}
                  />
                  <Text weight={700} size={"sm"}>
                    <Trans> Comments and replies</Trans>
                  </Text>
                  <Text pt={10} align="center" size={"sm"}>
                    <Trans>
                      {" "}
                      When someone comments on your post or replies to you,
                      you'll see it here
                    </Trans>
                  </Text>
                </Flex>
              )}
            {!loading &&
              notitype === "Mentions" &&
              Notis.filter((val) => {
                return val.type === "MENTION" || val.type === "QUOTE";
              }).length === 0 && (
                <Flex
                  direction={"column"}
                  align={"center"}
                  justify={"center"}
                  pt={40}
                >
                  <At size={50} color={darkmode ? "white" : "black"} />
                  <Text weight={700} size={"sm"}>
                    <Trans> Mentions of You</Trans>
                  </Text>
                  <Text pt={10} align="center" size={"sm"}>
                    <Trans>
                      {" "}
                      When someone mentions you, you'll see it here
                    </Trans>
                  </Text>
                </Flex>
              )}
            {!loading &&
              notitype === "COMMUNITY_JOIN_REQUEST" &&
              Notis.filter((val) => {
                return val.type === "COMMUNITY_JOIN_REQUEST";
              }).length === 0 && (
                <Flex
                  direction={"column"}
                  align={"center"}
                  justify={"center"}
                  pt={40}
                >
                  <GitPullRequest
                    size={50}
                    color={darkmode ? "white" : "black"}
                  />
                  <Text weight={700} size={"sm"}>
                    <Trans> Community Join Requests</Trans>
                  </Text>
                  <Text pt={10} align="center" size={"sm"}>
                    <Trans>
                      {" "}
                      When someone requests to join your community, you'll see
                      it here
                    </Trans>
                  </Text>
                </Flex>
              )}
            {!loading &&
              notitype === "Followers" &&
              Notis.filter((val) => {
                return val.type === "FOLLOW";
              }).length === 0 && (
                <Flex
                  direction={"column"}
                  align={"center"}
                  justify={"center"}
                  pt={40}
                >
                  <User size={50} color={darkmode ? "white" : "black"} />
                  <Text weight={700} size={"sm"}>
                    <Trans> New Followers</Trans>
                  </Text>
                  <Text pt={10} align="center" size={"sm"}>
                    <Trans> When someone follows you, you'll see it here</Trans>
                  </Text>
                </Flex>
              )}
            {!loading ? (
              <>
                {Notis.filter((val) => {
                  if (notitype === "All activity") {
                    return val;
                  } else if (notitype === "Likes") {
                    return val.type === "LIKE";
                  } else if (notitype === "Comments") {
                    return val.type === "COMMENT" || val.type === "REPLY";
                  } else if (notitype === "Mentions") {
                    return val.type === "MENTION" || val.type === "QUOTE";
                  } else if (notitype === "Followers") {
                    return val.type === "FOLLOW";
                  } else if (notitype === "COMMUNITY_JOIN_REQUEST") {
                    return val.type === "COMMUNITY_JOIN_REQUEST";
                  } else {
                    return val;
                  }
                }).map((data) => {
                  return (
                    <div
                      onClick={() => {
                        setOpened(false);
                        if (data.type === "FOLLOW") {
                          navigate(`/${data.user.username}`);
                        } else if (data.type === "COMMUNITY_JOIN_REQUEST") {
                        } else {
                          navigate(`/post/${data.postId}`);
                        }
                      }}
                      key={data.id}
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
                        <div
                          style={{
                            width: "45px",
                          }}
                        >
                          <div
                            style={{
                              position: "relative",
                            }}
                          >
                            <img
                              style={{
                                width: "35px",
                                height: "35px",
                                borderRadius: "50%",
                              }}
                              src={data?.user?.avatar}
                              alt=""
                            />
                            {/* {notitype === "All activity" && (
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: 1,
                                  right: 8,
                                }}
                              >
                                {data.type === "LIKE" && (
                                  <ActionIcon
                                    color="red"
                                    radius="lg"
                                    variant="filled"
                                    size={"xs"}
                                    style={{
                                      border: darkmode
                                        ? "2px solid #25262b"
                                        : "2px solid #fff",
                                    }}
                                  >
                                    <Heart weight="fill" size={12} />
                                  </ActionIcon>
                                )}
                                {data.type === "FOLLOW" && (
                                  <ActionIcon
                                    color="blue"
                                    radius="lg"
                                    variant="filled"
                                    size={"xs"}
                                    style={{
                                      border: darkmode
                                        ? "2px solid #25262b"
                                        : "2px solid #fff",
                                    }}
                                  >
                                    <UserPlus weight="bold" size={12} />
                                  </ActionIcon>
                                )}
                                {(data.type === "COMMENT" ||
                                  data.type === "REPLY") && (
                                  <ActionIcon
                                    color="teal"
                                    radius="lg"
                                    variant="filled"
                                    size={"xs"}
                                    style={{
                                      border: darkmode
                                        ? "2px solid #25262b"
                                        : "2px solid #fff",
                                    }}
                                  >
                                    <ChatCircle weight="bold" size={12} />
                                  </ActionIcon>
                                )}
                                {data.type === "QUOTE" && (
                                  <ActionIcon
                                    color="yellow"
                                    radius="lg"
                                    variant="filled"
                                    size={"xs"}
                                    style={{
                                      border: darkmode
                                        ? "2px solid #25262b"
                                        : "2px solid #fff",
                                    }}
                                  >
                                    <ArrowsClockwise weight="bold" size={12} />
                                  </ActionIcon>
                                )}
                                {data.type === "MENTION" && (
                                  <ActionIcon
                                    color="indigo"
                                    radius="lg"
                                    variant="filled"
                                    size={"xs"}
                                    style={{
                                      border: darkmode
                                        ? "2px solid #25262b"
                                        : "2px solid #fff",
                                    }}
                                  >
                                    <At weight="bold" size={12} />
                                  </ActionIcon>
                                )}
                              </div>
                            )} */}
                          </div>
                        </div>
                        <div
                          style={{
                            width: "200px",
                            wordBreak: "break-word",
                            color: !data.seen && "#1DA1F2",
                          }}
                        >
                          {data.type === "COMMUNITY_JOIN_REQUEST" && (
                            <>
                              <Text size="14px">
                                <span style={{ fontWeight: "500" }}>
                                  {data.user?.username}
                                  {` `}
                                </span>
                                {data?.text}
                              </Text>
                              <Flex pt={5} gap={"0.5rem"} align={"center"}>
                                <Button
                                  onClick={() => {
                                    handlecommunityrequest(data.id, true);
                                  }}
                                  compact
                                  size="xs"
                                >
                                  <Trans>Accept</Trans>
                                </Button>
                                <Button
                                  onClick={() => {
                                    handlecommunityrequest(data.id, false);
                                  }}
                                  color="red"
                                  compact
                                  size="xs"
                                >
                                  <Trans>Decline</Trans>
                                </Button>
                              </Flex>
                            </>
                          )}
                          {data.type === "MENTION" && (
                            <Text size="14px">
                              <span style={{ fontWeight: "500" }}>
                                {data.user?.username}{" "}
                              </span>
                              mentioned you: {data?.text}
                            </Text>
                          )}
                          {data.type === "QUOTE" && (
                            <Text size="14px">
                              <span style={{ fontWeight: "500" }}>
                                {" "}
                                {`
              ${data.user?.username} 
`}
                              </span>
                              {`
             reposted your post 
`}
                            </Text>
                          )}
                          {data.type === "COMMENT" && (
                            <Text size="14px">
                              <span style={{ fontWeight: "500" }}>
                                {" "}
                                {`
              ${data.user.username} 
`}
                              </span>
                              {`
             commented: ${data.text} 
`}
                            </Text>
                          )}
                          {data.type === "FOLLOW" && (
                            <Text size="14px">
                              <span style={{ fontWeight: "500" }}>
                                {" "}
                                {`
              ${data.user.username} 
`}
                              </span>
                              {`
              started following you.
`}
                            </Text>
                          )}
                          {data.type === "REPLY" && (
                            <Text size="14px">
                              <span style={{ fontWeight: "500" }}>
                                {" "}
                                {`
              ${data.user.username} 
`}
                              </span>
                              {`
             replied: ${data.text} 
`}
                            </Text>
                          )}
                          {data.type === "LIKE" && (
                            <Text size="14px">
                              <span style={{ fontWeight: "500" }}>
                                {" "}
                                {`
              ${data.user.username} 
`}
                              </span>
                              {`
            ${data.text} 
`}
                            </Text>
                          )}
                        </div>

                        <div>
                          <Text
                            color={data.seen ? "dimmed" : "#1DA1F2"}
                            size="13px"
                          >
                            {formatDistanceToNowStrict(
                              new Date(data.createdAt),
                              {
                                locale: {
                                  ...locale,
                                  formatDistance,
                                },
                              }
                            )}
                          </Text>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div
                style={{
                  paddingTop: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {new Array(5).fill(0).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",

                      gap: "0.5rem",
                    }}
                  >
                    <Skeleton height={40} circle />
                    <Skeleton height={8} radius="xl" width="200px" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </Popover.Dropdown>
    </Popover>
  );
}
