import React, { useState } from "react";
import { Flex, Text, Image, Input, Loader } from "@mantine/core";
import { Globe, LockLaminated, Users } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { Trans } from "@lingui/macro";
const FindCommunity = ({ findCommunities, loading }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  return (
    <>
      <Input
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        my="md"
        placeholder="Search for communities
             "
      />
      {findCommunities.length === 0 && !loading && (
        <Text py={20} align="center" size="sm" color="dimmed">
          <Trans> You are already a member of all communities</Trans>
        </Text>
      )}
      {loading && (
        <Flex py={20} justify={"center"}>
          <Loader />
        </Flex>
      )}
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
              onClick={() => [navigate(`/community/${value.name}`)]}
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
            </Flex>
          ))}
      </Flex>
    </>
  );
};

export default FindCommunity;
