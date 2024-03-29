import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Divider,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { googleauth, LoginReq, LoginStatus } from "../../api/AUTH";
import { showNotification } from "@mantine/notifications";
import { AuthContext } from "../../context/Auth";
import { useNavigate } from "react-router-dom";

import { useEffect } from "react";

import GoogleLogin from "@leecheuk/react-google-login";
import { ShieldCheck, User, WarningCircle } from "@phosphor-icons/react";
import confetti from "canvas-confetti";
import ReactGA from "react-ga4";
import ForgotPasswordModal from "./ForgotPasswordModal";
import { Trans } from "@lingui/macro";

export function Login({ socket }) {
  const { setUserInfo, UserInfo, setfollowingdata, darkmode } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const [opened, setOpened] = useState(false);
  const [googleloading, setgoogleloading] = useState(false);

  useEffect(() => {
    if (UserInfo) {
      navigate("/");
    }
  }, [UserInfo]);

  const handlelogin = async (e) => {
    setloading(true);
    seterror("");
    e.preventDefault();

    await LoginReq(Username, Password)
      .then(async (res) => {
        setUserInfo(res.data.user);
        localStorage.setItem("token", res.data.token);
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
          title: <Trans>Login Successful</Trans>,
          message: <Trans>Welcome back {res.data.user.username}</Trans>,
          autoClose: 3000,
        });
        await LoginStatus().then((resp) => {
          setfollowingdata(resp.data.userfollowingarr);
        });
      })
      .catch((err) => {
        if (err.response.status === 0) {
          seterror("Internal Server Error");
        } else {
          seterror(err.response.data);
        }
        setloading(false);
      });
  };
  const demologin = async () => {
    setloading(true);
    seterror("");

    await LoginReq("Demo", "demo123")
      .then(async (res) => {
        setUserInfo(res.data.user);
        localStorage.setItem("token", res.data.token);
        socket.emit("onlinestatus", {
          token: res.data.token,
        });
        ReactGA.event({
          category: "Button",
          action: "Regular_login",
          label: "Login",
        });
        showNotification({
          icon: <ShieldCheck size={18} />,
          title: <Trans>Login Successful</Trans>,
          message: <Trans>Welcome back {res.data.user.username}</Trans>,
          autoClose: 3000,
        });
        await LoginStatus().then((resp) => {
          setfollowingdata(resp.data.userfollowingarr);
        });
      })
      .catch((err) => {
        if (err.response.status === 0) {
          seterror("Internal Server Error");
        } else {
          seterror(err.response.data);
        }
        setloading(false);
      });
  };
  const googleSuccess = (resp) => {
    setgoogleloading(true);
    googleauth(
      resp.profileObj.name,
      resp.profileObj.email,
      resp.profileObj.imageUrl
    )
      .then(async (res) => {
        setUserInfo(res.data.user);
        localStorage.setItem("token", res.data.token);
        socket.emit("onlinestatus", {
          token: res.data.token,
        });

        navigate("/");
        if (res.data.type === "login") {
          ReactGA.event({
            category: "Button",
            action: "Google_login",
            label: "Login",
          });
          showNotification({
            icon: <ShieldCheck size={18} />,
            title: "Login Successful",
            message: <Trans>Welcome back {res.data.user.username}</Trans>,
            autoClose: 3000,
          });
          await LoginStatus().then((resp) => {
            setfollowingdata(resp.data.userfollowingarr);
          });
        } else if (res.data.type === "register") {
          ReactGA.event({
            category: "Button",
            action: "Google_account_register",
            label: "Register",
          });
          confetti({
            particleCount: 300,
            spread: 70,
            origin: { y: 0.6 },
          });

          showNotification({
            icon: <User size={18} />,
            title: <Trans>Register Successful</Trans>,
            message: <Trans>Welcome to momos {res.data.user.username}</Trans>,
            autoClose: 3000,
          });
        }
      })
      .catch((err) => {
        if (err.response.status === 0) {
          showNotification({
            icon: <WarningCircle size={18} />,
            color: "red",
            title: "Internal Server Error",
            autoClose: 4000,
          });
        } else {
          showNotification({
            icon: <WarningCircle size={18} />,
            color: "red",
            title: err.response.data,
            autoClose: 4000,
          });
        }
        setgoogleloading(false);
      });
  };
  return (
    <div style={{ height: "80vh" }}>
      <Container size={420} my={40}>
        <Title
          align="center"
          style={{
            color: darkmode ? "white" : "black",
          }}
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 700,
          })}
        >
          <Trans>Welcome to Momos</Trans>
        </Title>
        <Text color={"rgb(144, 146, 150)"} size="sm" align="center" mt={5}>
          <Trans>Do not have an account? </Trans>
          <Link
            style={{
              textDecoration: "none",
              color: darkmode ? "rgb(77, 171, 247)" : "#1c7ed6",
            }}
            to="/Register"
          >
            <span
              style={{
                paddingLeft: "2px",
              }}
            >
              <Trans>Register</Trans>
            </span>
          </Link>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="sm">
          <Text weight={"500"} color={"red"} size="sm">
            {error}
          </Text>

          <form
            onSubmit={(e) => {
              handlelogin(e);
            }}
          >
            <TextInput
              onChange={(e) => setUsername(e.target.value)}
              label=<Trans>Username</Trans>
              placeholder="Username"
              required
              autoComplete="username"
              value={Username}
            />
            <PasswordInput
              onChange={(e) => setPassword(e.target.value)}
              label=<Trans>Password</Trans>
              value={Password}
              placeholder="Password"
              required
              mt="md"
              autoComplete="current-password"
            />
            <Text
              style={{
                cursor: "pointer",
              }}
              pt={5}
              size="sm"
              color="blue"
              onClick={() => setOpened(true)}
            >
              <Trans>I forgot my password</Trans>
            </Text>
            <ForgotPasswordModal opened={opened} setOpened={setOpened} />
            <Button loading={loading} type="submit" fullWidth mt="lg">
              <Trans>Login</Trans>
            </Button>
          </form>

          <Divider
            style={{ marginTop: "15px" }}
            my="xs"
            label="OR"
            labelPosition="center"
          />

          <GoogleLogin
            clientId="933476491467-ou90tpjuc8gm4mbenn907d6jq4td1hkd.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button
                loading={googleloading}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                style={{ width: "100%" }}
                leftIcon={
                  <img
                    width={"15px"}
                    height={"15px"}
                    src={require("../../assests/googleicon.png")}
                    alt=""
                  />
                }
                variant="default"
                color="gray"
              >
                <Trans>Continue with Google</Trans>
              </Button>
            )}
            onSuccess={(res) => googleSuccess(res)}
            cookiePolicy={"single_host_origin"}
          />
          <Button
            style={{ marginTop: "15px" }}
            onClick={() => {
              setUsername("demo");

              setPassword("demo123");
              demologin();
            }}
            variant="default"
            color="gray"
            fullWidth
            mt="xl"
          >
            <Trans>Try Demo account</Trans>
          </Button>
        </Paper>
      </Container>
    </div>
  );
}
