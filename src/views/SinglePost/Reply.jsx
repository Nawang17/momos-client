import React, { useContext, useState } from "react";
import { Button, Input, Text } from "@mantine/core";
import { Lightning, Lock, PaperPlane, WarningCircle } from "phosphor-react";
import { AuthContext } from "../../context/Auth";
import { addComment } from "../../api/POST";
import { showNotification } from "@mantine/notifications";
import NestedReplyModal from "../../Components/NestedReplyModal";

const Reply = ({
  singlePostData,
  setComments,
  sortcommentby,
  setsortcommentby,
  postUser,
}) => {
  const [reply, setReply] = useState("");
  const { UserInfo, darkmode } = useContext(AuthContext);
  const [opened, setOpened] = useState(false);
  const handlereply = () => {
    if (!UserInfo) {
      showNotification({
        icon: <Lock size={18} />,
        color: "red",
        title: "Login required",
        autoClose: 3000,
      });
      setReply("");
      return;
    } else {
      setReply("");
      addComment({ text: reply, postid: singlePostData?.id })
        .then((res) => {
          setComments((prev) => [...prev, res.data.comment]);
          showNotification({
            icon: <Lightning size={18} />,
            title: "Reply added",
            autoClose: 3000,
            color: "green",
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
        });
    }
  };

  return (
    <div
      style={{
        backgroundColor: darkmode ? "#1A1B1E" : "white",
        color: darkmode ? "white" : "black",
        padding: "1rem",
        borderTop: darkmode ? "1px solid #2f3136" : "1px solid #e6e6e6",
      }}
    >
      <Text
        style={{
          userSelect: "none",
        }}
        size={"15px"}
        weight={700}
      >
        Comments
      </Text>
      <div
        style={{
          display: "flex",
          gap: "0.3rem",
          margin: "1rem 0rem 1.5rem 0rem",
        }}
      >
        <Button
          onClick={() => {
            setsortcommentby("Top");
          }}
          variant={sortcommentby === "Top" ? "filled" : "subtle"}
          size="xs"
          radius={"xl"}
          color={"gray"}
        >
          Top
        </Button>
        <Button
          onClick={() => {
            setsortcommentby("Latest");
          }}
          variant={sortcommentby === "Latest" ? "filled" : "subtle"}
          size="xs"
          radius={"xl"}
          color={"gray"}
        >
          Latest
        </Button>
        <Button
          onClick={() => {
            setsortcommentby("Oldest");
          }}
          variant={sortcommentby === "Oldest" ? "filled" : "subtle"}
          size="xs"
          radius={"xl"}
          color={"gray"}
        >
          Oldest
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          backgroundColor: darkmode ? "#1A1B1E" : "white",
          color: darkmode ? "white" : "black",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <img
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          src={
            UserInfo?.avatar
              ? UserInfo.avatar
              : "https://res.cloudinary.com/dwzjfylgh/image/upload/v1650822495/jbnmm5pv4eavhhj8jufu.jpg"
          }
          alt=""
        />
        <Input
          component="div"
          onClick={() => {
            if (!UserInfo) {
              showNotification({
                color: "red",
                icon: <Lock size={18} />,
                title: "Login required",
                autoClose: 3000,
              });
            } else {
              setOpened(true);
            }
          }}
          style={{
            width: "100%",

            cursor: "pointer ",
          }}
        >
          Add a comment...
        </Input>
      </div>
      <NestedReplyModal
        setOpened={setOpened}
        opened={opened}
        UserInfo={UserInfo}
        setComments={setComments}
        postUser={postUser}
      />
    </div>
  );
};

export default Reply;
