import { useEffect, useState, useContext } from "react";
import { Container, createStyles } from "@mantine/core";
import { PostFeed } from "../../Components/PostFeed";
import { Sidebar } from "../../Components/Sidebar";
import { useLocation } from "react-router-dom";
import CreatePost from "../../Components/CreatePost";
import { HomePosts } from "../../api/GET";
import { AuthContext } from "../../context/Auth";

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
  useEffect(() => {
    window.scrollTo(0, 0);
    HomePosts().then((res) => {
      setHomePosts(res.data.homeposts);
    });
  }, [pathname]);
  return (
    <>
      <Container px={10} className={classes.wrapper}>
        <div className={classes.leftWrapper}>
          {UserInfo && <CreatePost setHomePosts={setHomePosts} />}

          <PostFeed posts={homePosts} />
        </div>
        <Sidebar />
      </Container>
    </>
  );
};
