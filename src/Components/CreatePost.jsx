import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import CreatePostModal from "./CreatePostModal";
const CreatePost = ({ setHomePosts, UserInfo, darkmode }) => {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          padding: "1rem",
          backgroundColor: darkmode ? "#1A1B1E" : "white",

          borderRadius: "4px",
          marginBottom: "0.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
          }}
        >
          <img
            onClick={() => {
              navigate(`/${UserInfo?.username}`);
            }}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
            }}
            src={UserInfo.avatar}
            alt=""
          />

          <div
            onClick={() => setOpened(true)}
            className="createpostdiv"
            style={{
              width: "100%",
              cursor: "pointer",

              borderRadius: "18px",

              padding: "0.7rem",
              fontSize: "15px",
              backgroundColor: darkmode ? "#2A2B2E" : "#F0F2F5",
              color: "grey",
            }}
          >
            What's on your mind, {UserInfo.username}?
          </div>
        </div>
      </div>
      <CreatePostModal
        opened={opened}
        setOpened={setOpened}
        UserInfo={UserInfo}
      />
    </>
  );
};

export default CreatePost;
