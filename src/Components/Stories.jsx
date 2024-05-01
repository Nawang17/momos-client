import React, { useContext, useState } from "react";
import Stories from "react-insta-stories";
import { Flex, Text } from "@mantine/core";
import { AuthContext } from "../context/Auth";
import { useViewportSize } from "@mantine/hooks";
const StoriesMode = () => {
  const { darkmode } = useContext(AuthContext);
  const [storyMode, setstoryMode] = useState(false);
  const storiesData = [
    {
      url: "https://res.cloudinary.com/dwzjfylgh/image/upload/v1713674230/wz42vm1ze8xfmzw39et7.jpg",
      duration: 5000,
      header: {
        heading: "berrybee",
        subheading: "Posted 1d ago",
        profileImage:
          "https://res.cloudinary.com/dwzjfylgh/image/upload/v1712801791/kqrvww4xuitbtmyz6zsh.jpg",
      },
    },
    {
      url: "https://res.cloudinary.com/dwzjfylgh/image/upload/v1714012548/bvpz1w8tiduldcdxfegw.jpg",
      duration: 5000,
      header: {
        heading: "berrybee",
        subheading: "Posted 14h ago",
        profileImage:
          "https://res.cloudinary.com/dwzjfylgh/image/upload/v1712801791/kqrvww4xuitbtmyz6zsh.jpg",
      },
    },
    {
      url: "https://res.cloudinary.com/dwzjfylgh/image/upload/v1713460207/ukgnnhzvhtkxf7ohgxj5.jpg",
      duration: 5000,
      header: {
        heading: "berrybee",
        subheading: "Posted 5h ago",
        profileImage:
          "https://res.cloudinary.com/dwzjfylgh/image/upload/v1712801791/kqrvww4xuitbtmyz6zsh.jpg",
      },
    },
    {
      url: "https://res.cloudinary.com/dwzjfylgh/image/upload/v1713026613/ahnlaij3j17osgrrq3ib.jpg",
      duration: 5000,
      header: {
        heading: "berrybee",
        subheading: "Posted 3h ago",
        profileImage:
          "https://res.cloudinary.com/dwzjfylgh/image/upload/v1712801791/kqrvww4xuitbtmyz6zsh.jpg",
      },
    },
    {
      url: "https://res.cloudinary.com/dwzjfylgh/video/upload/v1668627162/pvpyslmmynzyqyzs9mne.mov",
      duration: 5000,
      type: "video",
      header: {
        heading: "berrybee",
        subheading: "Posted 30m ago",
        profileImage:
          "https://res.cloudinary.com/dwzjfylgh/image/upload/v1712801791/kqrvww4xuitbtmyz6zsh.jpg",
      },
    },
  ];
  const { height, width } = useViewportSize();
  return (
    <>
      {" "}
      <div
        style={{
          color: "white",
          padding: "1rem 0.5rem",
          backgroundColor: darkmode ? "#1A1B1E" : "white",
          marginBottom: "0.5rem ",
        }}
      >
        <Text mb="20px" weight={"600"}>
          Stories
        </Text>
        <Flex gap={15}>
          {new Array(1).fill(0).map(() => {
            return (
              <Flex
                onClick={() => {
                  setstoryMode(true);
                }}
                style={{
                  cursor: "pointer",
                }}
                direction={"column"}
                align={"center"}
                gap={10}
              >
                <img
                  src="https://res.cloudinary.com/dwzjfylgh/image/upload/v1712801791/kqrvww4xuitbtmyz6zsh.jpg"
                  style={{
                    width: "65px",
                    height: "65px",
                    borderRadius: "100%",
                  }}
                />
                <Text>berrybee</Text>
              </Flex>
            );
          })}
        </Flex>
      </div>
      {storyMode && (
        <div className="backdrop">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Stories
              stories={storiesData}
              defaultInterval={1500}
              width={width < 691 && "100%"}
              height="100%"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StoriesMode;
