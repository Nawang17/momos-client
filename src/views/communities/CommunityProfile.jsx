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
  EyeSlash,
  GitPullRequest,
  Globe,
  LockLaminated,
  Note,
  Users,
  UsersThree,
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

import { CommunityProfileMenu } from "./CommunityProfileMenu";
import { JoinCommunity } from "../../api/POST";

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
  const [ismember, setIsmember] = useState(false);
  const { name } = useParams();
  const handleJoinCommunity = () => {
    JoinCommunity(name)
      .then((res) => {
        if (res.data.request) {
          showNotification({
            icon: <GitPullRequest size={18} />,
            message: res.data.message,
            autoClose: 5000,
          });
        } else {
          showNotification({
            icon: <UsersThree size={18} />,
            message: res?.data?.message,
            autoClose: 5000,
          });
          setIsmember(true);
          setCommunityInfo((prevState) => ({
            ...prevState,
            communitymembers: [
              ...prevState.communitymembers,
              {
                user: {
                  username: UserInfo?.username,
                  avatar: UserInfo?.avatar,
                },
              },
            ],
          }));
        }
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
  useEffect(() => {
    getcommunityprofile(name)
      .then((res) => {
        setCommunityInfo(res.data.community);
        if (!res.data.community.private) {
          setCommunityPosts(res.data.communityPosts);
          setPostsLoading(false);
        }
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
        setIsmember(true);
        if (res.data.private) {
          setCommunityPosts(res.data.communityPosts);
          setPostsLoading(false);
          setIsmember(true);
        }
      })
      .catch((err) => {
        setIsmember(false);
        setPostsLoading(false);
        if (err.response.status === 0) {
          showNotification({
            icon: <WarningCircle size={18} />,
            color: "red",
            title: "Internal Server Error",
            autoClose: 4000,
          });
        }
      });
  }, []);

  return (
    <Container px={0} className={classes.wrapper}>
      <div className={classes.leftWrapper}>
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
            padding: "1rem 1rem 0rem 1rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <ActionIcon onClick={() => navigate(-1)}>
            <ArrowLeft size="20px" />
          </ActionIcon>
          {ismember && <CommunityProfileMenu profiledata={communityInfo} />}
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
                <Flex
                  gap={10}
                  align={"center"}
                  direction={"column"}
                  justify={"center"}
                >
                  <Image
                    width={84}
                    height={84}
                    radius={"100%"}
                    withPlaceholder
                    src={communityInfo?.banner}
                  />
                  {!ismember && !communityInfo?.private && (
                    <Button
                      size="xs"
                      radius="lg"
                      onClick={() => {
                        handleJoinCommunity();
                      }}
                    >
                      Join
                    </Button>
                  )}
                </Flex>

                <Flex
                  style={{
                    width: "100%",
                  }}
                  direction={"column"}
                  gap={10}
                >
                  <Flex direction={"column"} gap={4}>
                    <Flex align={"center"} gap={20}>
                      <Text weight={700} size={"lg"}>
                        {communityInfo?.name}
                      </Text>
                    </Flex>

                    <Text size={"sm"}>{communityInfo?.description}</Text>
                  </Flex>
                  <Flex wrap={"wrap"} align={"center"} gap={10}>
                    {communityInfo?.communitymembers?.some(
                      (obj) =>
                        obj.isOwner && obj.user.username === UserInfo?.username
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
                          : " member"}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
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
                {postsLoading && (
                  <Flex
                    justify={"center"}
                    py={20}
                    style={{
                      backgroundColor: darkmode ? "#1A1B1E" : "white",
                      color: darkmode ? "white" : "black",
                    }}
                  >
                    <Loader />
                  </Flex>
                )}
                {!ismember && communityInfo?.private && !postsLoading ? (
                  <>
                    <Flex
                      direction={"column"}
                      align={"center"}
                      justify={"center"}
                      gap={10}
                      py={30}
                    >
                      <EyeSlash size={50} weight="light" />
                      <Text size={"lg"} color="dimmed">
                        Content is only visible to community members
                      </Text>
                      <Button
                        mt={10}
                        onClick={() => {
                          handleJoinCommunity();
                        }}
                      >
                        {communityInfo?.private
                          ? "Request to join"
                          : "Join Community"}
                      </Button>
                    </Flex>
                  </>
                ) : (
                  <>
                    {ismember && (
                      <CreatePost
                        darkmode={darkmode}
                        UserInfo={UserInfo}
                        communityName={name}
                      />
                    )}

                    {communityPosts?.length !== 0 && !postsLoading ? (
                      <PostFeed
                        setPosts={setCommunityPosts}
                        posts={communityPosts}
                        loading={postsLoading}
                      />
                    ) : (
                      <Flex
                        direction={"column"}
                        align={"center"}
                        gap={10}
                        p={30}
                        justify={"center"}
                        style={{
                          backgroundColor: darkmode ? "#1A1B1E" : "white",
                          color: darkmode ? "white" : "black",
                        }}
                      >
                        <Note color="gray" size={30} />
                        <Text size={"sm"} color="dimmed">
                          Get the conversation started. Be the first to post in
                          this community.
                        </Text>
                      </Flex>
                    )}
                  </>
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
                      onClick={() => {
                        navigate(`/${member?.user?.username}`);
                      }}
                      key={member?.user?.username}
                      style={{
                        width: "100%",
                        cursor: "pointer",
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
