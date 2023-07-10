import React, { useState } from "react";
import { Flex, Text, Image, Input, Button } from "@mantine/core";
import {
  GitPullRequest,
  Globe,
  LockLaminated,
  Users,
  UsersThree,
  WarningCircle,
} from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { JoinCommunity } from "../../api/POST";
import { showNotification } from "@mantine/notifications";
const FindCommunity = ({ findCommunities, setFindCommunities }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const handleJoinCommunity = (communityName) => {
    JoinCommunity(communityName)
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
          navigate(`/community/${communityName}`);
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
  return (
    <>
      <Input
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        my="md"
        placeholder="Search 
             "
      />
      <Flex gap={20} direction={"column"}>
        {findCommunities
          .filter((value) => {
            if (search === "") {
              return value;
            } else if (
              value.name.toLowerCase().includes(search.toLowerCase())
            ) {
              return value;
            }
            return null;
          })
          .map((value) => (
            <Flex
              justify={"space-between"}
              style={{
                cursor: "pointer",
              }}
              key={value.id}
            >
              <Flex gap={10}>
                <Image
                  width={100}
                  height={100}
                  miw={"auto"}
                  radius={value.banner ? "sm" : "0"}
                  withPlaceholder
                  src={value.banner}
                />

                <Flex
                  style={{
                    width: "100%",
                  }}
                  gap={5}
                  direction={"column"}
                >
                  <Text weight={600}>{value.name}</Text>
                  <Flex gap={3} align={"center"}>
                    <Users size={15} weight="light" />

                    <Text size={"sm"} color="dimmed">
                      {value.communitymembers.length}{" "}
                      {value.communitymembers.length > 1 ? "members" : "member"}
                    </Text>
                  </Flex>
                  <Flex gap={3} align={"center"}>
                    {value.private ? (
                      <LockLaminated size={15} weight="light" />
                    ) : (
                      <Globe size={15} weight="light" />
                    )}

                    <Text size={"sm"} color="dimmed">
                      {value.private ? "Private" : "Public"}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              {value.private ? (
                <Button
                  onClick={() => {
                    handleJoinCommunity(value.name);
                  }}
                  color="gray"
                  size="xs"
                >
                  Request Access
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    handleJoinCommunity(value.name);
                  }}
                  color="gray"
                  size="xs"
                >
                  Join community
                </Button>
              )}
            </Flex>
          ))}
      </Flex>
    </>
  );
};

export default FindCommunity;
