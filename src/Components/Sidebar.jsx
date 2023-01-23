import React, { useEffect, useState } from "react";
import {
  Badge,
  createStyles,
  Divider,
  Popover,
  Progress,
  Skeleton,
  Text,
} from "@mantine/core";
import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import { CircleWavyCheck, DiscordLogo, GithubLogo, Info } from "phosphor-react";
import { leaderboardinfo, userlevel } from "../api/GET";

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
    gap: "0.5rem",
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
  const {
    darkmode,
    leaderboard,
    setLeaderboard,
    UserInfo,
    userlevelinfo,
    setUserlevelinfo,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const getLevel = () => {
    const points =
      userlevelinfo?.totalFollowers +
      userlevelinfo?.totalLikes +
      userlevelinfo?.totalposts;
    let level = Math.floor(points / 10);
    let progress = points % 10;
    return { level, progress };
  };
  function numberToOrdinal(n) {
    var s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  useEffect(() => {
    const getleaderboardinfo = async () => {
      setLoading(true);

      await leaderboardinfo(0)
        .then((res) => {
          setLeaderboard(res.data.leaderboard);

          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(true);
        });
    };
    const getuserlevel = async () => {
      await userlevel()
        .then((res) => {
          setUserlevelinfo(res.data.userlevel);
        })

        .catch(() => {
          setUserlevelinfo(null);
        });
    };
    getleaderboardinfo();
    if (UserInfo) {
      getuserlevel();
    } else {
      setUserlevelinfo(null);
    }
  }, [UserInfo]);
  return (
    <div className={classes.wrapper}>
      <div className={classes.mainwrapper}>
        {UserInfo && (
          <div
            style={{
              backgroundColor: darkmode ? "#1A1B1E" : "white",
              marginBottom: "0.5rem",
              borderRadius: "4px",
              padding: "1rem",
              color: darkmode ? "white" : "black",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                width: "100%",
              }}
            >
              {userlevelinfo ? (
                <img
                  onClick={() => navigate(`/${userlevelinfo?.username}`)}
                  loading="lazy"
                  style={{
                    cursor: "pointer",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                  src={userlevelinfo?.avatar}
                  alt=""
                />
              ) : (
                <Skeleton
                  style={{
                    width: "50px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                />
              )}
              {!userlevelinfo ? (
                <Skeleton height={10} radius="xl" mt={15} />
              ) : (
                <div
                  style={{
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <Text
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/${userlevelinfo?.username}`)}
                      size="xs"
                      weight={700}
                      clor="dimmed"
                    >
                      {userlevelinfo?.username}
                    </Text>
                    <Popover
                      width={220}
                      position="bottom"
                      withArrow
                      shadow="md"
                    >
                      <Popover.Target>
                        <Badge
                          style={{
                            cursor: "pointer",
                          }}
                          color="cyan"
                          size="xs"
                        >
                          LVL {getLevel().level}
                        </Badge>
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Text
                          color={darkmode ? "#c1c2c5" : "#000000"}
                          weight={700}
                          size={"xs"}
                        >
                          How does levels work?
                        </Text>
                        <Text size={"xs"}></Text>

                        <Text pt={5} size={"xs"}>
                          · Level is based on total points.
                        </Text>
                        <Text pt={5} size={"xs"}>
                          · Your level will increase by 1 for every 10 points.
                        </Text>
                        <Text pt={5} size={"xs"}>
                          · You can earn points by posting, and gaining likes
                          and new followers.
                        </Text>
                      </Popover.Dropdown>
                    </Popover>
                  </div>

                  <Text
                    color={darkmode ? "#c1c2c5" : "#000000"}
                    pt={5}
                    size={12}
                    weight={500}
                  >
                    {getLevel().progress} / 10 points
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "0.2rem",
                    }}
                  >
                    <Text
                      color={darkmode ? "#c1c2c5" : "#000000"}
                      pt={5}
                      size={10}
                    >
                      {" "}
                      Progress
                    </Text>
                    <Text
                      color={darkmode ? "#c1c2c5" : "#000000"}
                      pt={5}
                      size={10}
                    >
                      {" "}
                      LVL {getLevel().level + 1}
                    </Text>
                  </div>
                  <Progress
                    value={getLevel().progress * 10}
                    mt={4}
                    radius="xl"
                  />
                </div>
              )}
            </div>
          </div>
        )}

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
              <Text weight={700} size={12}>
                Leaderboard
              </Text>{" "}
              <Popover width={220} position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <Info
                    style={{
                      cursor: "pointer",
                    }}
                    size={15}
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
              {leaderboard.slice(0, 3).map((val, index) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    onClick={() => {
                      navigate(`/${val.username}`);
                    }}
                    key={val.id}
                    className={classes.account}
                  >
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
                        <img
                          loading="lazy"
                          style={{
                            cursor: "pointer",
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                          }}
                          src={val?.avatar}
                          alt=""
                        />
                        <div>
                          <Text
                            color={darkmode ? "#c1c2c5" : "#000000"}
                            size={"12px"}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.2rem",
                              }}
                            >
                              <Text
                                color={darkmode ? "white" : "black"}
                                weight={700}
                                size="12px"
                              >
                                {val.username}
                              </Text>

                              {val.verified &&
                                (val?.id !== 5 ? (
                                  <CircleWavyCheck
                                    size={15}
                                    color="#0ba6da"
                                    weight="fill"
                                  />
                                ) : (
                                  <CircleWavyCheck
                                    size={15}
                                    color="#0ba6da"
                                    weight="fill"
                                  />
                                ))}
                            </div>
                            {val.totalLikes +
                              val.totalposts +
                              val.totalFollowers}
                            {val.totalLikes + val.totalposts !== 1
                              ? " points"
                              : " point"}
                          </Text>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="filled"
                      size={"xs"}
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
                      {numberToOrdinal(index + 1)}
                    </Badge>
                  </div>
                );
              })}
            </div>

            <Text
              style={{
                cursor: "pointer",
                padding: "0.7rem 1rem 0.7rem 1.2rem",
              }}
              onClick={() => {
                navigate("/Leaderboard");
              }}
              size={"12px"}
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
              <Text weight={700} size={12}>
                Leaderboard
              </Text>{" "}
              <Popover width={220} position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <Info
                    style={{
                      cursor: "pointer",
                    }}
                    size={15}
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
            <div
              style={{
                paddingBottom: "0.7rem",
              }}
              className={classes.accounts}
            >
              {new Array(3).fill(0).map((_, index) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    key={index}
                    className={classes.account}
                  >
                    <Skeleton
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                    />

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
        {/* about */}
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            marginBottom: "0.5rem",
            borderRadius: "4px",
            padding: "1rem",
            color: darkmode ? "white" : "black",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "13px",
              gap: "1rem",
            }}
          >
            <Text
              onClick={() => {
                navigate("/about");
              }}
              style={{
                cursor: "pointer",
              }}
            >
              About
            </Text>
            <div
              onClick={() => {
                window.open(
                  "https://github.com/Nawang17/client-momo",
                  "_blank"
                );
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <GithubLogo size={20} />
              <Text>Github</Text>
            </div>
            <div
              onClick={() => {
                window.open("https://discord.gg/n32dAAcCJY", "_blank");
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <DiscordLogo size={20} />

              <Text>Discord</Text>
            </div>
          </div>
          <Text
            style={{
              paddingTop: "1rem",
            }}
            size="12px"
          >
            © 2023 momos. All rights reserved.
          </Text>
        </div>

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
