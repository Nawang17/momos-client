import React from "react";
import { Container, createStyles } from "@mantine/core";
import { Sidebar } from "../../Components/Sidebar";
import { SinglePostFeed } from "./SinglePostFeed";

const useStyles = createStyles(() => ({
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    paddingBottom: "5rem",
    paddingTop: "0.5rem",
  },
}));
export const SinglePost = () => {
  const { classes } = useStyles();

  return (
    <Container px={10} className={classes.wrapper}>
      <SinglePostFeed />
      <Sidebar />
    </Container>
  );
};
