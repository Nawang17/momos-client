import React from "react";
import { createStyles, Text } from "@mantine/core";
import { ChatCircle, DotsThree, Heart } from "phosphor-react";
const useStyles = createStyles(() => ({
  wrapper: {
    background: "white",
    padding: "1rem",
    display: "flex",
    gap: "1rem",
    borderRadius: "4px",
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
  image: {
    width: "100%",
    borderRadius: "4px",
  },
  body: {
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
  },
  footer: {
    display: "flex",
    gap: "1rem",
  },
  fRight: {
    display: "flex",
    alignItems: "center",
    gap: "0.2rem",
  },
  fLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.2rem",
  },
}));
export const Post = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.left}>
        <img
          loading="lazy"
          className={classes.avatar}
          src="https://res.cloudinary.com/dwzjfylgh/image/upload/v1648215217/dd23namcxikmc35qewa2.jpg"
          alt=""
        />
      </div>
      <div className={classes.right}>
        <div className={classes.header}>
          <div className={classes.hLeft}>
            <Text weight={500} size="15px">
              katoph
            </Text>
            <Text color="dimmed" size="sm">
              10 min ago
            </Text>
          </div>
          <div className={classes.hRight}>
            <DotsThree size={20} />
          </div>
        </div>
        <div className={classes.body}>
          <Text size="15px">
            Hello world. My name is Nawang Sherpa. Welcome to Momos.
          </Text>
        </div>

        {/* <img
          loading="lazy"
          className={classes.image}
          src="https://res.cloudinary.com/dwzjfylgh/image/upload/v1660619196/ib9t8qphlwyzdlfi86ks.webp"
          alt=""
        /> */}
        <div className={classes.footer}>
          <div className={classes.fLeft}>
            <Heart weight="light" size={21} />
            <Text size="15px"> 1 </Text>
          </div>
          <div className={classes.fRight}>
            <ChatCircle weight="light" size={20} />
            <Text size="15px">1</Text>
          </div>
        </div>
      </div>
    </div>
  );
};
