import React, { useContext, useState } from "react";
import { Input } from "@mantine/core";
import { Lightning, Lock, PaperPlane, WarningCircle } from "phosphor-react";
import { AuthContext } from "../../context/Auth";
import { addComment } from "../../api/POST";
import { showNotification } from "@mantine/notifications";

const Reply = ({ singlePostData, setComments }) => {
  const [reply, setReply] = useState("");
  const { UserInfo, darkmode } = useContext(AuthContext);

  const handlereply = () => {
    if (!UserInfo) {
      showNotification({
        icon: <Lock size={18} />,
        color: "red",
        title: "Login required",
        autoClose: 3000,
      });
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
        display: "flex",
        backgroundColor: darkmode ? "#1A1B1E" : "white",
        color: darkmode ? "white" : "black",
        padding: "1rem",
        alignItems: "center",
        gap: "1rem",
        borderTop: darkmode ? "1px solid #2f3136" : "1px solid #e6e6e6",
        borderBottom: darkmode ? "1px solid #2f3136" : "1px solid #e6e6e6",
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
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        style={{ width: "100%" }}
        placeholder=" Write a Reply"
        rightSection={
          reply && (
            <PaperPlane
              onClick={() => handlereply()}
              weight="bold"
              color="#1DA1F2"
              size={22}
              style={{ display: "block", cursor: "pointer" }}
            />
          )
        }
      />
    </div>
  );
};

export default Reply;
