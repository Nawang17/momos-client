import React, { useEffect } from "react";
import {
  Avatar,
  createStyles,
  Indicator,
  NavLink,
  Popover,
  Progress,
  Skeleton,
  Text,
} from "@mantine/core";
import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { useLocation, useNavigate } from "react-router-dom";
import { SketchLogo } from "@phosphor-icons/react";
import { leaderboardinfo, userlevel } from "../api/GET";
import Topuserbadge from "../helper/Topuserbadge";
import Leaderboard from "./Sidebar/Leaderboard";
import News from "./Sidebar/News";
import { calculateLevelAndProgress } from "../helper/helperfunctions";
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
    setLeaderboard,
    UserInfo,
    userlevelinfo,
    setUserlevelinfo,
    onlinelist,
    topUser,
    setLeaderboardloading,
    setUserInfo,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const totalPoints = userlevelinfo?.totalpoints;

  const { pathname } = useLocation();
  useEffect(() => {
    const getuserlevel = () => {
      userlevel()
        .then((res) => {
          setUserlevelinfo(res.data.userlevel);
        })
        .catch(() => {
          setUserInfo(null);
          setUserlevelinfo(null);
        });
    };

    if (UserInfo) {
      getuserlevel();
    } else {
      setUserlevelinfo(null);
    }
  }, [UserInfo]);
  useEffect(() => {
    const getleaderboardinfo = () => {
      setLeaderboardloading(true);

      leaderboardinfo(0, "allTime")
        .then((res) => {
          setLeaderboard(res.data.leaderboard);

          setLeaderboardloading(false);
        })
        .catch(() => {
          setLeaderboardloading(true);
        });
    };
    if (pathname === "/") {
      getleaderboardinfo();
    }
  }, []);

  const getRankInfo = () => {
    const totalPoints = userlevelinfo?.totalpoints;
    if (totalPoints >= 200) {
      return {
        backgroundColor: "#d381e5",
        rankName: "Diamond",
        color: "white",
        icon: <SketchLogo size={16} color="#d381e5" weight="fill" />,
      };
    } else if (totalPoints >= 150) {
      return {
        backgroundColor: "#3ba7b4",
        rankName: "Platinum",
        color: "white",
        icon: <SketchLogo size={16} color="#3ba7b4" weight="fill" />,
      };
    } else if (totalPoints >= 100) {
      return {
        backgroundColor: "#ffd700",
        rankName: "Gold",
        color: "black",
        icon: <SketchLogo size={16} color="#ffd700" weight="fill" />,
      };
    } else if (totalPoints >= 50) {
      return {
        backgroundColor: "#c0c0c0",
        rankName: "Silver",
        color: "black",
        icon: (
          <SketchLogo size={16} color="RGB(192, 192, 192) " weight="fill" />
        ),
      };
    } else {
      return {
        backgroundColor: "#cd7f32",
        rankName: "Bronze",
        color: "white",
        icon: <SketchLogo size={16} color="RGB(205, 127, 50)" weight="fill" />,
      };
    }
  };
  return (
    <div className={classes.wrapper}>
      <div
        style={{
          top: UserInfo ? (pathname === "/" ? "-60px" : "67px") : "69px",
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
                      <Popover.Target
                        style={{
                          cursor: "pointer",
                        }}
                        className="heartbeat-icon"
                      >
                        {getRankInfo().icon}
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
                          🏆 Your level is based on how many points you have.
                        </Text>
                        <Text pt={5} size={"xs"}>
                          🎢 Leveling becomes more challenging with each new
                          level.
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
                    {getRankInfo().rankName} Rank - {userlevelinfo?.totalpoints}{" "}
                    points
                  </Text>

                  <Progress
                    style={{
                      margin: "0.6rem 0",
                    }}
                    value={
                      (calculateLevelAndProgress(totalPoints).progress /
                        calculateLevelAndProgress(totalPoints)
                          .totalPointsInLevel) *
                      100
                    }
                    mt={4}
                    radius="xl"
                    color="#17caad"
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      color={darkmode ? "#c1c2c5" : "#000000"}
                      size={12}
                      weight={500}
                    >
                      {" "}
                      Level {calculateLevelAndProgress(totalPoints).level}
                    </Text>
                    <Text
                      color={darkmode ? "#c1c2c5" : "#000000"}
                      size={12}
                      weight={500}
                    >
                      {" "}
                      {calculateLevelAndProgress(totalPoints)
                        .totalPointsInLevel -
                        calculateLevelAndProgress(totalPoints).progress}{" "}
                      pts to Level{" "}
                      {calculateLevelAndProgress(totalPoints).level + 1}
                    </Text>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* leaderboard */}
        {pathname === "/" && <Leaderboard />}

        {/* latest news */}
        <News />

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
