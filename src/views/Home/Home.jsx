import { useEffect, useState, useContext } from "react";
import { Container, createStyles } from "@mantine/core";
import { PostFeed } from "../../Components/PostFeed";
import { Sidebar } from "../../Components/Sidebar";
import { useLocation } from "react-router-dom";
import CreatePost from "../../Components/CreatePost";
import { HomePosts } from "../../api/GET";
import { AuthContext } from "../../context/Auth";
import { showNotification } from "@mantine/notifications";
const useStyles = createStyles(() => ({
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    paddingBottom: "5rem",
    paddingTop: "0.5rem",
  },
  leftWrapper: {
    flex: 0.7,
    "@media (max-width: 700px)": {
      flex: 1,
    },
  },
}));
export const Home = () => {
  const { classes } = useStyles();
  const { pathname } = useLocation();
  const [homePosts, setHomePosts] = useState([]);
  const { UserInfo } = useContext(AuthContext);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setloading(true);
    HomePosts()
      .then((res) => {
        setHomePosts(res.data.homeposts);
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
    <>
      <Container px={10} className={classes.wrapper}>
        <div className={classes.leftWrapper}>
          {UserInfo && (
            <CreatePost setHomePosts={setHomePosts} UserInfo={UserInfo} />
          )}

          <PostFeed
            setPosts={setHomePosts}
            posts={homePosts}
            loading={loading}
          />
        </div>
        <Sidebar />
      </Container>
    </>
  );
};
