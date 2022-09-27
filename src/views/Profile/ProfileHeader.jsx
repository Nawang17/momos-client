import React from "react";
import { Button, createStyles, Text, ActionIcon } from "@mantine/core";
import { ArrowLeft } from "phosphor-react";

const useStyles = createStyles(() => ({
  wrapper: {
    background: "white",
    padding: "1rem",
    gap: "1rem",
    display: "flex",
    flexDirection: "column",
  },
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
  },
  right: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
}));
export const ProfileHeader = () => {
  const { classes } = useStyles();

  return (
    <>
      <div style={{ background: "white", padding: "1rem 0rem 0rem 1rem" }}>
        <ActionIcon>
          <ArrowLeft size="20px" />
        </ActionIcon>
      </div>
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
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Text weight={"bold"} size="lg">
              {" "}
              Katoph
            </Text>
            <Button size="xs">Follow</Button>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <Text>
              <span style={{ fontWeight: "500" }}>0</span> Posts
            </Text>
            <Text>
              <span style={{ fontWeight: "500" }}>0</span> Followers
            </Text>
            <Text>
              <span style={{ fontWeight: "500" }}>0</span> Following
            </Text>
          </div>

          <Text color={"gray"}> This is a description</Text>
        </div>
      </div>
    </>
  );
};
