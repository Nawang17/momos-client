import React from "react";
import { Container, createStyles, Tabs } from "@mantine/core";
import { PostFeed } from "../../Components/PostFeed";
import { Sidebar } from "../../Components/Sidebar";
import { ProfileHeader } from "./ProfileHeader";
import { Heart, Note } from "phosphor-react";
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
  const { classes } = useStyles();

  return (
    <Container px={10} className={classes.wrapper}>
      <div className={classes.leftWrapper}>
        <ProfileHeader />
        <Tabs defaultValue="gallery">
          <Tabs.List style={{ background: "white" }}>
            <Tabs.Tab value="gallery" icon={<Note size={14} />}>
              Posts
            </Tabs.Tab>
            <Tabs.Tab value="messages" icon={<Heart size={14} />}>
              Likes
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="gallery" pt="xs">
            <PostFeed />
          </Tabs.Panel>

          <Tabs.Panel value="messages" pt="xs">
            Liked posts
          </Tabs.Panel>
        </Tabs>
      </div>
      <Sidebar />
    </Container>
  );
};
