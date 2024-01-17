import { createStyles } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/Auth";
import { useState } from "react";
import CreatePostModal from "../CreatePostModal";
import BookmarkNotiModal from "./components/PostModals/BookmarkNotiModal";
import PostHeader from "./components/PostHeader/PostHeader";
import PostFooter from "./components/PostFooter/PostFooter";
import CommentPreview from "./components/PostFooter/CommentPreview";

import PostBody from "./components/PostBody/PostBody";
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
          {/* Post body (text, media, polls) */}
          <PostBody post={post} darkmode={darkmode} />

          {/* Post footer */}
          <PostFooter
            post={post}
            comments={comments}
            setPosts={setPosts}
            setOpenConfirm={setOpenConfirm}
            bookmarkModalOpen={bookmarkModalOpen}
            setbookmarkModalOpen={setbookmarkModalOpen}
          />
          {/* post's comment preview  */}
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
