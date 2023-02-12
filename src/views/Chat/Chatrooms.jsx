import {
  ActionIcon,
  Container,
  createStyles,
  Input,
  Loader,
  NavLink,
  Text,
} from "@mantine/core";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import locale from "date-fns/locale/en-US";
import { ArrowLeft, MagnifyingGlass, NotePencil } from "phosphor-react";
import { useEffect, useState } from "react";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getchatrooms } from "../../api/GET";
import { Sidebar } from "../../Components/Sidebar";
import { AuthContext } from "../../context/Auth";
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
  const { darkmode, UserInfo } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [chatrooms, setChatrooms] = useState([]);
  const [filterchat, setFilterchat] = useState("");
  useEffect(() => {
    if (!UserInfo) {
      navigate("/");
    }
  }, [UserInfo]);
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
          {/* <ActionIcon>
            <NotePencil
              style={{
                color: darkmode ? "white" : "black",
              }}
              size="20px"
            />
          </ActionIcon> */}
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

              .sort((a, b) => {
                return (
                  new Date(b?.chats[0]?.createdAt) -
                  new Date(a?.chats[0]?.createdAt)
                );
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
                    rooms.userone.username !== UserInfo?.username
                      ? rooms.userone.username
                      : rooms.usertwo.username
                  }
                  description={
                    rooms?.chats[0]?.message
                      ? rooms?.chats[0]?.message.length > 80
                        ? rooms?.chats[0]?.message.substring(0, 80) + "..."
                        : rooms?.chats[0]?.message
                      : "no message yet, say hi!"
                  }
                  rightSection={
                    rooms?.chats[0]?.createdAt && (
                      <Text size={14} color="dimmed">
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
                    )
                  }
                  icon={
                    <img
                      style={{
                        borderRadius: "50%",
                        width: "2.5rem",
                        height: "2.5rem",
                      }}
                      src={
                        rooms.userone.username !== UserInfo?.username
                          ? rooms.userone.avatar
                          : rooms.usertwo.avatar
                      }
                      alt=""
                      loading="lazy"
                    />
                  }
                />
              ))
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
    </Container>
  );
};
