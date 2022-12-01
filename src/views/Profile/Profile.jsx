import { useEffect, useState } from "react";

import { Container, createStyles, Tabs } from "@mantine/core";
import { PostFeed } from "../../Components/PostFeed";
import { Sidebar } from "../../Components/Sidebar";
import { ProfileHeader } from "./ProfileHeader";
import { Heart, Note } from "phosphor-react";
import { useLocation, useParams } from "react-router-dom";
import { profileinfo } from "../../api/GET";
import { showNotification } from "@mantine/notifications";
import { useScrollIntoView } from "@mantine/hooks";

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
export const Profile = () => {
  const { scrollIntoView, targetRef } = useScrollIntoView({
    offset: 64,
  });
  const { userprofile } = useParams();
  const { classes } = useStyles();
  const { pathname } = useLocation();
  const [posts, setposts] = useState([]);
  const [profileInfo, setprofileInfo] = useState({});
  const [loading, setloading] = useState(true);
  const [userlikedposts, setuserlikedposts] = useState([]);

  const [Tab, setTab] = useState("posts");

  useEffect(() => {
    scrollIntoView();
    profileinfo({ username: userprofile })
      .then((res) => {
        setposts(res.data.userPosts);
        setprofileInfo(res.data.userInfo);
        setuserlikedposts(res.data.likedposts);

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
    return () => {
      setTab("posts");
    };
  }, [pathname]);

  return (
    <Container px={10} className={classes.wrapper}>
      <div ref={targetRef} className={classes.leftWrapper}>
        <ProfileHeader profileInfo={profileInfo} />
        <Tabs value={Tab} onTabChange={setTab}>
          <Tabs.List style={{ background: "white" }}>
            <Tabs.Tab value="posts" icon={<Note size={14} />}>
              Posts
            </Tabs.Tab>
            <Tabs.Tab value="likedposts" icon={<Heart size={14} />}>
              Likes
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="posts" pt="xs">
            <PostFeed posts={posts} loading={loading} setPosts={setposts} />
          </Tabs.Panel>

          <Tabs.Panel value="likedposts" pt="xs">
            <PostFeed
              posts={userlikedposts}
              loading={loading}
              setPosts={setuserlikedposts}
            />
          </Tabs.Panel>
        </Tabs>
      </div>
      <Sidebar />
    </Container>
  );
};
