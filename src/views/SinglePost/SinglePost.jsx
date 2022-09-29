import { useEffect } from "react";
import { Container, createStyles } from "@mantine/core";
import { Sidebar } from "../../Components/Sidebar";
import { SinglePostFeed } from "./SinglePostFeed";
import { useLocation } from "react-router-dom";

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
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <Container px={10} className={classes.wrapper}>
      <SinglePostFeed />
      <Sidebar />
    </Container>
  );
};
