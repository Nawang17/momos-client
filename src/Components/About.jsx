import { ActionIcon, Container, createStyles, List, Text } from "@mantine/core";
import { ArrowLeft } from "@phosphor-icons/react";
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
  const socialNetworkRules = [
    "No Hate Speech: Users must not post content that promotes discrimination, hate speech, or harm towards others based on attributes such as race, religion, gender, or sexual orientation.",
    "No Harassment: Users are prohibited from engaging in bullying, harassment, or any form of threatening behavior towards other users.",
    "Respect Privacy: Users should respect the privacy of others and refrain from sharing personal information without explicit consent.",
    "No Spamming: Users must not flood the platform with irrelevant or excessive content.",
    "No Explicit Content: Posting or sharing explicit or adult content is strictly forbidden.",

    "No Misinformation: Users should not spread false information or engage in deliberate misinformation.",
    "Civility in Discussions: Users are expected to engage in respectful and constructive discussions, avoiding personal attacks or offensive language.",
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
            around the world. I built this project to learn more about full
            stack development and to improve my skills as a developer. The
            project is still in development and new features are being added
            regularly.
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
            style={{ marginTop: "1rem", padding: 10 }}
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
              target="_blank"
              style={{
                color: darkmode ? "#4dabf7" : "#1c7ed6",
              }}
              href="https://github.com/Nawang17/momos-client"
              rel="noreferrer"
            >
              https://github.com/Nawang17/momos-client
            </a>{" "}
          </Text>
          <Text
            color={darkmode ? "#a6a7ab" : "#343a40"}
            style={{ marginTop: "1rem" }}
          >
            Server:{" "}
            <a
              target="_blank"
              style={{
                color: darkmode ? "#4dabf7" : "#1c7ed6",
              }}
              href="https://github.com/Nawang17/momos-server"
              rel="noreferrer"
            >
              https://github.com/Nawang17/momos-server
            </a>
          </Text>

          <Text
            style={{ marginTop: "1rem" }}
            color={darkmode ? "white" : "black"}
            size={"26px"}
            weight={600}
          >
            ⭐ Rules
          </Text>
          <Text
            color={darkmode ? "#a6a7ab" : "#343a40"}
            style={{ marginTop: "1rem" }}
          >
            <List>
              {socialNetworkRules.map((rules, key) => (
                <Text
                  style={{
                    paddingTop: "10px",
                  }}
                  key={key}
                  color={darkmode ? "#a6a7ab" : "#343a40"}
                >
                  {key + 1}
                  {". "}
                  <span style={{ fontWeight: 700 }}>{rules.split(":")[0]}</span>
                  : {rules.split(":")[1]}
                </Text>
              ))}
            </List>
          </Text>
          <Text
            style={{ marginTop: "1rem" }}
            color={darkmode ? "white" : "black"}
            size={"26px"}
            weight={600}
          >
            Other links
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
          <Text
            color={darkmode ? "#a6a7ab" : "#343a40"}
            style={{ marginTop: "1rem" }}
          >
            Discord Server -{" "}
            <a
              target="_blank"
              style={{
                color: darkmode ? "#4dabf7" : "#1c7ed6",
              }}
              href="  https://discord.com/invite/n32dAAcCJY"
              rel="noreferrer"
            >
              https://discord.com/invite/n32dAAcCJY
            </a>
          </Text>
        </div>
      </div>

      <Sidebar />
    </Container>
  );
};
