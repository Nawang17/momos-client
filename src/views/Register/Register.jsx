import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useState } from "react";
import { RegisterReq } from "../../api/AUTH";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
export function Register() {
  const navigate = useNavigate();

  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const handleRegister = (e) => {
    setloading(true);
    seterror("");
    e.preventDefault();
    RegisterReq(Username, Password)
      .then((res) => {
        navigate("/");
        confetti({
          particleCount: 300,
          spread: 70,
          origin: { y: 0.6 },
        });

        showNotification({
          title: "Register Successful",
          message: "Welcome to momos!",
          autoClose: 5000,
        });
      })
      .catch((err) => {
        seterror(err.response.data);
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
          Welcome to momos!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Already have an account?{" "}
          <Link style={{ textDecoration: "none" }} to="/Login">
            <Anchor size="sm">Login</Anchor>
          </Link>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Text weight={"500"} color={"red"} size="sm">
            {error}
          </Text>
          <form onSubmit={(e) => handleRegister(e)}>
            <TextInput
              onChange={(e) => setUsername(e.target.value)}
              label="Username"
              placeholder="Username"
              required
            />
            <PasswordInput
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Password"
              required
              mt="md"
            />

            <Button disabled={loading} type="submit" fullWidth mt="xl">
              Register
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
}
