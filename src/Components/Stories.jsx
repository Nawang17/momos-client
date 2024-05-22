import React, { useContext, useState } from "react";
import Stories from "react-insta-stories";
import { Flex, Text } from "@mantine/core";
import { AuthContext } from "../context/Auth";
import { useViewportSize } from "@mantine/hooks";
import { X } from "@phosphor-icons/react";
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
      url: "https://picsum.photos/200/300",
      duration: 5000,
      header: {
        heading: "berrybee",
        subheading: "Posted 14h ago",
        profileImage:
          "https://res.cloudinary.com/dwzjfylgh/image/upload/v1712801791/kqrvww4xuitbtmyz6zsh.jpg",
      },
    },
    {
      url: "https://picsum.photos/400/600",
      duration: 5000,
      header: {
        heading: "berrybee",
        subheading: "Posted 5h ago",
        profileImage:
          "https://res.cloudinary.com/dwzjfylgh/image/upload/v1712801791/kqrvww4xuitbtmyz6zsh.jpg",
      },
    },
    {
      url: "https://picsum.photos/800/1200",
      duration: 5000,
      header: {
        heading: "berrybee",
        subheading: "Posted 3h ago",
        profileImage:
          "https://res.cloudinary.com/dwzjfylgh/image/upload/v1712801791/kqrvww4xuitbtmyz6zsh.jpg",
      },
    },
    {
      url: "https://picsum.photos/500/700",
      duration: 5000,
      header: {
        heading: "berrybee",
        subheading: "Posted 10h ago",
        profileImage:
          "https://res.cloudinary.com/dwzjfylgh/image/upload/v1712801791/kqrvww4xuitbtmyz6zsh.jpg",
      },
    },
    {
      url: "https://picsum.photos/300/500",
      duration: 5000,
      header: {
        heading: "berrybee",
        subheading: "Posted 2d ago",
        profileImage:
          "https://res.cloudinary.com/dwzjfylgh/image/upload/v1712801791/kqrvww4xuitbtmyz6zsh.jpg",
      },
    },
    {
      url: "https://picsum.photos/600/800",
      duration: 5000,
      header: {
        heading: "berrybee",
        subheading: "Posted 6h ago",
        profileImage:
          "https://res.cloudinary.com/dwzjfylgh/image/upload/v1712801791/kqrvww4xuitbtmyz6zsh.jpg",
      },
    },
    {
      url: "https://picsum.photos/350/550",
      duration: 5000,
      header: {
        heading: "berrybee",
        subheading: "Posted 20h ago",
        profileImage:
          "https://res.cloudinary.com/dwzjfylgh/image/upload/v1712801791/kqrvww4xuitbtmyz6zsh.jpg",
      },
    },
    {
      url: "https://picsum.photos/700/1000",
      duration: 5000,
      header: {
        heading: "berrybee",
        subheading: "Posted 4h ago",
        profileImage:
          "https://res.cloudinary.com/dwzjfylgh/image/upload/v1712801791/kqrvww4xuitbtmyz6zsh.jpg",
      },
    },
    {
      url: "https://picsum.photos/450/650",
      duration: 5000,
      header: {
        heading: "berrybee",
        subheading: "Posted 15h ago",
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
            {width < 691 ? (
              <Stories
                stories={storiesData}
                defaultInterval={1500}
                width={"100%"}
                height="100%"
              />
            ) : (
              <Stories
                onAllStoriesEnd={() => {
                  setstoryMode(false);
                }}
                preventDefault={!storyMode}
                stories={storiesData}
                defaultInterval={1500}
                height="100%"
                header={() => {
                  return (
                    <div>
                      <Flex
                        align={"center"}
                        gap={200}
                        justify={"space-between"}
                      >
                        <Flex align={"center"} gap={10}>
                          {" "}
                          <img
                            src="https://res.cloudinary.com/dwzjfylgh/image/upload/v1712801791/kqrvww4xuitbtmyz6zsh.jpg"
                            alt=""
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "100%",
                            }}
                          />
                          <Flex direction={"column"}>
                            <Text color="white">berrybee</Text>
                            <Text color="dimmed" size={"10px"}>
                              Posted 3h ago
                            </Text>
                          </Flex>
                        </Flex>
                        <div
                          style={{
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setstoryMode(false);
                          }}
                        >
                          <X size={20} color="white" />
                        </div>
                      </Flex>
                    </div>
                  );
                }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StoriesMode;
