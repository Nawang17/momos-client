import React from "react";
import { Container, createStyles } from "@mantine/core";
import { PostFeed } from "../../Components/PostFeed";
import { Sidebar } from "../../Components/Sidebar";

const useStyles = createStyles(() => ({
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    paddingBottom: "5rem",
    paddingTop: "0.5rem",
  },
  leftWrapper: {
    flex: 0.7,
    "@media (max-width: 700px)": {
      flex: 1,
    },
  },
}));
export const Home = () => {
  const { classes } = useStyles();

  return (
    <Container px={10} className={classes.wrapper}>
      <div className={classes.leftWrapper}>
        <PostFeed />
      </div>
      <Sidebar />
    </Container>
  );
};
