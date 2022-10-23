import React from "react";
import { createStyles, Text } from "@mantine/core";
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

  return (
    <div className={classes.wrapper}>
      <div className={classes.mainwrapper}>
        {" "}
        <Text className={classes.title} size="sm">
          Suggested accounts
        </Text>
        <div className={classes.accounts}>
          {new Array(4).fill(0).map(() => {
            return (
              <div className={classes.account}>
                <img
                  loading="lazy"
                  className={classes.avatar}
                  src="https://res.cloudinary.com/dwzjfylgh/image/upload/v1648215217/dd23namcxikmc35qewa2.jpg"
                  alt=""
                />
                <Text weight={500} size="15px">
                  katoph
                </Text>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
