import {
  Badge,
  Divider,
  Popover,
  createStyles,
  Skeleton,
  Text,
} from "@mantine/core";
import { Info } from "@phosphor-icons/react";
import React, { useContext } from "react";
import Topuserbadge from "../../helper/Topuserbadge";
import { AuthContext } from "../../context/Auth";
import { useNavigate } from "react-router-dom";
import Verifiedbadge from "../../helper/VerifiedBadge";
import { Trans } from "@lingui/macro";
const useStyles = createStyles(() => ({
  accounts: {
    paddingTop: "0.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  account: {
    display: "flex",
    alignItems: "center",
    padding: "0.6rem 1rem 0.6rem 1rem",
    gap: "0.8rem",
    cursor: "pointer",
  },
}));
const Leaderboard = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const { darkmode, leaderboard, topUser, leaderboardloading } =
    useContext(AuthContext);

  // convert number value to ordinal (1st ,2nd ,3rd etc)
  function numberToOrdinal(n) {
    var s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
  return (
    <>
      {!leaderboardloading ? (
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
              <Trans>Leaderboard</Trans>
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
                  <Trans>
                    The leaderboard ranking is based on the total number of
                    points earned by the user.
                  </Trans>
                </Text>
                <Divider my="xs" />
                <Text color={"#1DA1F2"} size={"sm"} weight={500}>
                  <Trans> How to earn points? </Trans>
                </Text>

                <Text size={"xs"}>+1 point for each like on your posts</Text>

                <Text size={"xs"} color="red">
                  <Trans>*Self likes are not counted</Trans>
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
                            {val.verified && <Verifiedbadge />}
                            {topUser === val?.username && <Topuserbadge />}
                          </div>
                          <Trans>{val.totalpoints} points</Trans>
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
            <Trans>View all</Trans>
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
              <Trans>Leaderboard</Trans>
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
                  <Trans>
                    The leaderboard ranking is based on the total number of
                    points earned by the user.
                  </Trans>
                </Text>
                <Divider my="xs" />
                <Text color={"#1DA1F2"} size={"sm"} weight={500}>
                  <Trans> How to earn points?</Trans>
                </Text>

                <Text size={"xs"}>
                  <Trans>+1 point for each like on your posts</Trans>
                </Text>

                <Text size={"xs"} color="red">
                  <Trans>*Self likes are not counted</Trans>
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
    </>
  );
};

export default Leaderboard;
