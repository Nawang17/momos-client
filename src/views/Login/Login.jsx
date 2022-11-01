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
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { LoginReq } from "../../api/AUTH";
import { showNotification } from "@mantine/notifications";
import { AuthContext } from "../../context/Auth";
import { useNavigate } from "react-router-dom";
import { likedPosts } from "../../api/GET";

export function Login() {
  const { setUserInfo, setLikedpostIds } = useContext(AuthContext);
  const navigate = useNavigate();
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const [stayloggedin, setstayloggedin] = useState(false);
  const handlelogin = (e) => {
    setloading(true);
    seterror("");
    e.preventDefault();

    LoginReq(Username, Password, stayloggedin)
      .then((res) => {
        setUserInfo(res.data.user);
        localStorage.setItem("token", res.data.token);
        likedPosts().then((res) => {
          setLikedpostIds(res.data.likedposts);
        });
        navigate("/");

        showNotification({
          title: "Login Successful",
          message: `Welcome back to momos, ${res.data.user.username}!`,
          autoClose: 5000,
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
            />
            <PasswordInput
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
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
        </Paper>
      </Container>
    </div>
  );
}
