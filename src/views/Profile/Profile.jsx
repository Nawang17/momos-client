import { useContext, useEffect, useState } from "react";

import { Container, createStyles, Loader, Tabs } from "@mantine/core";
import { PostFeed } from "../../Components/PostFeed";
import { Sidebar } from "../../Components/Sidebar";
import { ProfileHeader } from "./ProfileHeader";
import { Heart, Note, WarningCircle } from "phosphor-react";
import { useLocation, useParams } from "react-router-dom";
import {
  getmorelikedposts,
  getmoreprofileposts,
  profileinfo,
} from "../../api/GET";
import { showNotification } from "@mantine/notifications";
import { AuthContext } from "../../context/Auth";
import InfiniteScroll from "react-infinite-scroll-component";

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

  leftWrapper: {
    flex: 0.7,
    "@media (max-width: 700px)": {
      flex: 1,
    },
  },
}));
export const Profile = () => {
  const { userprofile } = useParams();
  const { classes } = useStyles();
  const { pathname } = useLocation();
  const [posts, setposts] = useState([]);
  const [profileInfo, setprofileInfo] = useState([]);
  const [loading, setloading] = useState(true);
  const [userlikedposts, setuserlikedposts] = useState([]);
  const { darkmode } = useContext(AuthContext);
  const [Tab, setTab] = useState("posts");
  const [postCount, setpostCount] = useState(0);
  const [postpage, setpostpage] = useState(0);
  const [likedpostCount, setlikedpostCount] = useState(0);
  const [likedpage, setlikedpage] = useState(0);
  const [rankinfo, setrankinfo] = useState([]);
  useEffect(() => {
    setloading(true);
    profileinfo({ username: userprofile })
      .then((res) => {
        setposts(res.data.userPosts);
        setprofileInfo(res.data.userInfo);
        setuserlikedposts(res.data.likedposts);
        setpostCount(res.data.userPoststotalCount);
        setlikedpostCount(res.data.likedpoststotalCount);
        setrankinfo(res.data.rankInfo);
        setloading(false);
      })
      .catch((err) => {
        setprofileInfo({
          username: userprofile,
          avatar:
            "https://res.cloudinary.com/dwzjfylgh/image/upload/v1650822495/jbnmm5pv4eavhhj8jufu.jpg",
        });
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

    return () => {
      setTab("posts");
    };
  }, [pathname]);
  const fetchMoreposts = () => {
    setpostpage((prev) => prev + 1);
    getmoreprofileposts(profileInfo?.id, postpage + 1).then((res) => {
      setposts((prev) => [...prev, ...res.data]);
    });
  };
  const fetchMorelikedposts = () => {
    setlikedpage((prev) => prev + 1);

    getmorelikedposts(profileInfo?.id, likedpage + 1).then((res) => {
      setuserlikedposts((prev) => [...prev, ...res.data]);
    });
  };
  return (
    <Container px={0} className={classes.wrapper}>
      <div className={classes.leftWrapper}>
        <ProfileHeader
          profileloading={loading}
          profileInfo={profileInfo}
          rankinfo={rankinfo}
        />
        <Tabs value={Tab} onTabChange={setTab}>
          <Tabs.List
            style={{
              borderBottom: "none",

              backgroundColor: darkmode ? "#1A1B1E" : "white",
            }}
          >
            <Tabs.Tab value="posts" icon={<Note size={14} />}>
              Posts
            </Tabs.Tab>
            <Tabs.Tab value="likedposts" icon={<Heart size={14} />}>
              Likes
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="posts" pt="xs">
            <InfiniteScroll
              dataLength={posts.length}
              next={fetchMoreposts}
              hasMore={postCount > posts.length}
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
              <PostFeed posts={posts} loading={loading} setPosts={setposts} />
            </InfiniteScroll>
          </Tabs.Panel>

          <Tabs.Panel value="likedposts" pt="xs">
            <InfiniteScroll
              dataLength={userlikedposts.length}
              next={fetchMorelikedposts}
              hasMore={likedpostCount > userlikedposts.length}
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
            >
              <PostFeed
                posts={userlikedposts}
                loading={loading}
                setPosts={setuserlikedposts}
              />
            </InfiniteScroll>
          </Tabs.Panel>
        </Tabs>
      </div>
      <Sidebar />
    </Container>
  );
};
