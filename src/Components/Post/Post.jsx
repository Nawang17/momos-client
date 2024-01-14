import {
  Avatar,
  createStyles,
  Flex,
  Image,
  Indicator,
  Text,
} from "@mantine/core";
import { Globe, Link, LockLaminated, Users } from "@phosphor-icons/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/Auth";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import locale from "date-fns/locale/en-US";
import { useState } from "react";
import CreatePostModal from "../CreatePostModal";
import PostPolls from "../PostPolls";
import Topuserbadge from "../../helper/Topuserbadge";
import { useImageSize } from "react-image-size";
import ImageViewer from "react-simple-image-viewer";
import { formatDistance } from "../../helper/DateFormat";
import Verifiedbadge from "../../helper/VerifiedBadge";
import BookmarkNotiModal from "./components/PostModals/BookmarkNotiModal";
import PostHeader from "./components/PostHeader/PostHeader";
import PostFooter from "./components/PostFooter/PostFooter";
import CommentPreview from "./components/PostFooter/CommentPreview";
import { formatText } from "../../helper/FormatText";
import { Trans } from "@lingui/macro";
const useStyles = createStyles(() => ({
  wrapper: {
    background: "white",
    padding: "1rem 0rem 0.5rem 0rem",
    display: "flex",
    gap: "1rem",
    borderRadius: "4px",
    "@media (max-width: 700px)": {
      borderRadius: "0px",
    },
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    cursor: "pointer",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
  right: {
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
    width: "100%",
  },
  gifimg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "0.5rem",
  },
  img: {
    width: "100%",
    height: "100%",
    borderRadius: "4px",
  },

  body: {
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    paddingTop: "0.5rem",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fRight: {
    display: "flex",
    alignItems: "center",
    gap: "0.2rem",
    cursor: "pointer",
  },
  fLeft: {
    display: "flex",
    alignItems: "center",
    gap: "0.2rem",
    cursor: "pointer",
  },
}));
export const Post = ({ post, setPosts, comments }) => {
  const { pathname } = useLocation();
  const { classes } = useStyles();
  const navigate = useNavigate();

  const [dimensions] = useImageSize(
    post?.filetype === "image" ? post?.image : post?.gif
  );
  const [opened, setOpened] = useState(false);
  const [viewimg, setviewimg] = useState("");
  const { UserInfo, darkmode, onlineusers, topUser, socket } =
    useContext(AuthContext);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [bookmarkModalOpen, setbookmarkModalOpen] = useState(false);

  useEffect(() => {
    socket.on("post-deleted", (data) => {
      if (pathname === `/post/${Number(data)}`) {
        navigate("/");
      }
    });
  }, []);

  return (
    <>
      <div
        style={{
          backgroundColor: darkmode ? "#1A1B1E" : "white",
          color: darkmode ? "white" : "black",
        }}
        className={classes.wrapper}
      >
        <div className={classes.right}>
          {/* Post header  */}
          <PostHeader
            post={post}
            setPosts={setPosts}
            bookmarkModalOpen={bookmarkModalOpen}
            setbookmarkModalOpen={setbookmarkModalOpen}
          />

          {post.text && !post?.poll && (
            <div
              style={{
                cursor: "pointer",

                padding: "0rem 1rem 0rem 1rem",
              }}
              onClick={() => {
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
              className={classes.body}
            >
              <Text size="15px">{formatText(post?.text, navigate)}</Text>
            </div>
          )}
          {post.image && (
            <div
              style={{
                padding: "0.5rem 1rem 0rem 1rem",
              }}
            >
              {post?.filetype === "image" ? (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingBottom:
                      dimensions?.width < dimensions?.height ? "75%" : "0",

                    /* 4:3 aspect ratio (change as needed) */
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <img
                    style={{
                      position:
                        dimensions?.width < dimensions?.height
                          ? "absolute"
                          : "static",
                      objectFit:
                        dimensions?.width < dimensions?.height
                          ? "cover"
                          : "fill",
                    }}
                    onClick={() => {
                      setviewimg(post?.image);
                      setOpened(true);
                    }}
                    loading="lazy"
                    className={classes.img}
                    src={post?.image}
                    alt=""
                  />
                </div>
              ) : (
                <video
                  poster={post?.image.slice(0, -3) + "jpg"}
                  style={{ width: "100%", height: "auto", borderRadius: "4px" }}
                  controls
                >
                  <source src={post?.image} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          {post?.gif && (
            <div
              style={{
                padding: "0.5rem 1rem 0rem 1rem",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingBottom:
                    dimensions?.width < dimensions?.height ? "75%" : "0",

                  /* 4:3 aspect ratio (change as needed) */
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <img
                  onClick={() => {
                    setviewimg(post?.gif);
                    setOpened(true);
                  }}
                  style={{
                    position:
                      dimensions?.width < dimensions?.height
                        ? "absolute"
                        : "static",
                    objectFit:
                      dimensions?.width < dimensions?.height ? "cover" : "fill",
                  }}
                  loading="lazy"
                  className={classes.img}
                  src={post?.gif}
                  alt=""
                />
              </div>
            </div>
          )}
          {post?.poll && <PostPolls post={post} />}

          {/* link preview  */}
          {post.previewlink && (
            <div
              style={{
                padding: "0rem 1rem 0rem 1rem",
              }}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();

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

          {/* community link preview */}
          {post.comshare && (
            <Flex
              onClick={() => {
                navigate(`/community/${post.comshare.name}`);
              }}
              style={{
                border: darkmode ? "1px solid #2f3136" : "1px solid #e6ecf0",
                cursor: "pointer",
                borderRadius: "8px",
                padding: "0.5rem",
              }}
              mx={"1rem"}
              justify={"space-between"}
              wrap={"wrap"}
              gap={10}
            >
              <Flex gap={10}>
                <Image
                  width={100}
                  height={100}
                  miw={"auto"}
                  radius={post.comshare.banner ? "sm" : "0"}
                  withPlaceholder
                  src={post.comshare.banner}
                />

                <Flex
                  style={{
                    width: "100%",
                  }}
                  gap={5}
                  direction={"column"}
                >
                  <Text weight={600}>{post.comshare.name}</Text>
                  <Flex gap={3} align={"center"}>
                    <Users size={15} weight="light" />

                    <Text size={"sm"} color="dimmed">
                      {post.comshare.communitymembers.length}{" "}
                      {post.comshare.communitymembers.length > 1
                        ? "members"
                        : "member"}
                    </Text>
                  </Flex>
                  <Flex gap={3} align={"center"}>
                    {post.comshare.private ? (
                      <LockLaminated size={15} weight="light" />
                    ) : (
                      <Globe size={15} weight="light" />
                    )}

                    <Text size={"sm"} color="dimmed">
                      {post.comshare.private ? "Private" : "Public"}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          )}

          {/* quoted post */}

          {post.hasquote && post.post && (
            <div
              style={{
                padding: "0rem 1rem 0rem 1rem",
              }}
            >
              {" "}
              <div
                onClick={() => {
                  if (
                    pathname.substring(0, pathname.indexOf("/", 1)) ===
                      "/community" ||
                    post?.community?.name
                  ) {
                    navigate(`/communitypost/${post.post.id}`);
                  } else {
                    navigate(`/post/${post.post.id}`);
                  }
                }}
                style={{
                  cursor: "pointer",
                  fontSize: "0.9rem",

                  border: darkmode ? "1px solid #2f3136" : "1px solid #e6ecf0",
                  display: "flex",
                  flexDirection: "column",
                  paddingBottom:
                    !post?.post.image && !post?.post.gif ? "0.7rem" : "0",
                  gap: "0.5rem",
                  borderRadius: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.3rem",
                    alignItems: "center",
                    padding: "0.7rem 0.7rem 0 0.7rem",
                  }}
                >
                  <Indicator
                    disabled={!onlineusers.includes(post?.post.user?.id)}
                    style={{
                      cursor: "pointer",
                    }}
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
                      alt=""
                      loading="lazy"
                    />
                  </Indicator>

                  <div
                    style={{
                      display: "flex",
                      gap: "0.2rem",
                      alignItems: "center",
                    }}
                  >
                    <Text size="15px" weight={500}>
                      {" "}
                      {post?.post.user?.username}
                    </Text>
                    {post?.post.user.verified && <Verifiedbadge />}
                    {topUser === post?.post.user?.username && <Topuserbadge />}
                  </div>
                  <Text color={"dimmed"}>·</Text>
                  <Text color={"dimmed"}>
                    {" "}
                    {formatDistanceToNowStrict(new Date(post?.post.createdAt), {
                      locale: {
                        ...locale,
                        formatDistance,
                      },
                    })}
                  </Text>
                </div>
                {post?.post.text && (
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

                {post?.post.image && (
                  <>
                    {post?.post.filetype === "image" ? (
                      <img
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "0 0 0.5rem 0.5rem",
                        }}
                        loading="lazy"
                        src={post?.post.image}
                        alt=""
                      />
                    ) : (
                      <video
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        poster={post?.post.image.slice(0, -3) + "jpg"}
                        // preload="none"
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "0 0 0.5rem 0.5rem",
                        }}
                        controls
                      >
                        <source src={post?.post.image} type="video/mp4" />
                        <Trans>
                          Your browser does not support the video tag.
                        </Trans>
                      </video>
                    )}
                  </>
                )}
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
              </div>
            </div>
          )}

          {/* quote delete */}
          {post.hasquote && !post.post && (
            <div
              style={{
                padding: "0rem 1rem 0rem 1rem",
              }}
            >
              <div
                style={{
                  backgroundColor: darkmode ? "#2f3136" : "#f5f8fa",
                  cursor: "pointer",
                  fontSize: "0.9rem",

                  border: darkmode ? "1px solid #2f3136" : "1px solid #e6ecf0",
                  display: "flex",

                  padding: "0.7rem",

                  borderRadius: "0.5rem",
                }}
              >
                <Text color={"dimmed"}>
                  {" "}
                  <Trans>This post was deleted by the author. </Trans>
                </Text>
              </div>
            </div>
          )}

          {/* Post footer */}
          <PostFooter
            post={post}
            comments={comments}
            setPosts={setPosts}
            setOpenConfirm={setOpenConfirm}
            bookmarkModalOpen={bookmarkModalOpen}
            setbookmarkModalOpen={setbookmarkModalOpen}
          />
          <CommentPreview post={post} comments={comments} />
        </div>
      </div>
      {/* repost post modal */}
      <CreatePostModal
        opened={openConfirm}
        setOpened={setOpenConfirm}
        setHomePosts={setPosts}
        UserInfo={UserInfo}
        quotepostinfo={post}
        communityName={post?.community?.name}
      />

      {/* view img modal  */}
      {opened && (
        <div
          style={{
            zIndex: 1000,
          }}
        >
          <ImageViewer
            backgroundStyle={{
              zIndex: 1000,
            }}
            src={[viewimg]}
            currentIndex={0}
            disableScroll={false}
            closeOnClickOutside={true}
            onClose={() => {
              setOpened(false);
              setviewimg("");
            }}
          />
        </div>
      )}
      {/* Post Bookmarked not modal */}
      <BookmarkNotiModal
        bookmarkModalOpen={bookmarkModalOpen}
        setbookmarkModalOpen={setbookmarkModalOpen}
      />
    </>
  );
};
