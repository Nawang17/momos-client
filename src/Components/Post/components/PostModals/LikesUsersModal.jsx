import React from "react";
import Topuserbadge from "../../../../helper/Topuserbadge";
import Verifiedbadge from "../../../../helper/VerifiedBadge";
import { Avatar, Flex, Modal, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/Auth";
import { useContext } from "react";
import { Trans } from "@lingui/macro";

const LikesUsersModal = ({ post, likemodalstate, setlikemodalstate }) => {
  const { topUser } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      <Modal
        zIndex={1000}
        title={<Trans>{`Likes (${post?.likes?.length})`}</Trans>}
        overflow="inside"
        opened={likemodalstate}
        onClose={() => {
          setlikemodalstate(false);
        }}
      >
        <Flex direction="column" gap="1rem">
          {post?.likes
            ?.map((likeuser) => {
              return (
                <Flex
                  key={likeuser?.user?.username}
                  onClick={() => {
                    // navigate to user profile
                    navigate(`/${likeuser?.user?.username}`);
                  }}
                  className="addPointer"
                  gap="0.5rem"
                  align="center"
                  padding="0.5rem 0.5rem 0.5rem 0"
                >
                  {/* show like user's avatar, username, user badges */}
                  <Avatar
                    size="40px"
                    radius="xl"
                    src={likeuser?.user?.avatar}
                  />

                  <Flex align="center" gap="0.3rem">
                    {/* username */}
                    <Text weight={500}> {likeuser?.user?.username}</Text>
                    {/* verified badge if user is verified */}
                    {likeuser?.user?.verified && <Verifiedbadge />}
                    {/* top user badge if user is top user */}
                    {topUser === likeuser?.user?.username && <Topuserbadge />}
                  </Flex>
                </Flex>
              );
            })
            .reverse()}
        </Flex>
        {/* reverse the array to show the latest likes first */}
      </Modal>
    </>
  );
};

export default LikesUsersModal;
