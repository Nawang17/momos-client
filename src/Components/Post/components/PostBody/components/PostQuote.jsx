import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Topuserbadge from "../../../../../helper/Topuserbadge";
import { AspectRatio, Avatar, Flex, Indicator, Text } from "@mantine/core";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import locale from "date-fns/locale/en-US";
import Verifiedbadge from "../../../../../helper/VerifiedBadge";
import { formatDistance } from "../../../../../helper/DateFormat";
import { useContext } from "react";
import { AuthContext } from "../../../../../context/Auth";
import { Trans } from "@lingui/macro";
const PostQuote = ({ post }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { darkmode, onlineusers, topUser } = useContext(AuthContext);
  const extractVideoId = (text) => {
    // Define a regular expression to match YouTube video URLs
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;

    // Use the regular expression to find the video ID in the text
    const match = text?.match(youtubeRegex);

    // Check if a match is found and return the video ID
    return match && match[1];
  };
  const videoId = extractVideoId(post?.post?.text);
  return (
    <>
      {/* if post has quote show this */}
      {post.hasquote && post.post && (
        <div
          style={{
            padding: "0rem 1rem",
          }}
        >
          <Flex
            className="addPointer"
            direction="column"
            gap="0.5rem"
            pb={
              !post?.post?.image && !post?.post?.gif && !videoId
                ? "0.7rem"
                : "0"
            }
            style={{
              fontSize: "0.9rem",
              border: darkmode ? "1px solid #2f3136" : "1px solid #e6ecf0",
              borderRadius: "0.5rem",
            }}
            onClick={() => {
              if (
                pathname?.substring(0, pathname?.indexOf("/", 1)) ===
                  "/community" ||
                post?.community?.name
              ) {
                navigate(`/communitypost/${post?.post?.id}`);
              } else {
                navigate(`/post/${post?.post?.id}`);
              }
            }}
          >
            {/* user info header */}
            <Flex gap="0.3rem" align="center" p="0.7rem 0.7rem 0 0.7rem">
              {/* user avatar */}
              <Indicator
                disabled={!onlineusers.includes(post?.post?.user?.id)}
                withBorder
                inline
                color="green"
                size={5}
                offset={3}
                position="bottom-end"
              >
                <Avatar
                  size="18px"
                  radius={"xl"}
                  src={post?.post.user?.avatar}
                />
              </Indicator>

              <Flex align="center" gap="0.2rem">
                {/* username */}
                <Text size="15px" weight={500}>
                  {post?.post.user?.username}
                </Text>
                {/* show verified badge if verified */}
                {post?.post?.user?.verified && <Verifiedbadge />}
                {/* show top badge if most top user */}
                {topUser === post?.post?.user?.username && <Topuserbadge />}
              </Flex>
              <Text color={"dimmed"}>·</Text>
              {/* quoted post date */}
              <Text color={"dimmed"}>
                {formatDistanceToNowStrict(new Date(post?.post?.createdAt), {
                  locale: {
                    ...locale,
                    formatDistance,
                  },
                })}
              </Text>
            </Flex>
            {/* if quoted post has text show this */}
            {post?.post?.text && (
              <Text
                size="15px"
                style={{
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  padding: "0 0.7rem 0 0.7rem",
                }}
              >
                {post?.post.text}
              </Text>
            )}

            {/* if quoted post has media show this */}

            {post?.post?.image && (
              <>
                {/* if media is an image */}
                {post?.post.filetype === "image" ? (
                  <img
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "0 0 0.5rem 0.5rem",
                    }}
                    loading="lazy"
                    src={post?.post?.image}
                    alt=""
                  />
                ) : (
                  // if media is a video
                  <video
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    // video thumbnail
                    poster={post?.post?.image.slice(0, -3) + "jpg"}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "0 0 0.5rem 0.5rem",
                    }}
                    controls
                  >
                    <source src={post?.post?.image} type="video/mp4" />
                    <Trans>Your browser does not support the video tag.</Trans>
                  </video>
                )}
              </>
            )}

            {/* if quoted post has gif show this */}

            {post?.post?.gif && (
              <>
                <img
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "0 0 0.5rem 0.5rem",
                  }}
                  loading="lazy"
                  src={post?.post.gif}
                  alt=""
                />
              </>
            )}
            {!post?.post?.gif &&
              !post?.post?.image &&
              !post?.post?.poll &&
              videoId && (
                <AspectRatio ratio={16 / 9}>
                  <iframe
                    style={{
                      border: 0,
                      borderRadius: "0 0 0.5rem 0.5rem",
                    }}
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </AspectRatio>
              )}
          </Flex>
        </div>
      )}

      {/* if post had quote but the qouted post got deleted show this */}
      {post.hasquote && !post.post && (
        <div
          style={{
            padding: "0rem 1rem",
          }}
        >
          <Flex
            className="addPointer"
            p="0.7rem"
            style={{
              backgroundColor: darkmode ? "#2f3136" : "#f5f8fa",
              fontSize: "0.9rem",
              border: darkmode ? "1px solid #2f3136" : "1px solid #e6ecf0",
              borderRadius: "0.5rem",
            }}
          >
            <Text color="dimmed">
              <Trans>This post was deleted by the author.</Trans>
            </Text>
          </Flex>
        </div>
      )}
    </>
  );
};

export default PostQuote;
