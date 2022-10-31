import { useEffect, useState } from "react";
import { Container, createStyles } from "@mantine/core";
import { Sidebar } from "../../Components/Sidebar";
import { SinglePostFeed } from "./SinglePostFeed";
import { useLocation, useParams } from "react-router-dom";
import { singlePost } from "../../api/GET";
import { showNotification } from "@mantine/notifications";

const useStyles = createStyles(() => ({
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    paddingBottom: "5rem",
    paddingTop: "0.5rem",
  },
}));

export const SinglePost = () => {
  const { classes } = useStyles();
  const { pathname } = useLocation();
  const { postid } = useParams();
  const [singlePostData, setSinglePostData] = useState({});
  const [loading, setloading] = useState(true);
  useEffect(() => {
    window.scrollTo(0, 0);

    singlePost({ postid })
      .then((res) => {
        setSinglePostData(res.data.singlepost);
        setloading(false);
      })
      .catch((err) => {
        if (err.response.status === 0) {
          showNotification({
            color: "red",
            title: "Internal Server Error",

            autoClose: 7000,
          });
        } else {
          showNotification({
            color: "red",
            title: err.response.data,
            autoClose: 7000,
          });
        }
      });
  }, [pathname]);
  return (
    <Container px={10} className={classes.wrapper}>
      <SinglePostFeed
        singlePostData={singlePostData}
        setPosts={setSinglePostData}
        loading={loading}
      />
      <Sidebar />
    </Container>
  );
};
