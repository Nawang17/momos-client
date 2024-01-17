import { createStyles, Text } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/Auth";
import { useState } from "react";
import CreatePostModal from "../CreatePostModal";
import PostPolls from "./components/PostBody/PostPolls";
import BookmarkNotiModal from "./components/PostModals/BookmarkNotiModal";
import PostHeader from "./components/PostHeader/PostHeader";
import PostFooter from "./components/PostFooter/PostFooter";
import CommentPreview from "./components/PostFooter/CommentPreview";
import { formatText } from "../../helper/FormatText";
import PostQuote from "./components/PostBody/PostQuote";
import PostMedia from "./components/PostBody/PostMedia";
import LinkPreview from "./components/PostBody/LinkPreviews/LinkPreview";
import CommunityLink from "./components/PostBody/LinkPreviews/CommunityLink";
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
  right: {
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
    width: "100%",
  },

  body: {
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    paddingTop: "0.5rem",
  },
}));
export const Post = ({ post, setPosts, comments }) => {
  const { pathname } = useLocation();
  const { classes } = useStyles();
  const navigate = useNavigate();

  const { UserInfo, darkmode, socket } = useContext(AuthContext);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [bookmarkModalOpen, setbookmarkModalOpen] = useState(false);

  useEffect(() => {
    //when a post is deleted a socket send the post id to everyone
    //if user is in current page of the post that got deleted then navigate to home page
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
          {/* Post header (avatar,username,date,menu)  */}
          <PostHeader
            post={post}
            setPosts={setPosts}
            bookmarkModalOpen={bookmarkModalOpen}
            setbookmarkModalOpen={setbookmarkModalOpen}
          />

          {/* if post has text value and no poll */}

          {post?.text && !post?.poll && (
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

      {/* Post Bookmarked not modal */}
      <BookmarkNotiModal
        bookmarkModalOpen={bookmarkModalOpen}
        setbookmarkModalOpen={setbookmarkModalOpen}
      />
    </>
  );
};
