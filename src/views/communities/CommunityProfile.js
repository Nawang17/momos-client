import {
  ActionIcon,
  Badge,
  Button,
  Container,
  Flex,
  Image,
  Loader,
  Tabs,
  Text,
  createStyles,
} from "@mantine/core";
import {
  ArrowLeft,
  Crown,
  Globe,
  LockLaminated,
  Pencil,
  SignOut,
  Trash,
  Users,
  WarningCircle,
} from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sidebar } from "../../Components/Sidebar";
import { AuthContext } from "../../context/Auth";
import { getcommunityPosts, getcommunityprofile } from "../../api/GET";
import CreatePost from "../../Components/CreatePost";
import { PostFeed } from "../../Components/PostFeed";
import { showNotification } from "@mantine/notifications";
import { deleteCommunity, leaveCommunity } from "../../api/DELETE";
import { openConfirmModal } from "@mantine/modals";

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
    width: "100%",

    flex: 0.7,
    "@media (max-width: 700px)": {
      flex: 1,
    },
  },
}));

export const CommunityProfile = () => {
  const { classes } = useStyles();
  const { darkmode, UserInfo } = useContext(AuthContext);
  const [communityInfo, setCommunityInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const navigate = useNavigate();
  const { name } = useParams();
  useEffect(() => {
    getcommunityprofile(name)
      .then((res) => {
        setCommunityInfo(res.data);
        setLoading(false);
      })
      .catch((err) => {
        navigate("/communities");
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
    getcommunityPosts(name)
      .then((res) => {
        setCommunityPosts(res.data);
        setPostsLoading(false);
      })
      .catch((err) => {
        navigate("/communities");

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

  const handleLeaveCommunity = () => {
    openConfirmModal({
      title: "Are you sure you want to leave this community?",
      children: (
        <Text size="sm">
          You will no longer be able to post or comment in this community. You
          can rejoin at any time.
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => {
        return;
      },
      onConfirm: () => {
        leaveCommunity(name)
          .then(() => {
            showNotification({
              icon: <SignOut size={18} />,
              color: "blue",
              title: "You have left the community",
              autoClose: 4000,
            });
            navigate(-1);
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
      },
    });
  };
  const handledeleteCommunity = () => {
    openConfirmModal({
      title: "Are you sure you want to delete this community?",
      children: (
        <Text size="sm">
          All posts and members of this community will be deleted forever. This
          action cannot be undone.
        </Text>
      ),
      labels: { confirm: "Yes, delete it", cancel: "No, don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => {
        return;
      },
      onConfirm: () => {
        deleteCommunity(name)
          .then(() => {
            showNotification({
              icon: <Trash size={18} />,
              color: "blue",
              title: "You have deleted the community",
              autoClose: 4000,
            });
            navigate(-1);
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
      },
    });
  };
  return (
    <Container px={0} className={classes.wrapper}>
      <div className={classes.leftWrapper}>
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
            padding: "1rem 0rem 0rem 1rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <ActionIcon onClick={() => navigate(-1)}>
            <ArrowLeft size="20px" />
          </ActionIcon>
        </div>
        {!loading || !postsLoading ? (
          <div
            style={{
              backgroundColor: darkmode ? "#1A1B1E" : "white",
              color: darkmode ? "white" : "black",
              // padding: "1rem 1rem 0.5rem 1rem",
            }}
          >
            <Flex
              style={{
                padding: "1rem 1rem 0.5rem 1rem",
              }}
              mb={10}
              justify={"space-between"}
              wrap={"wrap"}
            >
              <Flex gap={20} align={"flex-start"}>
                <Image
                  width={84}
                  height={84}
                  radius={"100%"}
                  withPlaceholder
                  src={communityInfo?.banner}
                />
                <Flex direction={"column"} gap={10}>
                  <Flex direction={"column"} gap={4}>
                    <Text weight={700} size={"lg"}>
                      {communityInfo?.name}
                    </Text>
                    <Text size={"sm"}>{communityInfo?.description}</Text>
                  </Flex>
                  <Flex wrap={"wrap"} align={"center"} gap={10}>
                    {communityInfo?.communitymembers?.some(
                      (obj) =>
                        obj.isOwner && obj.user.username === UserInfo.username
                    ) && (
                      <Flex gap={3} align={"center"}>
                        <Crown size={15} weight="light" />

                        <Text size={"sm"} color="dimmed">
                          Owner
                        </Text>
                      </Flex>
                    )}
                    <Flex gap={3} align={"center"}>
                      {communityInfo?.private ? (
                        <LockLaminated size={15} weight="light" />
                      ) : (
                        <Globe size={15} weight="light" />
                      )}
                      <Text size={"sm"} color="dimmed">
                        {communityInfo?.private ? "Private" : "Public"}
                      </Text>
                    </Flex>

                    <Flex gap={3} align={"center"}>
                      <Users size={15} weight="light" />

                      <Text size={"sm"} color="dimmed">
                        {communityInfo?.communitymembers?.length}
                        {communityInfo?.communitymembers?.length > 1
                          ? " members"
                          : "member"}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
              {communityInfo?.communitymembers?.some(
                (obj) => !obj.isOwner && obj.user.username === UserInfo.username
              ) ? (
                <Button
                  onClick={() => handleLeaveCommunity()}
                  size="xs"
                  radius={"xl"}
                  color="gray"
                  leftIcon={<SignOut size={15} />}
                >
                  Leave
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    handledeleteCommunity();
                  }}
                  size="xs"
                  radius={"xl"}
                  color="red"
                >
                  Delete
                </Button>
              )}
            </Flex>

            <Tabs defaultValue="Posts">
              <Tabs.List grow>
                <Tabs.Tab value="Posts">Posts</Tabs.Tab>
                <Tabs.Tab value="Members">Members</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel
                style={{
                  backgroundColor: darkmode ? "#101113" : "#f0f2f5",
                  paddingTop: "0.5rem",
                }}
                value="Posts"
              >
                <CreatePost
                  darkmode={darkmode}
                  UserInfo={UserInfo}
                  communityName={name}
                />
                {communityPosts?.length !== 0 && !postsLoading && (
                  <PostFeed
                    setPosts={setCommunityPosts}
                    posts={communityPosts}
                    loading={postsLoading}
                  />
                )}
              </Tabs.Panel>

              <Tabs.Panel value="Members">
                <Flex
                  style={{
                    padding: "1rem 1rem 0.5rem 1rem",
                  }}
                  direction={"column"}
                  gap={10}
                  pt={10}
                >
                  {communityInfo?.communitymembers?.map((member) => (
                    <Flex
                      key={member?.user?.username}
                      style={{
                        width: "100%",
                      }}
                      p={10}
                      justify={"space-between"}
                      align={"center"}
                    >
                      <Flex align={"center"} gap={10}>
                        <Image
                          width={45}
                          height={45}
                          radius={"100%"}
                          withPlaceholder
                          src={member?.user?.avatar}
                        />
                        <Text weight={600}>{member?.user?.username}</Text>
                      </Flex>

                      {member?.isOwner && <Badge color="green">Owner</Badge>}
                      {member?.isadmin && !member?.isOwner && (
                        <Badge>Admin</Badge>
                      )}
                    </Flex>
                  ))}
                </Flex>
              </Tabs.Panel>
            </Tabs>
          </div>
        ) : (
          <Flex
            style={{
              backgroundColor: darkmode ? "#1A1B1E" : "white",
              color: darkmode ? "white" : "black",
              padding: "1rem 1rem 0.5rem 1rem",
            }}
            justify={"center"}
          >
            <Loader />
          </Flex>
        )}
      </div>

      <Sidebar />
    </Container>
  );
};
