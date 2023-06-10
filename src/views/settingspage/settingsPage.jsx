import { ActionIcon, Container, createStyles, NavLink } from "@mantine/core";
import { ArrowLeft, CaretRight, Key, Palette, User } from "phosphor-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../Components/Sidebar";
import { AuthContext } from "../../context/Auth";
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
    flex: 0.7,
    "@media (max-width: 700px)": {
      flex: 1,
    },
  },
}));

export const SettingsPage = () => {
  const { classes } = useStyles();
  const { darkmode } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Container px={0} className={classes.wrapper}>
      <div className={classes.leftWrapper}>
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
            padding: "1rem 0rem 0rem 1rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <ActionIcon onClick={() => navigate(-1)}>
            <ArrowLeft size="20px" />
          </ActionIcon>
        </div>
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",

            color: darkmode ? "white" : "black",
            padding: "0.5rem ",
          }}
        >
          <NavLink
            onClick={() => navigate("/editprofile")}
            label="Account informaton"
            icon={<User size="1rem" stroke={1.5} />}
            rightSection={<CaretRight size="0.8rem" stroke={1.5} />}
          />
          <NavLink
            label="Change Password"
            icon={<Key size="1rem" stroke={1.5} />}
            rightSection={<CaretRight size="0.8rem" stroke={1.5} />}
          />
          <NavLink
            label="Display theme"
            icon={<Palette size="1rem" stroke={1.5} />}
            rightSection={<CaretRight size="0.8rem" stroke={1.5} />}
          />
        </div>
      </div>

      <Sidebar />
    </Container>
  );
};
