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
import { GRegisterReq, RegisterReq } from "../../api/AUTH";
import { showNotification } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { AuthContext } from "../../context/Auth";
// import { GoogleLogin } from "react-google-login";

export function Register() {
  const navigate = useNavigate();
  const { setUserInfo, UserInfo } = useContext(AuthContext);
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  useEffect(() => {
    if (UserInfo) {
      navigate("/");
    }
  }, []);
  const handleRegister = (e) => {
    setloading(true);
    seterror("");
    e.preventDefault();
    RegisterReq(Username, Password)
      .then((res) => {
        setUserInfo(res.data.user);
        localStorage.setItem("token", res.data.token);
        navigate("/");
        confetti({
          particleCount: 300,
          spread: 70,
          origin: { y: 0.6 },
        });

        showNotification({
          title: "Register Successful",
          message: `Welcome to momos ${res.data.user.username} `,
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
  const googleSuccess = (resp) => {
    GRegisterReq(
      resp.profileObj.name,
      resp.profileObj.email,
      resp.profileObj.imageUrl
    )
      .then((res) => {
        setUserInfo(res.data.user);
        localStorage.setItem("token", res.data.token);
        navigate("/");
        confetti({
          particleCount: 300,
          spread: 70,
          origin: { y: 0.6 },
        });

        showNotification({
          title: "Register Successful",
          message: `Welcome to momos ${res.data.user.username} `,
          autoClose: 5000,
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
            fontWeight: 700,
          })}
        >
          Welcome to Momos 🥟
        </Title>
        <Text size="sm" align="center" mt={5}>
          Already have an account?{" "}
          <Link
            style={{ textDecoration: "none", color: "#1c7ed6" }}
            to="/Login"
          >
            <span>Login</span>
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
          {/* <Divider
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
          </div> */}
        </Paper>
      </Container>
    </div>
  );
}
