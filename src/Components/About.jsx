import { ActionIcon, Container, createStyles, List, Text } from "@mantine/core";
import { ArrowLeft } from "phosphor-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../Components/Sidebar";
import { AuthContext } from "../context/Auth";
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

export const About = () => {
  const { classes } = useStyles();
  const { darkmode } = useContext(AuthContext);
  const navigate = useNavigate();
  const features = [
    "Create posts with text and images",
    "Like and comment on posts",
    "Like comments and reply to them",
    "Chat with other users in real time",
    "Mention users in posts and comments",
    "Quote other posts",
    "Search for users and posts",
    "Sort posts and comments by date or popularity",
    "Follow other users",
    "Customize profile with profile picture and description",
    "Receive notifications for likes, comments, and new followers",
    "Authenticate using Google or normal login with username and password",
    "Leaderboard system based on total points, where users can compete to reach the top",
    "Earn points by creating new posts, receiving likes, and gaining new followers",
  ];

  return (
    <Container px={0} className={classes.wrapper}>
      <div className={classes.leftWrapper}>
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
            padding: "1rem 0rem 0rem 1rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <ActionIcon onClick={() => navigate(-1)}>
            <ArrowLeft size="20px" />
          </ActionIcon>
        </div>
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            padding: "1rem",
          }}
        >
          <Text size={"44px"} weight={900} color={darkmode ? "white" : "black"}>
            About momos
          </Text>
          <Text
            color={darkmode ? "#a6a7ab" : "#343a40"}
            style={{ marginTop: "1rem" }}
          >
            Momos is a social network webapp where you can connect with people
            around the world.
          </Text>
          <Text
            color={darkmode ? "#a6a7ab" : "#343a40"}
            style={{ marginTop: "1rem" }}
          >
            As a developer, I am always looking for new ways to improve my
            skills and push the boundaries of what is possible. Building Momos
            has been a challenging and rewarding experience, as it has allowed
            me to learn new technologies and improve my full stack development
            skills.
          </Text>
          <Text
            style={{ marginTop: "1rem" }}
            color={darkmode ? "white" : "black"}
            size={"26px"}
            weight={600}
          >
            👨‍💻 Technologies
          </Text>

          <Text
            color={darkmode ? "#a6a7ab" : "#343a40"}
            style={{ marginTop: "1rem" }}
          >
            <List>
              <List.Item>Client - React, Mantine</List.Item>
              <List.Item>Server - Nodejs, Express, Socket.IO </List.Item>
              <List.Item>Database - MYSQL, Cloudinary </List.Item>
              <List.Item>Deployment - Netlify, Render </List.Item>
            </List>
          </Text>
          <Text
            style={{ marginTop: "1rem" }}
            color={darkmode ? "white" : "black"}
            size={"26px"}
            weight={600}
          >
            ⭐ Features
          </Text>

          <Text
            color={darkmode ? "#a6a7ab" : "#343a40"}
            style={{ marginTop: "1rem" }}
          >
            <List>
              {features.map((feature, key) => (
                <List.Item key={key}>{feature}</List.Item>
              ))}
            </List>
          </Text>
          <Text
            style={{ marginTop: "1rem" }}
            color={darkmode ? "white" : "black"}
            size={"26px"}
            weight={600}
          >
            🔗 Github repository
          </Text>
          <Text
            color={darkmode ? "#a6a7ab" : "#343a40"}
            style={{ marginTop: "1rem" }}
          >
            Please note that this project is for educational purposes and may
            have bugs or unfinished features. If you encounter any issues or
            have any suggestions, please feel free to reach out or submit a pull
            request.
          </Text>

          <Text
            color={darkmode ? "#a6a7ab" : "#343a40"}
            style={{ marginTop: "1rem" }}
          >
            Client:{" "}
            <a
              style={{
                color: darkmode ? "#4dabf7" : "#1c7ed6",
              }}
              href="https://github.com/Nawang17/client-momo"
            >
              https://github.com/Nawang17/client-momo
            </a>{" "}
          </Text>
          <Text
            color={darkmode ? "#a6a7ab" : "#343a40"}
            style={{ marginTop: "1rem" }}
          >
            Server:{" "}
            <a
              style={{
                color: darkmode ? "#4dabf7" : "#1c7ed6",
              }}
              href="https://github.com/Nawang17/momos-backend"
            >
              https://github.com/Nawang17/momos-backend
            </a>{" "}
            (Private until project is complete)
          </Text>
          <Text
            color={darkmode ? "#a6a7ab" : "#343a40"}
            style={{ marginTop: "1rem" }}
          >
            Discord -{" "}
            <span
              style={{
                color: darkmode ? "#4dabf7" : "#1c7ed6",
              }}
            >
              katoph#1868
            </span>{" "}
            (feel free to reach out)
          </Text>
        </div>
      </div>

      <Sidebar />
    </Container>
  );
};
