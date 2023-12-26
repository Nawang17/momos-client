import React, { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  createStyles,
  Divider,
  Indicator,
  NavLink,
  Popover,
  Progress,
  Skeleton,
  Text,
} from "@mantine/core";
import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import { CircleWavyCheck, Info } from "@phosphor-icons/react";
import { getTopNews, leaderboardinfo, userlevel } from "../api/GET";
import Topuserbadge from "../helper/Topuserbadge";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import locale from "date-fns/locale/en-US";
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
    onlinelist,
    topUser,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  function numberToOrdinal(n) {
    var s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
  const [news, setNews] = useState([]);
  function calculateLevelAndProgress() {
    const points = userlevelinfo?.totalpoints;
    const base = 3; // log base value
    let level = 1;
    let requiredPoints = base;

    while (points >= requiredPoints) {
      level++;
      requiredPoints = Math.pow(base, level);
    }

    const levelStartPoints = Math.pow(base, level - 1);
    const levelProgress = Math.max(0, points - levelStartPoints + 1);
    const totalPointsInLevel = requiredPoints - levelStartPoints;

    return {
      level: level, // Start with level 1
      progress: levelProgress,
      totalPointsInLevel: totalPointsInLevel,
    };
  }

  useEffect(() => {
    const getleaderboardinfo = async () => {
      setLoading(true);

      await leaderboardinfo(0, "allTime")
        .then((res) => {
          setLeaderboard(res.data.leaderboard);

          setLoading(false);
        })
        .catch((err) => {
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
    getTopNews().then((res) => {
      setNews(res.data.news.data);
    });
    getleaderboardinfo();
    if (UserInfo) {
      getuserlevel();
    } else {
      setUserlevelinfo(null);
    }
  }, [UserInfo]);
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

  return (
    <div className={classes.wrapper}>
      <div
        style={{
          top: UserInfo ? "-50px" : "69px",
        }}
        className={classes.mainwrapper}
      >
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
                //user level info
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
                    {topUser === userlevelinfo?.username && <Topuserbadge />}
                    <Popover
                      zIndex={1000}
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
                          LVL {calculateLevelAndProgress().level}
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
                          🏆 Level is based on total points.
                        </Text>
                        <Text pt={5} size={"xs"}>
                          🎢 Logarithmic Magic: I use a special formula with a
                          base of 3. At first, you'll quickly move through the
                          levels, but as you earn more points, each new level
                          becomes a bit more challenging to reach.
                        </Text>
                        <Text pt={5} size={"xs"}>
                          📈 You can earn points by gaining likes on your
                          content.
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
                    {calculateLevelAndProgress().progress} /{" "}
                    {calculateLevelAndProgress().totalPointsInLevel} points
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
                      LVL {calculateLevelAndProgress().level + 1}
                    </Text>
                  </div>
                  <Progress
                    value={
                      (calculateLevelAndProgress().progress /
                        calculateLevelAndProgress().totalPointsInLevel) *
                      100
                    }
                    mt={4}
                    radius="xl"
                    color="#17caad"
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
                    points earned by the user. (Leaderboard reset every month )
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
                              {topUser === val?.username && <Topuserbadge />}

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
                            {val.totalpoints} points
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
        {/* latest news */}

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
              Top News
            </Text>{" "}
          </div>
          <div
            style={{
              paddingTop: "0.3rem",
            }}
            className={classes.accounts}
          >
            {news.map((val, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "0rem",
                  }}
                  onClick={() => {
                    window.location.href = val?.url;
                  }}
                  key={val.uuid}
                  className={classes.account}
                >
                  <div
                    style={{
                      // borderTop: darkmode
                      //   ? "1px solid rgb(47, 49, 54)"
                      //   : "1px solid rgb(230, 230, 230)",
                      display: "flex",
                      flex: 1,
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0rem",
                      }}
                    >
                      <div>
                        <Text
                          color={darkmode ? "#c1c2c5" : "#000000"}
                          size={"15px"}
                          weight={600}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Text color="dimmed" size="12px">
                              {val?.source}
                            </Text>
                          </div>
                          <span
                            style={{ paddingTop: "0.1rem" }}
                            className="link-style"
                          >
                            {val?.title}
                          </span>
                        </Text>
                        <Text pt="5px" size={"12px"} color="dimmed">
                          {formatDistanceToNowStrict(
                            new Date(val?.published_at),
                            {
                              locale: {
                                ...locale,
                                formatDistance,
                              },
                              addSuffix: true,
                            }
                          )}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* online users */}
        {onlinelist.length > 0 && (
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
                padding: "0.7rem 1rem 0rem 1rem",
                paddingBottom: onlinelist.length === 0 ? "0.4rem" : "Orem",
                alignItems: "center",
              }}
            >
              <Text weight={700} size={12}>
                Online - {onlinelist.length}
              </Text>
            </div>

            <div>
              {onlinelist.map((val) => {
                return (
                  <NavLink
                    style={{
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                    onClick={() => {
                      navigate(`/${val.username}`);
                    }}
                    key={val.username}
                    label={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.2rem",
                        }}
                      >
                        <Text>{val.username}</Text>
                        {topUser === val.username && <Topuserbadge />}
                      </div>
                    }
                    description={val.description}
                    icon={
                      <Indicator
                        offset={7}
                        color="green"
                        position="bottom-end"
                        withBorder
                      >
                        <Avatar radius={"xl"} size="40px" src={val.avatar} />
                      </Indicator>
                    }
                  />
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
            color: darkmode ? "#c1c2c5" : "black",
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
            {" "}
            <div
              className="hoveru"
              onClick={() => {
                navigate("/about");
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <Text>About</Text>
            </div>
            <div
              className="hoveru"
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
              <Text>Github</Text>
            </div>
            <div
              className="hoveru"
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
              <Text>Discord</Text>
            </div>
            <div
              className="hoveru"
              onClick={() => {
                navigate("/discover");
              }}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <Text>Search</Text>
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
