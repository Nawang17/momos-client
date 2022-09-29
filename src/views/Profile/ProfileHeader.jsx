import React from "react";
import { Button, createStyles, Text, ActionIcon } from "@mantine/core";
import { ArrowLeft } from "phosphor-react";
import { useNavigate } from "react-router-dom";
const useStyles = createStyles(() => ({
  wrapper: {
    background: "white",
    padding: "1rem",
    gap: "0.5rem",
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
  const navigate = useNavigate();
  const { classes } = useStyles();

  return (
    <>
      <div style={{ background: "white", padding: "1rem 0rem 0rem 1rem" }}>
        <ActionIcon onClick={() => navigate(-1)}>
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
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <Text weight="bold" size="md">
              Katoph
            </Text>

            <Button radius={"xl"} size="xs">
              Follow
            </Button>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            {/* <Text>
              <span style={{ fontWeight: "500" }}>0</span> Posts
            </Text> */}
            <Text size="15px">
              <span style={{ fontWeight: "500" }}>0</span> Followers
            </Text>
            <Text size="15px">
              <span style={{ fontWeight: "500" }}>0</span> Following
            </Text>
          </div>

          <Text size="15px" color={"gray"}>
            This is a description
          </Text>
        </div>
      </div>
    </>
  );
};
