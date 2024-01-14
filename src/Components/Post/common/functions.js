import { showNotification } from "@mantine/notifications";
import { BookmarkSimple, Lock } from "@phosphor-icons/react";
import { bookmarkPost } from "../../../api/POST";
import { Trans } from "@lingui/macro";

export const handlebookmark = async (
  UserInfo,
  setbookmarkIds,
  setbookmarkModalOpen,
  post
) => {
  if (!UserInfo) {
    return showNotification({
      icon: <Lock size={18} />,
      color: "red",
      title: <Trans>Login required</Trans>,
      autoClose: 3000,
    });
  }

  await bookmarkPost({ postId: post.id }).then((res) => {
    if (res.data.bookmarked) {
      setbookmarkIds((prev) => {
        return [...prev, post.id];
      });
      setbookmarkModalOpen(true);
      setTimeout(() => {
        setbookmarkModalOpen(false);
      }, 3000);
    } else {
      setbookmarkModalOpen(false);
      setbookmarkIds((prev) => {
        return prev.filter((id) => id !== post.id);
      });
      showNotification({
        color: "gray",
        icon: <BookmarkSimple size={18} />,
        message: <Trans>Post unsaved successfully</Trans>,
        autoClose: 3000,
      });
    }
  });
};
