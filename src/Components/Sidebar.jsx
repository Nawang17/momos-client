import React, { useEffect, useState } from "react";
import {
  Badge,
  createStyles,
  Divider,
  Popover,
  Skeleton,
  Text,
} from "@mantine/core";
import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import { CircleWavyCheck, Crown, Info } from "phosphor-react";
import { leaderboardinfo } from "../api/GET";
const useStyles = createStyles(() => ({
  wrapper: {
    width: "100%",
    flex: 0.3,
    "@media (max-width: 700px)": {
      flex: 0,
      display: "none",
    },
  },
  mainwrapper: {
    top: "65px",
    position: "sticky",

    paddingBottom: "1rem",
  },
  accounts: {
    paddingTop: "0.5rem",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    padding: "0.7rem 1rem 0 1rem",
  },
  account: {
    display: "flex",
    alignItems: "center",
    padding: "0.6rem 1rem 0.6rem 1rem",
    gap: "0.8rem",
    cursor: "pointer",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },
}));
export const Sidebar = () => {
  const { classes } = useStyles();
  const { darkmode, leaderboard, setLeaderboard } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    leaderboardinfo(0)
      .then((res) => {
        setLeaderboard(res.data.leaderboard);

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(true);
      });
  }, []);
  return (
    <div className={classes.wrapper}>
      <div className={classes.mainwrapper}>
        {!loading ? (
          <div
            style={{
              backgroundColor: darkmode ? "#1A1B1E" : "white",
              color: darkmode ? "white" : "black",
              marginBottom: "0.5rem",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "0.7rem 1rem 0 1rem",
                gap: "0.4rem",
                alignItems: "center",
              }}
            >
              <Text size="sm">Leaderboard</Text>{" "}
              <Popover width={220} position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <Info
                    style={{
                      cursor: "pointer",
                    }}
                    size={18}
                  />
                </Popover.Target>
                <Popover.Dropdown>
                  <Text size={"xs"}>
                    The leaderboard ranking is based on the total number of
                    points earned by the user.
                  </Text>
                  <Divider my="xs" />
                  <Text color={"#1DA1F2"} size={"sm"} weight={500}>
                    How to earn points?
                  </Text>
                  <Text size={"xs"}>
                    +1 point for every new post you create
                  </Text>
                  <Text size={"xs"}>+1 point for every new follower</Text>
                  <Text size={"xs"}>+1 point for each like on your posts</Text>
                  <Text size={"xs"} color="red">
                    *Self post likes are not counted
                  </Text>
                </Popover.Dropdown>
              </Popover>
            </div>
            <div className={classes.accounts}>
              {leaderboard.slice(0, 4).map((val, index) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => {
                      navigate(`/${val.username}`);
                    }}
                    key={val.id}
                    className={classes.account}
                  >
                    <div
                      style={{
                        width: "2rem",
                        height: "2rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {index === 0 ? (
                        <Crown
                          weight="fill"
                          size={25}
                          color={darkmode ? "gold" : "orange"}
                        />
                      ) : (
                        <Badge
                          size="md"
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
                              ? "yellow"
                              : index === 1
                              ? "indigo"
                              : index === 2
                              ? "teal"
                              : "gray"
                          }
                        >
                          {index + 1}
                        </Badge>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",

                        flex: 1,
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        {" "}
                        <Text
                          color={index === 0 && (darkmode ? "gold" : "orange")}
                          weight={500}
                          size="15px"
                        >
                          {val.username}
                        </Text>
                        {val.verified &&
                          (val?.id !== 5 ? (
                            <CircleWavyCheck
                              size={17}
                              color="#0ba6da"
                              weight="fill"
                            />
                          ) : (
                            <CircleWavyCheck
                              size={17}
                              color="#0ba6da"
                              weight="fill"
                            />
                          ))}
                      </div>
                      <Text size={"12px"}>
                        {val.totalLikes + val.totalposts + val.totalFollowers}
                        {val.totalLikes + val.totalposts !== 1
                          ? " points"
                          : " point"}
                      </Text>
                    </div>
                    {/* <Text size={"xs"}>212pts</Text> */}
                  </div>

                  //y
                );
              })}
            </div>

            <Text
              style={{
                cursor: "pointer",
                padding: "0.3rem 1rem 0.7rem 1.2rem",
              }}
              onClick={() => {
                navigate("/Leaderboard");
              }}
              size={"14px"}
            >
              {" "}
              View all
            </Text>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: darkmode ? "#1A1B1E" : "white",
              color: darkmode ? "white" : "black",
              marginBottom: "0.5rem",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "0.7rem 1rem 0 1rem",
                gap: "0.4rem",
                alignItems: "center",
              }}
            >
              <Text size="sm">Leaderboard</Text>{" "}
              <Popover width={220} position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <Info
                    style={{
                      cursor: "pointer",
                    }}
                    size={18}
                  />
                </Popover.Target>
                <Popover.Dropdown>
                  <Text size={"xs"}>
                    The leaderboard ranking is based on the total number of
                    points earned by the user.
                  </Text>
                  <Divider my="xs" />
                  <Text color={"#1DA1F2"} size={"sm"} weight={500}>
                    How to earn points?
                  </Text>
                  <Text size={"xs"}>
                    +1 point for every new post you create
                  </Text>
                  <Text size={"xs"}>+1 point for every new follower</Text>
                  <Text size={"xs"}>+1 point for each like on your posts</Text>
                  <Text size={"xs"} color="red">
                    *Self post likes are not counted
                  </Text>
                </Popover.Dropdown>
              </Popover>
            </div>
            <div className={classes.accounts}>
              {new Array(5).fill(0).map((_, index) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    key={index}
                    className={classes.account}
                  >
                    <div
                      style={{
                        height: "2rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Skeleton height={20} circle />
                    </div>

                    <div
                      style={{
                        display: "flex",

                        flex: 1,
                        flexDirection: "column",
                      }}
                    >
                      <Skeleton width={"100px"} height={8} radius="xl" />
                      <Skeleton width={"60px"} height={8} mt={10} radius="xl" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
            borderRadius: "4px",
          }}
        >
          <Text
            style={{
              backgroundColor: darkmode ? "#1A1B1E" : "white",
              color: darkmode ? "white" : "black",
            }}
            className={classes.title}
            size="sm"
          >
            Suggested accounts
          </Text>
          <div
            style={{
              backgroundColor: darkmode ? "#1A1B1E" : "white",
              color: darkmode ? "white" : "black",
            }}
            className={classes.accounts}
          >
            {suggestedUsers
              .filter((v) => {
                return (
                  !followingdata.includes(v.username) &&
                  v.username !== UserInfo?.username
                );
              })
              .slice(0, 4)
              .map((val) => {
                return (
                  <div
                    onClick={() => {
                      navigate(`/${val.username}`);
                    }}
                    key={val.id}
                    className={classes.account}
                  >
                    <img
                      loading="lazy"
                      className={classes.avatar}
                      src={val.avatar}
                      alt=""
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.2rem",
                      }}
                    >
                      {" "}
                      <Text weight={500} size="15px">
                        {val.username}
                      </Text>
                      {val.verified &&
                        (val?.id !== 5 ? (
                          <CircleWavyCheck
                            size={17}
                            color="#0ba6da"
                            weight="fill"
                          />
                        ) : (
                          <CircleWavyCheck
                            size={17}
                            color="#0ba6da"
                            weight="fill"
                          />
                        ))}
                    </div>
                  </div>
                  //y
                );
              })}
          </div>
          <div
            onClick={() => {
              navigate("/suggestedaccounts");
            }}
            style={{
              cursor: "pointer",
              padding: "0.3rem 1rem 0.7rem 1.2rem",
            }}
          >
            <Text size="sm" color="#1DA1F2">
              {" "}
              View all
            </Text>
          </div>
        </div> */}
      </div>
    </div>
  );
};
