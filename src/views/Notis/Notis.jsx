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
  ArrowsClockwise,
  At,
  Bell,
  BellRinging,
  ChatCircle,
  ChatTeardropDots,
  Heart,
  User,
  UserPlus,
} from "phosphor-react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notis } from "../../api/GET";
export default function Notis({ darkmode }) {
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
  const [opened, setOpened] = useState(false);
  const [Notis, setnotis] = useState([]);
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);
  const [notitype, setnotitype] = useState("All activity");
  useEffect(() => {
    const getnotis = async () => {
      notis()
        .then((res) => {
          setnotis(res?.data?.notis);
          setloading(false);
        })
        .catch((err) => {
          console.log(err);
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
        <ActionIcon variant="transparent" onClick={() => setOpened((o) => !o)}>
          <Bell size={28} color={darkmode ? "white" : "black"} />
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
              Notifications
            </Text>

            <Flex py={5} wrap={"wrap"} align={"center"} gap={"xs"}>
              <Button
                onClick={() => setnotitype("All activity")}
                variant={notitype === "All activity" ? "filled" : "default"}
                color="gray"
                size="xs"
                radius="xl"
              >
                All activity
              </Button>
              <Button
                onClick={() => setnotitype("Likes")}
                variant={notitype === "Likes" ? "filled" : "default"}
                color="gray"
                size="xs"
                radius="xl"
              >
                Likes
              </Button>
              <Button
                onClick={() => setnotitype("Comments")}
                variant={notitype === "Comments" ? "filled" : "default"}
                color="gray"
                size="xs"
                radius="xl"
              >
                Comments
              </Button>
              <Button
                onClick={() => setnotitype("Mentions")}
                variant={notitype === "Mentions" ? "filled" : "default"}
                color="gray"
                size="xs"
                radius="xl"
              >
                Mentions
              </Button>
              <Button
                onClick={() => setnotitype("Followers")}
                variant={notitype === "Followers" ? "filled" : "default"}
                color="gray"
                size="xs"
                radius="xl"
              >
                Followers
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
                  You will see all your notifications here
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
                    Likes on your posts and comments
                  </Text>
                  <Text pt={10} align="center" size={"sm"}>
                    When someone likes your post or comment, you'll see it here
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
                    Comments and replies
                  </Text>
                  <Text pt={10} align="center" size={"sm"}>
                    When someone comments on your post or replies to you, you'll
                    see it here
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
                    Mentions of You
                  </Text>
                  <Text pt={10} align="center" size={"sm"}>
                    When someone mentions you, you'll see it here
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
                    New Followers
                  </Text>
                  <Text pt={10} align="center" size={"sm"}>
                    When someone follows you, you'll see it here
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
                          }}
                        >
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
                          <Text color={"dimmed"} size="13px">
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
