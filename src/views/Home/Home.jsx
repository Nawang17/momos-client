import { useEffect, useState, useContext } from "react";
import { Container, createStyles, Loader, Text } from "@mantine/core";
import { PostFeed } from "../../Components/PostFeed";
import { Sidebar } from "../../Components/Sidebar";
import CreatePost from "../../Components/CreatePost";
import { HomePosts } from "../../api/GET";
import { AuthContext } from "../../context/Auth";
import { showNotification } from "@mantine/notifications";
import InfiniteScroll from "react-infinite-scroll-component";
import { SortMenu } from "./SortMenu";
import { WarningCircle } from "phosphor-react";

const useStyles = createStyles(() => ({
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    paddingBottom: "5rem",
    paddingTop: "0.5rem",
    // "@media (max-width: 700px)": {
    //   paddingTop: "0rem",
    // },
  },
  leftWrapper: {
    width: "100%",
    flex: 0.7,
    "@media (max-width: 700px)": {
      flex: 1,
    },
  },
}));
export const Home = () => {
  const { classes } = useStyles();
  const [homePosts, setHomePosts] = useState([]);
  const { UserInfo, darkmode } = useContext(AuthContext);
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
  };

  return (
    <>
      <Container px={0} className={classes.wrapper}>
        <div className={classes.leftWrapper}>
          {UserInfo && <CreatePost darkmode={darkmode} UserInfo={UserInfo} />}

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
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "1rem",
                }}
              >
                <Loader />
              </div>
            }
            endMessage={
              <>
                {/* <Text
                  style={{
                    marginTop: "1rem",
                  }}
                  align="center"
                  color={darkmode ? "white" : "dark"}
                >
                  You have seen it all
                </Text> */}
              </>
            }
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
