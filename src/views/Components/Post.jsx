import React from "react";
import { createStyles, Text } from "@mantine/core";
const useStyles = createStyles(() => ({
  wrapper: {
    background: "white",
    padding: "1rem",
    display: "flex",
    gap: "1rem",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
  right: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    width: "100%",
  },
  footer: {
    display: "flex",
    gap: "1rem",
  },
}));
export const Post = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.wrapper}>
      <div className={classes.left}>
        <img
          className={classes.avatar}
          src="https://res.cloudinary.com/dwzjfylgh/image/upload/v1648215217/dd23namcxikmc35qewa2.jpg"
          alt=""
        />
      </div>
      <div className={classes.right}>
        <div className={classes.header}>
          <div className={classes.hLeft}>
            <Text weight={500} size="md">
              katoph
            </Text>
            <Text color="dimmed" size="sm">
              10 min ago
            </Text>
          </div>
          <div className={classes.hRight}>&hellip;</div>
        </div>
        <div className={classes.body}>
          <Text size="md">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quo, enim?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime,
            neque.
          </Text>
        </div>
        <div className={classes.image}></div>
        <div className={classes.footer}>
          <div className={classes.fLeft}>Like</div>
          <div className={classes.fRight}>Comment</div>
        </div>
      </div>
    </div>
  );
};
