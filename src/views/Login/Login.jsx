import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Checkbox,
  Group,
  Divider,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { GLoginReq, LoginReq, LoginStatus } from "../../api/AUTH";
import { showNotification } from "@mantine/notifications";
import { AuthContext } from "../../context/Auth";
import { useNavigate } from "react-router-dom";
import { likedPosts } from "../../api/GET";
import { useEffect } from "react";
import GoogleLogin from "@leecheuk/react-google-login";
import { ShieldCheck, WarningCircle } from "phosphor-react";

export function Login() {
  const { setUserInfo, UserInfo, setLikedpostIds, setfollowingdata, darkmode } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");

  const [googleloading, setgoogleloading] = useState(false);

  useEffect(() => {
    if (UserInfo) {
      navigate("/");
    }
  }, []);
  const handlelogin = async (e) => {
    setloading(true);
    seterror("");
    e.preventDefault();

    await LoginReq(Username, Password)
      .then(async (res) => {
        setUserInfo(res.data.user);
        localStorage.setItem("token", res.data.token);
        await likedPosts().then((res) => {
          setLikedpostIds(res.data.likedposts);
        });
        navigate("/");

        showNotification({
          icon: <ShieldCheck size={18} />,
          title: "Login Successful",
          message: `Welcome back ${res.data.user.username}`,
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

    await LoginReq("Demo", "demo")
      .then(async (res) => {
        setUserInfo(res.data.user);
        localStorage.setItem("token", res.data.token);
        await likedPosts().then((res) => {
          setLikedpostIds(res.data.likedposts);
        });
        navigate("/");

        showNotification({
          icon: <ShieldCheck size={18} />,
          title: "Login Successful",
          message: `Welcome back ${res.data.user.username}`,
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
    GLoginReq(resp.profileObj.name, resp.profileObj.email)
      .then(async (res) => {
        setUserInfo(res.data.user);
        localStorage.setItem("token", res.data.token);
        await likedPosts().then((res) => {
          setLikedpostIds(res.data.likedposts);
        });
        navigate("/");
        showNotification({
          icon: <ShieldCheck size={18} />,
          title: "Login Successful",
          message: `Welcome back ${res.data.user.username}`,
          autoClose: 3000,
        });
        await LoginStatus().then((resp) => {
          setfollowingdata(resp.data.userfollowingarr);
        });
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
          Welcome to Momos
        </Title>
        <Text color={"rgb(144, 146, 150)"} size="sm" align="center" mt={5}>
          Do not have an account?{" "}
          <Link
            style={{
              textDecoration: "none",
              color: darkmode ? "rgb(77, 171, 247)" : "#1c7ed6",
            }}
            to="/Register"
          >
            <span>Register</span>
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
              label="Username"
              placeholder="Username"
              required
              autoComplete="username"
              value={Username}
            />
            <PasswordInput
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              value={Password}
              placeholder="Password"
              required
              mt="md"
              autoComplete="current-password"
            />

            <Button loading={loading} type="submit" fullWidth mt="xl">
              Login
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
                Continue with Google
              </Button>
            )}
            onSuccess={(res) => googleSuccess(res)}
            onFailure={(res) => console.log(res)}
            cookiePolicy={"single_host_origin"}
          />
          <Button
            style={{ marginTop: "15px" }}
            onClick={() => {
              setPassword("demo");
              setUsername("Demo");
              demologin();
            }}
            variant="default"
            color="gray"
            fullWidth
            mt="xl"
          >
            Try Demo account
          </Button>
        </Paper>
      </Container>
    </div>
  );
}
