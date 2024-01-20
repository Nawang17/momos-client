import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import CreatePostModal from "./CreatePostModal";
import { ActionIcon, Avatar, Flex, Indicator } from "@mantine/core";
import { Gif, ChartBarHorizontal } from "@phosphor-icons/react";
import { Trans } from "@lingui/macro";
const CreatePost = ({ UserInfo, darkmode, communityName, onlinelist }) => {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const [gif, setGif] = useState(false);
  const [poll, setPoll] = useState(false);
  return (
    <>
      <div
        className={
          darkmode ? "createpostmodalradiusdark" : "createpostmodalradius"
        }
        style={{
          padding: "1rem",
          backgroundColor: darkmode ? "#1A1B1E" : "white",
        }}
      >
        <Flex align="center" gap="0.5rem">
          <Avatar
            className="addPointer"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/${UserInfo?.username}`);
            }}
            size="40px"
            radius={"xl"}
            src={UserInfo.avatar}
          />

          <div
            onClick={() => setOpened(true)}
            className="createpostdiv"
            style={{
              width: "100%",
              cursor: "pointer",

              padding: "0.7rem",
              fontSize: "15px",
              backgroundColor: darkmode ? "#1A1B1E" : "white",
              color: "grey",
            }}
          >
            <Trans>What's on your mind, {UserInfo.username}?</Trans>
          </div>
          <Flex align="center" gap="0.5rem">
            <ActionIcon
              onClick={() => {
                setGif(true);
                setOpened(true);
              }}
            >
              <Gif weight="fill" size={30} color="grey" />
            </ActionIcon>
            <ActionIcon
              onClick={() => {
                setPoll(true);
                setOpened(true);
              }}
            >
              <ChartBarHorizontal size={30} color="grey" />
            </ActionIcon>
          </Flex>
        </Flex>
      </div>
      <CreatePostModal
        gifOpen={gif}
        pollOpen={poll}
        opened={opened}
        setOpened={setOpened}
        UserInfo={UserInfo}
        communityName={communityName}
      />
    </>
  );
};

export default CreatePost;
