import React from "react";
import { createStyles } from "@mantine/core";
const useStyles = createStyles(() => ({
  wrapper: {
    background: "green",
  },
}));
export const PostFeed = () => {
  const { classes } = useStyles();

  return <div className={classes.wrapper}>PostFeed</div>;
};
