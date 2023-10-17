import {
  Badge,
  createStyles,
  Divider,
  Popover,
  ScrollArea,
  Skeleton,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  CaretRight,
  CircleWavyCheck,
  Crown,
  Info,
} from "@phosphor-icons/react";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";
const useStyles = createStyles(() => ({
  wrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  horizontalsuggeastedaccounts: {
    display: "none",
    "@media (max-width: 700px)": {
      display: "block",
      margin: "0px 0px 8px 0px",

      padding: "0px 15px",
    },
  },
}));

const Leaderboardhorizontal = () => {
  const { darkmode, leaderboard, leaderboardloading } = useContext(AuthContext);

  const { classes } = useStyles();
  const navigate = useNavigate();
  const screenwidth = useMediaQuery("(min-width: 440px)");
  return (
    <div
      style={{
        backgroundColor: darkmode ? "#1A1B1E" : "white",
        color: darkmode ? "white" : "black",
      }}
      className={classes.horizontalsuggeastedaccounts}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          paddingTop: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            paddingBottom: "10px",
          }}
        >
          {" "}
          <Text weight={"500"} size={"14px"}>
            Leaderboard
          </Text>
          <Popover width={220} position="right" withArrow shadow="md">
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
          }}
        >
          {" "}
          <Text
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/Leaderboard");
            }}
            weight={"500"}
            size={"14px"}
          >
            {" "}
            View all
          </Text>
          <CaretRight size={15} />
        </div>
      </div>
      <ScrollArea
        offsetScrollbars
        type={screenwidth ? "hover" : "never"}
        mx="10"
        style={{
          maxWidth: "100%",
          width: "auto",
          height: 190,
        }}
      >
        {!leaderboardloading ? (
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginRight: "14px",
            }}
          >
            {leaderboard.map((val, index) => {
              return (
                <div
                  key={val.id}
                  onClick={() => {
                    navigate(`/${val.username}`);
                  }}
                  style={{
                    border: darkmode
                      ? "1px solid #2f3136"
                      : "1px solid #e6e6e6",
                    borderRadius: "4px",
                    padding: "5px 25px",
                    width: "5.9rem",

                    height: "10rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: index === 0 ? "4px" : "6px",

                    cursor: "pointer",
                  }}
                >
                  {index === 0 ? (
                    <div className="heartbeat-icon">
                      <Crown weight="fill" size={25} color="gold" />
                    </div>
                  ) : (
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
                  )}{" "}
                  <img
                    alt=""
                    style={{
                      border: index === 0 ? "3px solid gold" : "none",
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                    }}
                    src={val.avatar}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.2rem",
                    }}
                  >
                    {" "}
                    <Text size={"sm"} color={darkmode ? "white" : "black"}>
                      {val.username}
                    </Text>
                    {val.verified && (
                      <CircleWavyCheck
                        size={16}
                        color="#0ba6da"
                        weight="fill"
                      />
                    )}
                  </div>
                  <Text size={"12px"} color={"dimmed"}>
                    {val.totalpoints}
                    pts
                  </Text>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginRight: "14px",
            }}
          >
            {new Array(8).fill(0).map((_, index) => {
              return (
                <div
                  key={index}
                  style={{
                    border: darkmode
                      ? "1px solid #2f3136"
                      : "1px solid #e6e6e6",
                    borderRadius: "4px",
                    padding: "5px 25px",
                    width: "5.9rem",

                    height: "10rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",

                    cursor: "pointer",
                  }}
                >
                  <Skeleton height={70} circle />

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {" "}
                    <Skeleton height={8} radius="xl" />
                  </div>
                  <Skeleton width="70%" height={8} radius="xl" />
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default Leaderboardhorizontal;
