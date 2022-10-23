import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { LoginReq } from "../../api/AUTH";
import { showNotification } from "@mantine/notifications";
import { AuthContext } from "../../context/Auth";
import { useNavigate } from "react-router-dom";

export function Login() {
  const { setUserInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const handlelogin = (e) => {
    setloading(true);
    seterror("");
    e.preventDefault();

    LoginReq(Username, Password)
      .then((res) => {
        setUserInfo(res.data.user);
        localStorage.setItem("token", res.data.token);

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
            {/* <Group position="apart" mt="md">
              <Checkbox label="Remember me" />
              <Anchor
                onClick={(event) => event.preventDefault()}
                href="#"
                size="sm"
              >
                Forgot password?
              </Anchor>
            </Group> */}
            <Button disabled={loading} type="submit" fullWidth mt="xl">
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
