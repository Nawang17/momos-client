import React from "react";
import { createStyles, Text } from "@mantine/core";
const useStyles = createStyles(() => ({
  wrapper: {
    width: "100%",
    flex: 0.3,
  },
  mainwrapper: {
    top: "65px",
    position: "sticky",
    background: "white",
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
          <div className={classes.account}>
            <img
              className={classes.avatar}
              src="https://res.cloudinary.com/dwzjfylgh/image/upload/v1648215217/dd23namcxikmc35qewa2.jpg"
              alt=""
            />
            <Text weight={500} size="md">
              katoph
            </Text>
          </div>
          <div className={classes.account}>
            <img
              className={classes.avatar}
              src="https://res.cloudinary.com/dwzjfylgh/image/upload/v1648215217/dd23namcxikmc35qewa2.jpg"
              alt=""
            />
            <Text weight={500} size="md">
              katoph
            </Text>
          </div>
          <div className={classes.account}>
            <img
              className={classes.avatar}
              src="https://res.cloudinary.com/dwzjfylgh/image/upload/v1648215217/dd23namcxikmc35qewa2.jpg"
              alt=""
            />
            <Text weight={500} size="md">
              katoph
            </Text>
          </div>
          <div className={classes.account}>
            <img
              className={classes.avatar}
              src="https://res.cloudinary.com/dwzjfylgh/image/upload/v1648215217/dd23namcxikmc35qewa2.jpg"
              alt=""
            />
            <Text weight={500} size="md">
              katoph
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};
