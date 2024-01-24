import React, { useState } from "react";
import PostMedia from "./components/PostMedia";
import PostPolls from "./components/PostPolls";
import LinkPreview from "./LinkPreviews/LinkPreview";
import CommunityLink from "./LinkPreviews/CommunityLink";
import PostQuote from "./components/PostQuote";
import { useLocation, useNavigate } from "react-router-dom";
import { Text } from "@mantine/core";
import { formatText } from "../../../../helper/FormatText";
import { Trans } from "@lingui/macro";
import { lngs } from "../../../../i18n";
const PostBody = ({ post, darkmode }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <>
      {/* if post has text value and no poll */}
      {post?.text && !post?.poll && (
        <>
          {!showTranslation && (
            <div
              style={{
                cursor: "pointer",
                padding: "0rem 1rem 0rem 1rem",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
                paddingTop: "0.5rem",
              }}
              onClick={() => {
                const isTextSelection =
                  window.getSelection().toString().length > 0;
                if (isTextSelection) return;
                if (
                  pathname.substring(0, pathname.indexOf("/", 1)) ===
                    "/community" ||
                  post?.community?.name
                ) {
                  navigate(`/communitypost/${post.id}`);
                } else {
                  navigate(`/post/${post.id}`);
                }
              }}
            >
              <Text size="15px">{formatText(post?.text, navigate)}</Text>
            </div>
          )}

          {showTranslation && (
            <div
              style={{
                cursor: "pointer",
                padding: "0rem 1rem 0rem 1rem",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
                paddingTop: "0.5rem",
              }}
              onClick={() => {
                const isTextSelection =
                  window.getSelection().toString().length > 0;
                if (isTextSelection) return;
                if (
                  pathname.substring(0, pathname.indexOf("/", 1)) ===
                    "/community" ||
                  post?.community?.name
                ) {
                  navigate(`/communitypost/${post.id}`);
                } else {
                  navigate(`/post/${post.id}`);
                }
              }}
            >
              <Text size="15px">
                {formatText(
                  localStorage.getItem("language") === post?.language
                    ? post?.text
                    : post?.translations?.find(
                        (translation) =>
                          translation.language ===
                          localStorage.getItem("language")
                      )?.translatedText || post?.text,
                  navigate
                )}
              </Text>
            </div>
          )}
          {localStorage.getItem("language") !== (post?.language || "en") &&
            post?.translations?.find(
              (translation) =>
                translation.language === localStorage.getItem("language")
            )?.translatedText && (
              <Text
                style={{
                  width: "fit-content",
                }}
                className="link-style addPointer"
                onClick={() => setShowTranslation(!showTranslation)}
                color="dimmed"
                size="13px"
                p="0rem 1rem 0rem 1rem"
              >
                {!showTranslation ? (
                  <Trans>
                    Translate to{" "}
                    {lngs[localStorage.getItem("language")]?.nativeName}
                  </Trans>
                ) : (
                  <Trans>See original &#40;Translated by Google&#41;</Trans>
                )}
              </Text>
            )}
        </>
      )}
      {/* image, video and gif display */}
      <PostMedia post={post} />

      {/* post poll display */}

      <PostPolls post={post} />

      {/* link preview  */}

      <LinkPreview post={post} darkmode={darkmode} />

      {/* community link preview */}

      <CommunityLink post={post} />

      {/*Post quote */}

      <PostQuote post={post} />
    </>
  );
};

export default PostBody;
