import { useEffect, useState } from "react";
import { Container, createStyles } from "@mantine/core";
import { Sidebar } from "../../Components/Sidebar";
import { SinglePostFeed } from "./SinglePostFeed";
import { useLocation, useParams } from "react-router-dom";
import { singlePost } from "../../api/GET";
import { showNotification } from "@mantine/notifications";
import { WarningCircle } from "phosphor-react";

const useStyles = createStyles(() => ({
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    paddingBottom: "5rem",
    paddingTop: "0.5rem",
    "@media (max-width: 700px)": {
      paddingTop: "0rem",
    },
  },
}));

export const SinglePost = () => {
  const { classes } = useStyles();
  const { pathname } = useLocation();
  const { postid } = useParams();
  const [singlePostData, setSinglePostData] = useState({});
  const [loading, setloading] = useState(true);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    singlePost({ postid })
      .then((res) => {
        setSinglePostData(res.data.singlepost);
        setloading(false);
        setComments(res.data.singlepost[0].comments);
      })
      .catch((err) => {
        if (err.response.status === 0) {
          showNotification({
            icon: <WarningCircle size={18} />,
            color: "red",
            title: "Internal Server Error",
            autoClose: 4000,
          });
        } else {
          showNotification({
            icon: <WarningCircle size={18} />,
            color: "red",
            title: err.response.data,
            autoClose: 4000,
          });
        }
      });
  }, [pathname]);
  return (
    <Container px={0} className={classes.wrapper}>
      <SinglePostFeed
        singlePostData={singlePostData[0]}
        setPosts={setSinglePostData}
        loading={loading}
        comments={comments}
        setComments={setComments}
      />
      <Sidebar />
    </Container>
  );
};
