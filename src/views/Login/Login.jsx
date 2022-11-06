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
// import GoogleLogin from "react-google-login";

export function Login() {
  const { setUserInfo, setLikedpostIds, setfollowingdata } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const [stayloggedin, setstayloggedin] = useState(false);
  const handlelogin = async (e) => {
    setloading(true);
    seterror("");
    e.preventDefault();

    await LoginReq(Username, Password, stayloggedin)
      .then(async (res) => {
        setUserInfo(res.data.user);
        localStorage.setItem("token", res.data.token);
        await likedPosts().then((res) => {
          setLikedpostIds(res.data.likedposts);
        });
        navigate("/");

        showNotification({
          title: "Login Successful",
          message: `Welcome back to momos, ${res.data.user.username}`,
          autoClose: 5000,
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

    await LoginReq("Demo", "demo", stayloggedin)
      .then(async (res) => {
        setUserInfo(res.data.user);
        localStorage.setItem("token", res.data.token);
        await likedPosts().then((res) => {
          setLikedpostIds(res.data.likedposts);
        });
        navigate("/");

        showNotification({
          title: "Login Successful",
          message: `Welcome back to momos, ${res.data.user.username}`,
          autoClose: 5000,
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
    GLoginReq(resp.profileObj.name, resp.profileObj.email)
      .then((res) => {
        setUserInfo(res.data.user);
        localStorage.setItem("token", res.data.token);
        likedPosts().then((res) => {
          setLikedpostIds(res.data.likedposts);
        });
        navigate("/");

        showNotification({
          title: "Login Successful",
          message: `Welcome back to momos, ${res.data.user.username}`,
          autoClose: 5000,
        });
        LoginStatus().then((resp) => {
          setfollowingdata(resp.data.userfollowingarr);
        });
      })
      .catch((err) => {
        if (err.response.status === 0) {
          showNotification({
            color: "red",
            title: "Internal Server Error",

            autoClose: 7000,
          });
        } else {
          showNotification({
            color: "red",
            title: err.response.data,
            autoClose: 7000,
          });
        }
      });
  };
  return (
    <div style={{ height: "80vh" }}>
      <Container size={420} my={40}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Welcome back!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Do not have an account yet?{" "}
          <Link
            style={{ textDecoration: "none", color: "#1c7ed6" }}
            to="/Register"
          >
            <span>Create account</span>
          </Link>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
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
            <Group position="apart" mt="md">
              <Checkbox
                checked={stayloggedin}
                onChange={(e) => {
                  setstayloggedin(e.target.checked);
                }}
                label="Stay logged in"
              />
            </Group>

            <Button disabled={loading} type="submit" fullWidth mt="xl">
              Login
            </Button>
          </form>

          <Divider
            style={{ marginTop: "15px" }}
            my="xs"
            label="OR"
            labelPosition="center"
          />
          <Button
            variant="outline"
            onClick={() => {
              setPassword("demo");
              setUsername("Demo");
              demologin();
            }}
            disabled={loading}
            fullWidth
            mt="xl"
          >
            Try Demo account
          </Button>
          {/* <GoogleLogin
            clientId="933476491467-ou90tpjuc8gm4mbenn907d6jq4td1hkd.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button
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
          /> */}
        </Paper>
      </Container>
    </div>
  );
}
