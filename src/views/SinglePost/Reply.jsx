import React, { useContext, useState } from "react";
import { Input } from "@mantine/core";
import { PaperPlane } from "phosphor-react";
import { AuthContext } from "../../context/Auth";
import { addComment } from "../../api/POST";
import { showNotification } from "@mantine/notifications";

const Reply = ({ singlePostData, setComments }) => {
  const [reply, setReply] = useState("");
  const { UserInfo } = useContext(AuthContext);
  const handlereply = () => {
    addComment({ text: reply, postid: singlePostData.id })
      .then((res) => {
        setReply("");
        setComments((prev) => [res.data.comment, ...prev]);
        showNotification({
          title: "Comment added",
          autoClose: 4000,
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
    <div
      style={{
        display: "flex",
        backgroundColor: "white",
        padding: "1rem",
        alignItems: "center",
        gap: "1rem",
        borderTop: "1px solid #e6e6e6",
        borderBottom: "1px solid #e6e6e6",
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
              color="blue"
              size={20}
              style={{ display: "block", opacity: 0.5 }}
            />
          )
        }
      />
    </div>
  );
};

export default Reply;
