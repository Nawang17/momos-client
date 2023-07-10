import {
  ActionIcon,
  Button,
  Container,
  Flex,
  Tabs,
  Text,
  Image,
  createStyles,
  Input,
  Title,
} from "@mantine/core";
import {
  ArrowLeft,
  Globe,
  LockLaminated,
  Users,
  UsersThree,
} from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../Components/Sidebar";
import { AuthContext } from "../../context/Auth";
import Createnewcommunity from "./Createnewcommunity";
import FindCommunity from "./FindCommunity";
import { getallcommunities, getcommunities } from "../../api/GET";

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

export const Communities = () => {
  const { classes } = useStyles();
  const { darkmode, UserInfo } = useContext(AuthContext);
  const [myCommunities, setMyCommunities] = useState([]);
  const [findCommunities, setFindCommunities] = useState([]); // [
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState();
  useEffect(() => {
    if (!UserInfo) {
      setActiveTab("Find communities");
      getallcommunities().then((res) => {
        setFindCommunities(res.data.findcommunities);
      });
    } else {
      setActiveTab("My communities");
      getcommunities().then((res) => {
        setMyCommunities(res.data.mycommunities);
        setFindCommunities(res.data.findcommunities);
      });
    }
  }, []);
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
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
            padding: "1rem 1rem 0.5rem 1rem",
          }}
        >
          <Tabs value={activeTab} onTabChange={setActiveTab}>
            <Tabs.List grow>
              <Tabs.Tab value="My communities">My communities</Tabs.Tab>
              <Tabs.Tab value="Find communities">Find communities</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="My communities">
              {!UserInfo ? (
                <Flex
                  align={"center"}
                  gap={15}
                  justify={"center"}
                  wrap={"wrap"}
                >
                  <UsersThree size={30} />
                  <Text size={"lg"} py={40} align="center">
                    Login to see your communities
                  </Text>
                </Flex>
              ) : (
                <>
                  {" "}
                  <Createnewcommunity />
                  <Input
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    my="md"
                    placeholder="Search for communities 
             "
                  />
                  <Flex gap={20} direction={"column"}>
                    {myCommunities
                      .filter((value) => {
                        if (search === "") {
                          return value;
                        } else if (
                          value.community.name
                            .toLowerCase()
                            .includes(search.toLowerCase())
                        ) {
                          return value;
                        }
                        return null;
                      })
                      .map((community) => (
                        <Flex
                          onClick={() => {
                            navigate(`/community/${community.community.name}`);
                          }}
                          style={{
                            cursor: "pointer",
                          }}
                          key={community.communityId}
                        >
                          <Flex gap={10}>
                            <Image
                              width={100}
                              height={100}
                              miw={"auto"}
                              radius={community.community.banner ? "sm" : "0"}
                              withPlaceholder
                              src={community.community.banner}
                            />

                            <Flex
                              style={{
                                width: "100%",
                              }}
                              gap={5}
                              direction={"column"}
                            >
                              <Text weight={600}>
                                {community.community.name}
                              </Text>
                              <Flex gap={3} align={"center"}>
                                <Users size={15} weight="light" />

                                <Text size={"sm"} color="dimmed">
                                  {community.community.communitymembers.length}{" "}
                                  {community.community.communitymembers.length >
                                  1
                                    ? "members"
                                    : "member"}
                                </Text>
                              </Flex>
                              <Flex gap={3} align={"center"}>
                                {community.community.private ? (
                                  <LockLaminated size={15} weight="light" />
                                ) : (
                                  <Globe size={15} weight="light" />
                                )}

                                <Text size={"sm"} color="dimmed">
                                  {community.community.private
                                    ? "Private"
                                    : "Public"}
                                </Text>
                              </Flex>
                            </Flex>
                          </Flex>
                        </Flex>
                      ))}
                  </Flex>
                </>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="Find communities">
              <FindCommunity
                findCommunities={findCommunities}
                setFindCommunities={setFindCommunities}
              />
            </Tabs.Panel>
          </Tabs>
        </div>
      </div>

      <Sidebar />
    </Container>
  );
};
