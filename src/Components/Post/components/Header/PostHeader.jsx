import { Avatar, Flex, Indicator, Text } from "@mantine/core";
import { UsersThree } from "@phosphor-icons/react";
import React, { useContext } from "react";
import Verifiedbadge from "../../../../helper/VerifiedBadge";
import Topuserbadge from "../../../../helper/Topuserbadge";
import { useLocation, useNavigate } from "react-router-dom";
import { PostMenu } from "./PostMenu";
import { AuthContext } from "../../../../context/Auth";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import locale from "date-fns/locale/en-US";
import { format } from "date-fns";
import { formatDistance } from "../../../../helper/DateFormat";

const PostHeader = ({ post, setPosts }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { onlineusers, topUser } = useContext(AuthContext);
  return (
    <Flex
      p="0rem 1rem"
      justify="space-between"
      //align center only if its a community post and the path is not in a community page
      // reason: this is because when its a community post, there is a extra div added on top for community name which add more space i added align center to make sure the post menu is aligned with the post user info and not the communtity name
      align={
        post?.community?.name &&
        pathname !== `/community/${post?.community?.name}` &&
        "center"
      }
    >
      {/* left side of header - contains user avatar, username, user badges, postdate*/}
      <div>
        {/* show the community name on top of post if it exist and the current page is no a community page  */}
        {post?.community?.name &&
          pathname !== `/community/${post?.community?.name}` && (
            <Flex
              className="addPointer"
              onClick={() => {
                navigate(`/community/${post?.community?.name}`);
              }}
              pb={6}
              gap={6}
              align={"center"}
            >
              <UsersThree weight="light" size={14} />
              <Text color="dimmed" size={14}>
                {post?.community?.name}
              </Text>
            </Flex>
          )}

        <Flex align={"center"} gap={"0.5rem"}>
          <Indicator
            // a green indicator shows on user avatar if user is online
            disabled={!onlineusers.includes(post?.user?.id)}
            className="addPointer"
            withBorder
            inline
            color="green"
            size={9}
            offset={7}
            position="bottom-end"
          >
            {/* post user's avatar */}
            <Avatar
              onClick={() => {
                //navigate to post user's profile
                navigate(`/${post?.user?.username}`);
              }}
              size="40px"
              radius="xl"
              src={post?.user?.avatar}
            />
          </Indicator>

          {/* right side of the left side of header that contains username, user badges, postDate */}

          <Flex direction="column">
            <Flex align="center" gap="0.2rem">
              {/* post user's username */}
              <Text
                className="addPointer"
                onClick={() => {
                  //navigate to post user's profile
                  navigate(`/${post?.user?.username}`);
                }}
                weight={500}
                size="15px"
              >
                {post?.user?.username}
              </Text>
              {/* show verified badge if post user is verified */}
              {post?.user?.verified && <Verifiedbadge />}
              {/* show top user badge if post user is the top user (most points) */}
              {topUser === post.user.username && <Topuserbadge />}
            </Flex>
            {/* if the post is being viewed in a single page view then show the date as h:mm a  ·  MM/dd/yyyy */}
            {/* else show date as distancetonow (1h, 5h, 1d, 4d) */}
            <Text color="dimmed" size={12}>
              {pathname.substring(0, pathname.indexOf("/", 1)) === "/post" ||
              pathname.substring(0, pathname.indexOf("/", 1)) ===
                "/communitypost"
                ? //single page view date format h:mm a  ·  MM/dd/yyyy
                  format(new Date(post.createdAt), "h:mm a  ·  MM/dd/yyyy")
                : //not single page view date format (1h, 5h, 1d, 4d)
                  formatDistanceToNowStrict(new Date(post.createdAt), {
                    locale: {
                      ...locale,
                      formatDistance,
                    },
                  })}
            </Text>
          </Flex>
        </Flex>
      </div>
      {/* right side of header that has the post menu   */}
      <PostMenu postinfo={post} setPosts={setPosts} />
    </Flex>
  );
};

export default PostHeader;
