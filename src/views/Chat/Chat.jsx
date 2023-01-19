import {
  ActionIcon,
  Container,
  createStyles,
  Input,
  ScrollArea,
  Text,
} from "@mantine/core";
import { ArrowLeft, PaperPlaneRight } from "phosphor-react";
import { useEffect } from "react";
import { useState } from "react";
import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../Components/Sidebar";
import { AuthContext } from "../../context/Auth";
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

export const Chat = () => {
  const { classes } = useStyles();
  const { darkmode } = useContext(AuthContext);
  const navigate = useNavigate();
  const viewport = useRef(null);
  const scrollToBottom = () =>
    viewport.current.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "smooth",
    });
  const [text, setText] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "helllo wolrd",
      left: false,
    },
    {
      id: 2,
      message: "Lorem ipsum dolor sit amet consectetur, it culpa a.",
      left: false,
    },
    {
      id: 1,
      message:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, modi saepe. Consectetur, architecto accusamus eligendi est soluta asperiores provident aliquam modi, fugit quia veniam, doloribus officia ratione accusantium. Debitis, minus?",
      left: true,
    },
    {
      id: 1,
      message:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, modi saepe. Consectetur, architecto accusamus eligendi est soluta asperiores provident aliquam modi, fugit quia veniam, doloribus officia ratione accusantium. Debitis, minus?",
      left: false,
    },
    {
      id: 1,
      message:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, modi saepe. Consectetur, architecto accusamus eligendi est soluta asperiores provident aliquam modi, fugit quia veniam, doloribus officia ratione accusantium. Debitis, minus?",
      left: true,
    },
  ]);
  function randomTrueFalse() {
    var randomNumber = Math.random();
    if (randomNumber >= 0.5) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    scrollToBottom();
    window.scrollTo(0, 0);
  }, [messages]);
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

        <ScrollArea
          viewportRef={viewport}
          style={{
            height: "50vh",
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            // backgroundColor: "blue",
            color: darkmode ? "white" : "black",

            padding: "1.5rem 1.5rem 0rem 1.5rem",
          }}
        >
          {messages.map((message, id) => {
            return (
              <div key={id}>
                {message.left /* left side of chat */ ? (
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                      marginBottom: "1.5rem",
                      justifyContent: "flex-start",
                    }}
                  >
                    <img
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                      }}
                      src="https://res.cloudinary.com/dwzjfylgh/image/upload/v1668649391/i61rnqu93j32zmpgnbra.gif"
                      alt=""
                    />
                    <div>
                      <Text size={12} color={"dimmed"}>
                        katoph 11:56{" "}
                      </Text>
                      <div
                        style={{
                          backgroundColor: darkmode
                            ? "rgb(47, 51, 54)"
                            : "rgb(239, 243, 244)",
                          padding: "0.5rem",
                          borderRadius: "8px",
                        }}
                      >
                        <Text
                          align="left"
                          color={darkmode ? "white" : "#0F1419"}
                          size={14}
                        >
                          {message.message}
                        </Text>
                      </div>
                    </div>
                  </div> /* right side of chat */
                ) : (
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                      marginBottom: "1rem",
                      justifyContent: "flex-end",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          backgroundColor: "rgb(29, 155, 240)",
                          padding: "0.5rem",
                          borderRadius: "8px",
                        }}
                      >
                        <Text align="left" color="white" size={14}>
                          {message.message}
                        </Text>
                      </div>
                      <Text align="right" size={12} color={"dimmed"}>
                        11:56
                      </Text>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {/* {new Array(101).fill(0).map((_, index) => (
            <Text key={index} style={{ marginBottom: 10 }}>
              {index}
            </Text>
          ))} */}
        </ScrollArea>
        <div
          style={{
            padding: "1.5rem 1rem 1rem 1rem",
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            borderTop: darkmode ? "1px solid #2F3336" : "1px solid #E5E5E5",
          }}
        >
          <Input
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setText("");
                setMessages((prev) => [
                  ...prev,
                  {
                    id: 1,
                    message: text,
                    left: randomTrueFalse(),
                  },
                ]);
                e.target.blur();
              }
            }}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            variant="filled"
            placeholder="Send a message"
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "0.8rem",
              paddingTop: "0.8rem",
            }}
          >
            <Text size={12} color={darkmode ? "white" : "black"}>
              {" "}
              0 / 100
            </Text>
            <PaperPlaneRight
              onClick={() => {
                setText("");
                setMessages((prev) => [
                  ...prev,
                  {
                    id: 1,
                    message: text,
                    left: randomTrueFalse(),
                  },
                ]);
              }}
              type="submit"
              style={{
                cursor: "pointer",
              }}
              color={darkmode ? "white" : "black"}
              size={20}
            />
          </div>
        </div>
      </div>

      <Sidebar />
    </Container>
  );
};
