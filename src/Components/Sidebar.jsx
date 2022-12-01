import React from "react";
import { createStyles, Text } from "@mantine/core";
import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import { CircleWavyCheck } from "phosphor-react";
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
    background: "white",
    paddingBottom: "1rem",
    borderRadius: "4px",
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
    "&:hover": {
      backgroundColor: "#f3f3f3",
    },
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },
}));
export const Sidebar = () => {
  const { classes } = useStyles();
  const { suggestedUsers, UserInfo, setSuggestedusers, followingdata } =
    useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className={classes.wrapper}>
      <div className={classes.mainwrapper}>
        {" "}
        <Text className={classes.title} size="sm">
          Suggested accounts
        </Text>
        <div className={classes.accounts}>
          {suggestedUsers
            .filter((v) => {
              return (
                !followingdata.includes(v.username) &&
                v.username !== UserInfo?.username
              );
            })
            .slice(0, 5)
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
            padding: "0.3rem 1rem 0 1.2rem",
          }}
        >
          <Text size="sm" color="#1DA1F2">
            {" "}
            View all
          </Text>
        </div>
      </div>
    </div>
  );
};
