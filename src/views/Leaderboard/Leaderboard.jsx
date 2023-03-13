import {
  ActionIcon,
  Badge,
  Container,
  createStyles,
  Text,
  Skeleton,
  Popover,
  Divider,
  Loader,
  NavLink,
} from "@mantine/core";
import { ArrowLeft, Info, WarningCircle } from "phosphor-react";

import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../Components/Sidebar";
import { useContext, useEffect, useState } from "react";
import { leaderboardinfo } from "../../api/GET";
import { AuthContext } from "../../context/Auth";

import InfiniteScroll from "react-infinite-scroll-component";
import { showNotification } from "@mantine/notifications";

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
    width: "100%",
    flex: 0.7,
    "@media (max-width: 700px)": {
      flex: 1,
    },
  },
}));

export const Leaderboard = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { darkmode } = useContext(AuthContext);

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usercount, setusercount] = useState(0);
  const [page, setpage] = useState(0);
  let map = {};
  useEffect(() => {
    setLoading(true);

    leaderboardinfo(0)
      .then((res) => {
        setLeaderboard(res.data.leaderboard);
        setusercount(res.data.usersCount);
        setLoading(false);
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
  }, []);
  const fetchMoreData = () => {
    setpage((prev) => prev + 1);
    leaderboardinfo(page + 1)
      .then((res) => {
        setLeaderboard((prev) => [...prev, ...res.data.leaderboard]);
      })
      .catch((err) => {
        setLoading(true);
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
  return (
    <Container px={0} className={classes.wrapper}>
      <div className={classes.leftWrapper}>
        <div
          style={{
            /* can u make the div under stick to the top of the page when scrolling down */

            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
            padding: "1rem 1.1rem 1rem 1rem",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1.5rem",
          }}
          edit
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            <ActionIcon onClick={() => navigate(-1)}>
              <ArrowLeft size="20px" />
            </ActionIcon>
            <Text weight={"500"} size={"16px"}>
              Leaderboard
            </Text>
          </div>
          <Popover
            zIndex={1000}
            width={220}
            position="left"
            withArrow
            shadow="md"
          >
            <Popover.Target>
              <Info
                style={{
                  cursor: "pointer",
                }}
                size={20}
              />
            </Popover.Target>
            <Popover.Dropdown>
              <Text size={"xs"}>
                The leaderboard ranking is based on the total number of points
                earned by the user.
              </Text>
              <Divider my="xs" />
              <Text color={"#1DA1F2"} size={"sm"} weight={500}>
                How to earn points?
              </Text>
              <Text size={"xs"}>+1 point for each like on your posts</Text>
              <Text size={"xs"}>
                +1 point for each like on your comments and replies
              </Text>
              <Text size={"xs"} color="red">
                *Self likes are not counted
              </Text>
            </Popover.Dropdown>
          </Popover>
        </div>
        {!loading ? (
          <InfiniteScroll
            dataLength={leaderboard.length}
            next={fetchMoreData}
            hasMore={usercount > leaderboard.length}
            loader={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: "1rem",

                  backgroundColor: darkmode ? "#101113" : "#f0f2f5",
                }}
              >
                <Loader />
              </div>
            }
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: darkmode ? "#1A1B1E" : "white",
                color: darkmode ? "white" : "black",
              }}
            >
              {leaderboard
                .filter((obj) => !map[obj.id] && (map[obj.id] = true))
                .map((acc, index) => (
                  <NavLink
                    style={{
                      padding: "1rem 1.4rem",
                    }}
                    key={index}
                    onClick={() => {
                      navigate(`/${acc?.username}`);
                    }}
                    label={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <img
                          src={acc?.avatar}
                          style={{
                            width: "45px",
                            height: "45px",
                            borderRadius: "50%",
                          }}
                          alt=""
                        />
                        <div>{acc?.username}</div>
                      </div>
                    }
                    icon={
                      <Badge
                        variant="filled"
                        color={
                          darkmode
                            ? index === 0
                              ? "yellow"
                              : index === 1
                              ? "indigo"
                              : index === 2
                              ? "teal"
                              : "gray"
                            : index === 0
                            ? "orange"
                            : index === 1
                            ? "indigo"
                            : index === 2
                            ? "teal"
                            : "gray"
                        }
                      >
                        {index + 1}
                      </Badge>
                    }
                    rightSection={
                      <div
                        style={{
                          fontSize: "0.8rem",
                        }}
                      >
                        {`${
                          acc.totalLikes +
                          acc.totalNestedCommentLikes +
                          acc.totalCommentLikes
                        }
                      points
                      `}
                      </div>
                    }
                  />
                ))}
            </div>
          </InfiniteScroll>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: darkmode ? "#1A1B1E" : "white",
              color: darkmode ? "white" : "black",
            }}
          >
            {new Array(10).fill(0).map((_, index) => (
              <div
                key={index}
                style={{
                  padding: "1rem 1.4rem",
                  display: "flex",
                  gap: "0.6rem",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <Skeleton height={50} circle />
                </div>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "0.2rem",
                        alignItems: "center",
                      }}
                    >
                      <Skeleton height={5} width="100px" radius="xl" />
                    </div>
                    <Skeleton height={5} width="30px" radius="xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Sidebar />
    </Container>
  );
};
