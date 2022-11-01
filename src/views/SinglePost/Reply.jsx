import React, { useContext, useState } from "react";
import { Button, Input, Text } from "@mantine/core";
import { ArrowCircleUp, PaperPlane } from "phosphor-react";
import { AuthContext } from "../../context/Auth";

const Reply = () => {
  const [reply, setReply] = useState("");
  const { UserInfo } = useContext(AuthContext);
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
        onChange={(e) => setReply(e.target.value)}
        style={{ width: "100%" }}
        placeholder=" Write a Reply"
        rightSection={
          reply && (
            <PaperPlane
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
