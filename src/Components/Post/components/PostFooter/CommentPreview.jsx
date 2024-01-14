import { Avatar, Flex, Indicator, Text } from "@mantine/core";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import locale from "date-fns/locale/en-US";
import React from "react";
import { useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../../context/Auth";
import Verifiedbadge from "../../../../helper/VerifiedBadge";
import Topuserbadge from "../../../../helper/Topuserbadge";
import { formatDistance } from "../../../../helper/DateFormat";
import { formatText } from "../../../../helper/FormatText";
import { Trans } from "@lingui/macro";

const CommentPreview = ({ post, comments }) => {
  const { pathname } = useLocation();
  const { name } = useParams();
  const navigate = useNavigate();
  const { onlineusers, topUser } = useContext(AuthContext);

  return (
    <>
      {/* check if the pathname is the home page or the community page */}

      {(pathname === "/" || pathname === `/community/${name}`) &&
        // Check if the post has more than 1 comment where the comment's text is non-null

        (post?.comments?.filter((val) => {
          return val?.text !== null;
        }).length > 1 ||
          /* OR
 Check if the most recent comment's text is non-null and the comment was created within the last 10 days */
          (post?.comments[post?.comments.length - 1]?.text !== null &&
            // Check if the difference between the current date and the recent comment's createdAt date is less than 10 days
            new Date() -
              new Date(post?.comments[post?.comments.length - 1]?.createdAt) <
              10 * 24 * 60 * 60 * 1000)) && ( // 10 days in milliseconds
          <>
            {/* If the above conditions are met, render the following: */}
            <Flex
              className="addPointer"
              pt="0.7rem"
              gap="1rem"
              direction="column"
              onClick={() => {
                if (
                  pathname.substring(0, pathname.indexOf("/", 1)) ===
                  "/community"
                ) {
                  navigate(`/communitypost/${post.id}`);
                } else {
                  navigate(`/post/${post.id}`);
                }
              }}
            >
              {post?.comments

                .slice(post?.comments.length === 2 ? 1 : -2)
                .map((com) => {
                  if (com?.text === null && com?.gif) {
                    return null;
                  }
                  return (
                    <div
                      key={com.id}
                      style={{
                        padding: "0 1rem",
                      }}
                    >
                      <Flex gap="0.5rem">
                        {/* left */}
                        <div>
                          <Indicator
                            disabled={!onlineusers.includes(com?.user?.id)}
                            style={{
                              cursor: "pointer",
                            }}
                            withBorder
                            inline
                            color="green"
                            size={9}
                            offset={7}
                            position="bottom-end"
                          >
                            <Avatar
                              onClick={() => {
                                navigate(`/${com?.user?.username}`);
                              }}
                              size="40px"
                              radius={"xl"}
                              src={com?.user?.avatar}
                              alt=""
                              loading="lazy"
                            />
                          </Indicator>
                        </div>
                        <div
                          style={{
                            width: "100%",
                          }}
                        >
                          <Flex gap="0.2rem" align="center">
                            <Text
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/${com?.user?.username}`);
                              }}
                              size={"15px"}
                              weight={500}
                            >
                              {com?.user?.username}
                            </Text>

                            {com?.user?.verified && <Verifiedbadge />}
                            {topUser === com?.user?.username && (
                              <Topuserbadge />
                            )}
                            <Text color="dimmed">·</Text>
                            <Text size={"12px"} color="dimmed">
                              {formatDistanceToNowStrict(
                                new Date(com?.createdAt),
                                {
                                  locale: {
                                    ...locale,
                                    formatDistance,
                                  },
                                }
                              )}
                            </Text>
                          </Flex>
                          {com.text && (
                            <div
                              style={{
                                cursor: "pointer",
                                paddingTop: "0",
                                wordBreak: "break-word",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              <Text size="15px">
                                {formatText(com?.text, navigate)}
                              </Text>
                            </div>
                          )}
                        </div>
                      </Flex>
                    </div>
                  );
                })
                .reverse()}
            </Flex>

            <Text
              onClick={() => {
                if (
                  pathname.substring(0, pathname.indexOf("/", 1)) ===
                  "/community"
                ) {
                  navigate(`/communitypost/${post.id}`);
                } else {
                  navigate(`/post/${post.id}`);
                }
              }}
              color="dimmed"
              size={"14px"}
              style={{
                padding: "0.1rem 0.1rem 0.5rem 4rem",
                cursor: "pointer",
              }}
            >
              <Trans>
                See all{" "}
                {comments
                  ? `${comments?.reduce((acc, curr) => {
                      return acc + curr.nestedcomments?.length;
                    }, comments.length)}`
                  : `${post.comments?.reduce((acc, curr) => {
                      return acc + curr.nestedcomments?.length;
                    }, post.comments.length)}`}{" "}
                comments
              </Trans>
            </Text>
          </>
        )}
    </>
  );
};

export default CommentPreview;
