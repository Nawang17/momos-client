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
import { useState, useContext, useEffect } from "react";
import { googleauth, LoginStatus, RegisterReq } from "../../api/AUTH";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { AuthContext } from "../../context/Auth";
import GoogleLogin from "@leecheuk/react-google-login";
import { ShieldCheck, User, WarningCircle } from "@phosphor-icons/react";
import ReactGA from "react-ga4";
import { Trans } from "@lingui/macro";

export function Register({ socket }) {
  const navigate = useNavigate();
  const { setUserInfo, UserInfo, darkmode, setfollowingdata } =
    useContext(AuthContext);
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const [googleloading, setgoogleloading] = useState(false);
  useEffect(() => {
    if (UserInfo) {
      navigate("/");
    }
  }, [UserInfo]);
  const handleRegister = (e) => {
    setloading(true);
    seterror("");
    e.preventDefault();
    RegisterReq(Username, Password, email)
      .then((res) => {
        setUserInfo(res.data.user);
        localStorage.setItem("token", res.data.token);
        socket.emit("onlinestatus", {
          token: res.data.token,
        });
        ReactGA.event({
          category: "Button",
          action: "Regular_account_register",
          label: "Register",
        });
        confetti({
          particleCount: 300,
          spread: 70,
          origin: { y: 0.6 },
        });

        showNotification({
          icon: <User size={18} />,
          title: "Register Successful",
          message: <Trans>Welcome to momos {res.data.user.username}</Trans>,
          autoClose: 3000,
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
            action: "Google_account_login",
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
            title: "Register Successful",
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
          style={{
            color: darkmode ? "white" : "black",
          }}
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 700,
          })}
        >
          <Trans>Welcome to Momos</Trans>
        </Title>
        <Text color={"rgb(144, 146, 150)"} size="sm" align="center" mt={5}>
          <Trans>Already have an account?</Trans>
          <Link
            style={{
              textDecoration: "none",
              color: darkmode ? "rgb(77, 171, 247)" : "#1c7ed6",
            }}
            to="/Login"
          >
            <span
              style={{
                paddingLeft: "2px",
              }}
            >
              <Trans>Login</Trans>
            </span>
          </Link>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="sm">
          <Text weight={"500"} color={"red"} size="sm">
            {error}
          </Text>
          <form onSubmit={(e) => handleRegister(e)}>
            <TextInput
              onChange={(e) => setEmail(e.target.value)}
              label=<Trans>Email (optional)</Trans>
              placeholder="you@youremail.com"
              value={email}
            />
            <Text pt={1} size={13} color="dimmed">
              <Trans>Never shown to the public</Trans>
            </Text>
            <TextInput
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
              label=<Trans>Username</Trans>
              placeholder="Username"
              required
              mt="xs"
            />
            <Text pt={1} size={13} color="dimmed">
              <Trans>Unique, no spaces, short</Trans>
            </Text>
            <PasswordInput
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Password"
              required
              mt="xs"
            />
            <Text pt={1} size={13} color="dimmed">
              <Trans>At least 6 characters</Trans>
            </Text>

            <Button loading={loading} type="submit" fullWidth mt="xl">
              <Trans>Register</Trans>
            </Button>
          </form>
          <Divider
            style={{ marginTop: "15px" }}
            my="xs"
            label="OR"
            labelPosition="center"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "15px",
            }}
          >
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
          </div>
        </Paper>
      </Container>
    </div>
  );
}
