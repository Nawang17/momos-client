import React from "react";
import { Container, createStyles } from "@mantine/core";
import { PostFeed } from "../Components/PostFeed";
import { Sidebar } from "../Components/Sidebar";

const useStyles = createStyles(() => ({
  wrapper: {
    background: "orange",
  },
}));
export const Home = () => {
  const { classes } = useStyles();

  return (
    <Container className={classes.wrapper}>
      <PostFeed />
      <Sidebar />
    </Container>
  );
};
