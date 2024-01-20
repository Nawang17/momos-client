import { AspectRatio, Text } from "@mantine/core";
import { Link } from "@phosphor-icons/react";
import React from "react";

const LinkPreview = ({ post, darkmode }) => {
  const extractVideoId = (text) => {
    // Define a regular expression to match YouTube video URLs
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;

    // Use the regular expression to find the video ID in the text
    const match = text?.match(youtubeRegex);

    // Check if a match is found and return the video ID
    return match && match[1];
  };
  const videoId = extractVideoId(post?.text);
  return (
    <>
      {!post?.image && !post?.gif && !post?.poll && videoId && (
        <div
          style={{
            margin: "0.5rem 1rem 0rem 1rem",
          }}
        >
          <AspectRatio ratio={16 / 9}>
            <iframe
              style={{
                border: 0,
                borderRadius: "4px",
              }}
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </AspectRatio>{" "}
        </div>
      )}

      {post.previewlink && !videoId && (
        <div
          style={{
            padding: "0rem 1rem",
          }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              //open link in new tab on click
              window.open(
                post?.text?.match(/https?:\/\/[^\s]+/)?.[0],
                "_blank"
              );
            }}
            style={{
              cursor: "pointer",
              border: darkmode ? "1px solid #2f3136" : "1px solid #e6ecf0",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: "0.5rem",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  paddingTop: "0.2rem",
                }}
              >
                <Link />
              </div>
              <div>
                {post?.previewlink?.url && (
                  <Text size={"14px"} color={"dimmed"}>
                    {post?.previewlink?.url
                      ? post?.previewlink?.url
                          .replace("https://", "")
                          .replace("http://", "")
                          .replace("www.", "")
                          .split(/[/?#]/)[0]
                      : ""}
                  </Text>
                )}

                {post?.previewlink?.title && (
                  <Text size={"14px"}> {post?.previewlink?.title}</Text>
                )}

                {post?.previewlink?.description && (
                  <Text color={"dimmed"} size={"14px"}>
                    {post?.previewlink?.description}
                  </Text>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LinkPreview;
