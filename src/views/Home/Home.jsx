import React from "react";
import { Container, createStyles } from "@mantine/core";
import { PostFeed } from "../Components/PostFeed";
import { Sidebar } from "../Components/Sidebar";

const useStyles = createStyles(() => ({
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    paddingBottom: "5rem",
    paddingTop: "0.5rem",
  },
}));
export const Home = () => {
  const { classes } = useStyles();

  return (
    <Container px={10} className={classes.wrapper}>
      <PostFeed />
      <Sidebar />
    </Container>
  );
};
