import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import CreatePostModal from "./CreatePostModal";
const CreatePost = ({ setHomePosts, UserInfo }) => {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          padding: "1rem",
          background: "white",
          borderRadius: "4px",
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
              color: "#666",
              fontSize: "15px",
            }}
          >
            What's on your mind, {UserInfo.username}?
          </div>
        </div>
      </div>
      <CreatePostModal
        setHomePosts={setHomePosts}
        opened={opened}
        setOpened={setOpened}
        UserInfo={UserInfo}
      />
    </>
  );
};

export default CreatePost;
