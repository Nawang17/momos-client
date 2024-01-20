import { Flex, Image, Text } from "@mantine/core";
import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../../context/Auth";
import { Globe, LockLaminated, Users } from "@phosphor-icons/react";

const CommunityLink = ({ post }) => {
  const navigate = useNavigate();

  const { darkmode } = useContext(AuthContext);
  return (
    post.comshare && (
      <Flex
        onClick={() => {
          navigate(`/community/${post.comshare.name}`);
        }}
        style={{
          border: darkmode ? "1px solid #2f3136" : "1px solid #e6ecf0",
          cursor: "pointer",
          borderRadius: "8px",
          padding: "0.5rem",
        }}
        mx={"1rem"}
        justify={"space-between"}
        wrap={"wrap"}
        gap={10}
      >
        <Flex gap={10}>
          <Image
            width={100}
            height={100}
            miw={"auto"}
            radius={post.comshare.banner ? "sm" : "0"}
            withPlaceholder
            src={post.comshare.banner}
          />

          <Flex
            style={{
              width: "100%",
            }}
            gap={5}
            direction={"column"}
          >
            <Text weight={600}>{post.comshare.name}</Text>
            <Flex gap={3} align={"center"}>
              <Users size={15} weight="light" />

              <Text size={"sm"} color="dimmed">
                {post.comshare.communitymembers.length}{" "}
                {post.comshare.communitymembers.length > 1
                  ? "members"
                  : "member"}
              </Text>
            </Flex>
            <Flex gap={3} align={"center"}>
              {post.comshare.private ? (
                <LockLaminated size={15} weight="light" />
              ) : (
                <Globe size={15} weight="light" />
              )}

              <Text size={"sm"} color="dimmed">
                {post.comshare.private ? "Private" : "Public"}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    )
  );
};

export default CommunityLink;
