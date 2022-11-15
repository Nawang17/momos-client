import { useEffect, useState, useContext } from "react";
import { Container, createStyles, Divider, Loader } from "@mantine/core";
import { PostFeed } from "../../Components/PostFeed";
import { Sidebar } from "../../Components/Sidebar";
import CreatePost from "../../Components/CreatePost";
import { HomePosts } from "../../api/GET";
import { AuthContext } from "../../context/Auth";
import { showNotification } from "@mantine/notifications";
import InfiniteScroll from "react-infinite-scroll-component";
import { SortMenu } from "./SortMenu";
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
  const [homePosts, setHomePosts] = useState([]);
  const { UserInfo } = useContext(AuthContext);
  const [loading, setloading] = useState(true);
  const [page, setpage] = useState(0);
  const [postCount, setpostCount] = useState(0);
  const [sortvalue, setsortvalue] = useState("Latest");
  useEffect(() => {
    setloading(true);
    HomePosts(0)
      .then((res) => {
        setHomePosts(res.data.homeposts);
        setloading(false);
        setpostCount(res.data.postCount);
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
  }, []);
  const fetchMoreData = () => {
    setpage((prev) => prev + 1);

    HomePosts(page + 1)
      .then((res) => {
        setHomePosts((prev) => [...prev, ...res.data.homeposts]);
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
  };

  return (
    <>
      <Container px={10} className={classes.wrapper}>
        <div className={classes.leftWrapper}>
          {UserInfo && (
            <CreatePost setHomePosts={setHomePosts} UserInfo={UserInfo} />
          )}
          {/* {UserInfo && (
            <Divider
              my="xs"
              labelPosition="right"
              label={
                <>
                  <SortMenu sortvalue={sortvalue} setsortvalue={setsortvalue} />
                </>
              }
            />
          )} */}

          <InfiniteScroll
            dataLength={homePosts.length}
            next={fetchMoreData}
            hasMore={postCount > homePosts.length}
            loader={
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Loader />
              </div>
            }
            endMessage={<></>}
          >
            <PostFeed
              sortby={sortvalue}
              setPosts={setHomePosts}
              posts={homePosts}
              loading={loading}
            />
          </InfiniteScroll>
        </div>
        <Sidebar />
      </Container>
    </>
  );
};
