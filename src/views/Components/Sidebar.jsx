import React from "react";
import { createStyles } from "@mantine/core";
const useStyles = createStyles(() => ({
  wrapper: {
    background: "blue",
  },
}));
export const Sidebar = () => {
  const { classes } = useStyles();

  return <div className={classes.wrapper}>Sidebar</div>;
};
