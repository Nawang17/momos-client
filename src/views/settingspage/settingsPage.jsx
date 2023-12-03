import {
  ActionIcon,
  Container,
  createStyles,
  Divider,
  NavLink,
  Switch,
  Text,
} from "@mantine/core";
import {
  ArrowLeft,
  CaretRight,
  Key,
  Palette,
  SignOut,
  User,
} from "@phosphor-icons/react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../Components/Sidebar";
import { AuthContext } from "../../context/Auth";
import Apperance from "./components/Apperance";
import DeleteAccount from "./components/DeleteAccount";
import ChangePassword from "./components/ChangePassword";
import ChangeEmail from "./components/ChangeEmail";
import { showNotification } from "@mantine/notifications";
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

export const SettingsPage = ({ socket }) => {
  const { classes } = useStyles();
  const { darkmode, UserInfo, setUserInfo, setfollowingdata } =
    useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!UserInfo) {
      navigate("/");
    }
  }, []);
  const handlelogout = () => {
    socket.emit("removeOnlinestatus", { token: localStorage.getItem("token") });
    setUserInfo(null);

    localStorage.removeItem("token");

    setfollowingdata([]);
    showNotification({
      icon: <SignOut size={18} />,
      title: "Logged out",
      autoClose: 3000,
      color: "gray",
    });
  };
  return (
    <Container px={0} className={classes.wrapper}>
      <div className={classes.leftWrapper}>
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
            padding: "1rem 0rem 0rem 1rem",
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          <ActionIcon onClick={() => navigate(-1)}>
            <ArrowLeft size="20px" />
          </ActionIcon>
          <Text size={"1rem"} weight={700}>
            Settings
          </Text>
        </div>
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",

            color: darkmode ? "white" : "black",
            padding: "0.5rem ",
          }}
        >
          <Text pl={13} py={10} weight={700}>
            Account
          </Text>
          <NavLink
            onClick={() => navigate("/editprofile")}
            label="Edit profile"
            rightSection={<CaretRight size="0.8rem" stroke={1.5} />}
          />
          <Divider my="sm" />
          <Text pl={13} pb={5} weight={700}>
            Security
          </Text>
          {/* <ChangeEmail /> */}

          <ChangePassword />
          <Divider my="sm" />
          <Text pl={13} pb={5} weight={700}>
            Other
          </Text>
          <Apperance />

          <DeleteAccount socket={socket} />
          <NavLink
            color="red"
            onClick={() => handlelogout()}
            label={`Log out @${UserInfo?.username}`}
          />
        </div>
      </div>

      <Sidebar />
    </Container>
  );
};
