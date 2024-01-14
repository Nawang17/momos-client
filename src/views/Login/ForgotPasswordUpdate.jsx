import {
  Button,
  Checkbox,
  Container,
  createStyles,
  Loader,
  PasswordInput,
  Text,
} from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/Auth";
import { resetTokenCheck } from "../../api/GET";
import { resetPassword } from "../../api/UPDATE";
import ReactGA from "react-ga4";
import { showNotification } from "@mantine/notifications";
import { ShieldCheck } from "@phosphor-icons/react";
import { LoginStatus } from "../../api/AUTH";
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
    width: "100%",

    flex: 1,
  },
}));

export const ForgotPasswordUpdate = ({ socket }) => {
  const { classes } = useStyles();
  const { darkmode, setUserInfo, setfollowingdata, userInfo } =
    useContext(AuthContext);
  const [loading, setloading] = useState(true);
  const [NewPassword, setNewPassword] = useState("");
  const { resetToken } = useParams();
  const [validToken, setvalidToken] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [error, seterror] = useState("");
  const [submitLoading, setsubmitLoading] = useState(false);
  useEffect(() => {
    socket.emit("removeOnlinestatus", {
      token: localStorage?.getItem("token"),
    });
    setUserInfo(null);
    localStorage?.removeItem("token");

    resetTokenCheck(resetToken)
      .then(() => {
        setvalidToken(true);
        setloading(false);
      })
      .catch(() => {
        setvalidToken(false);
        setloading(false);
      });
  }, []);
  const onSumbit = () => {
    setsubmitLoading(true);
    seterror("");
    resetPassword(resetToken, NewPassword)
      .then((res) => {
        setSuccess(true);
        setTimeout(function () {
          setUserInfo(res.data.user);
          localStorage.setItem("token", res.data.token);
          navigate("/");
          ReactGA.event({
            category: "Button",
            action: "Regular_login",
            label: "Login",
          });
          socket.emit("onlinestatus", {
            token: res.data.token,
          });
          showNotification({
            icon: <ShieldCheck size={18} />,
            title: "Login Successful",
            message: <Trans>Welcome back {res.data.user.username}</Trans>,
            autoClose: 3000,
          });
          LoginStatus().then((resp) => {
            setfollowingdata(resp.data.userfollowingarr);
          });
        }, 2000);
      })
      .catch((err) => {
        seterror(err?.response?.data);
        setsubmitLoading(false);
      });
  };
  return (
    <Container px={0} className={classes.wrapper}>
      {validToken && !loading ? (
        <div className={classes.leftWrapper}>
          {!success ? (
            <div
              style={{
                backgroundColor: darkmode ? "#1A1B1E" : "white",
                color: darkmode ? "white" : "black",
                padding: "1rem 0rem 0.5rem 1rem",
              }}
            >
              <Text color="red" size="md">
                {error}
              </Text>
              <Text size="md" weight={700}>
                <Trans>Choose a new password </Trans>
              </Text>{" "}
              <PasswordInput
                mt={10}
                style={{
                  width: "200px",
                }}
                value={NewPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Checkbox
                mt={15}
                size="xs"
                color="green"
                checked={NewPassword.length >= 6}
                label="6 characters minimum"
                radius="xl"
              />
              <Button
                loading={submitLoading}
                onClick={() => {
                  onSumbit();
                }}
                disabled={NewPassword.length < 6}
                mt={10}
              >
                <Trans> Set Password</Trans>
              </Button>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: darkmode ? "#1A1B1E" : "white",
                color: darkmode ? "white" : "black",
                padding: "1rem 0rem 0.5rem 1rem",
              }}
            >
              <Text size="md">
                <Trans>
                  You successfully changed your password and will now be logged
                  in shortly.
                </Trans>
              </Text>
            </div>
          )}
        </div>
      ) : !loading ? (
        <div className={classes.leftWrapper}>
          <div
            style={{
              backgroundColor: darkmode ? "#1A1B1E" : "white",
              color: darkmode ? "white" : "black",
              padding: "1rem 0rem 0.5rem 1rem",
            }}
          >
            <Text size="lg">
              <Trans>Oops! The link you used no longer works.</Trans>
            </Text>
            <Text
              onClick={() => navigate("/login")}
              style={{
                cursor: "pointer",
              }}
              pt={10}
              color="blue"
            >
              <Trans>Login</Trans>
            </Text>
            <Text
              onClick={() => navigate("/Register")}
              style={{
                cursor: "pointer",
              }}
              pt={5}
              color="blue"
            >
              <Trans>Register</Trans>
            </Text>
          </div>
        </div>
      ) : (
        <div className={classes.leftWrapper}>
          <div
            style={{
              backgroundColor: darkmode ? "#1A1B1E" : "white",
              color: darkmode ? "white" : "black",
              padding: "1rem 0rem 0.5rem 1rem",
            }}
          >
            <Loader />
          </div>
        </div>
      )}
    </Container>
  );
};
