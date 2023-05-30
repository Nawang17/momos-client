import { Container, createStyles } from "@mantine/core";
import { Sidebar } from "../../Components/Sidebar";
import UserSearch from "./UserSearch";

const useStyles = createStyles(() => ({
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    paddingBottom: "5rem",
    paddingTop: "0.5rem",

    "@media (max-width: 700px)": {
      paddingTop: "0rem",
    },
  },
  leftWrapper: {
    width: "100%",
    flex: 0.7,
    borderRadius: "4px",

    "@media (max-width: 700px)": {
      flex: 1,
      borderRadius: "0px",
    },
  },
}));

export const Search = () => {
  const { classes } = useStyles();

  return (
    <Container px={0} className={classes.wrapper}>
      <div className={classes.leftWrapper}>
        <UserSearch />
      </div>
      <Sidebar />
    </Container>
  );
};
