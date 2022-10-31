import { useState } from "react";
import "../App.css";
import CreatePostModal from "./CreatePostModal";
const CreatePost = ({ setHomePosts, UserInfo }) => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <div
        style={{
          padding: "1rem",
          background: "white",
          marginBottom: "0.5rem",
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
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
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
