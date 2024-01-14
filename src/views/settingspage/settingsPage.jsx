import {
  ActionIcon,
  Container,
  createStyles,
  Divider,
  NavLink,
  Text,
} from "@mantine/core";
import { ArrowLeft, CaretRight } from "@phosphor-icons/react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../Components/Sidebar";
import { AuthContext } from "../../context/Auth";
import Apperance from "./components/Apperance";
import ChangePassword from "./components/ChangePassword";
import ChangeEmail from "./components/ChangeEmail";
import { useState } from "react";
import { getUserInfo } from "../../api/GET";
import { format } from "date-fns";
import Translation from "./components/Translation";
import { Trans } from "@lingui/macro";
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
  const [usersettingsInfo, setUsersettingsInfo] = useState([]);
  const { darkmode, UserInfo } = useContext(AuthContext);

  const navigate = useNavigate();
  useEffect(() => {
    getUserInfo()
      .then((res) => {
        setUsersettingsInfo(res.data);
      })
      .catch(() => {
        navigate("/");
      });
  }, [UserInfo]);

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
            <Trans> Settings</Trans>
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
            <Trans>Account</Trans>
          </Text>
          <NavLink
            onClick={() => navigate("/editprofile")}
            label=<Trans>Edit profile</Trans>
            rightSection={<CaretRight size="0.8rem" stroke={1.5} />}
          />
          {!usersettingsInfo?.isGoogleAccount && (
            <>
              <ChangeEmail
                usersettingsInfo={usersettingsInfo}
                setUsersettingsInfo={setUsersettingsInfo}
              />
              <ChangePassword />
            </>
          )}

          <Divider my="sm" />
          {/* <Text pl={13} pb={5} weight={700}>
            Security
          </Text>
          

          <ChangePassword />
          <Divider my="sm" /> */}
          <Text pl={13} pb={5} weight={700}>
            <Trans>Other</Trans>
          </Text>
          <Apperance />
          <Translation />

          <NavLink
            description={
              usersettingsInfo?.createdAt &&
              format(new Date(usersettingsInfo?.createdAt), "PP h:mm a")
            }
            label=<Trans>Account created</Trans>
          />
          {/* <DeleteAccount socket={socket} /> */}
        </div>
      </div>

      <Sidebar />
    </Container>
  );
};
