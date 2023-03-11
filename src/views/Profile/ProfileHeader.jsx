import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Modal,
  createStyles,
  Text,
  ActionIcon,
  Skeleton,
  Avatar,
  Indicator,
} from "@mantine/core";
import {
  ArrowLeft,
  CircleWavyCheck,
  WarningCircle,
  Lock,
  UserPlus,
  UserMinus,
  CrownSimple,
  CalendarBlank,
  UsersThree,
} from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { follow } from "../../api/POST";
import { AuthContext } from "../../context/Auth";

import { getchat, profilefollowdata } from "../../api/GET";
import { useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import reactStringReplace from "react-string-replace";
const useStyles = createStyles(() => ({
  wrapper: {
    background: "white",
    padding: "0rem 1.5rem 0.5rem 1rem  ",
    gap: "0.5rem",
    display: "flex",
    flexDirection: "column",
  },
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
  },
  right: {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
  },
}));
export const ProfileHeader = ({ profileInfo, profileloading, rankinfo }) => {
  const { userprofile } = useParams();

  const { UserInfo, setfollowingdata, followingdata, darkmode, onlineusers } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const { classes } = useStyles();
  const [followers, setfollowers] = useState([]);
  const [followerArr, setfollowerArr] = useState([]);
  const [following, setfollowing] = useState([]);
  const [followingArr, setfollowingArr] = useState([]);
  const [loading, setloading] = useState(true);
  const [unfollowconfirm, setunfollowconfirm] = useState(false);
  const [btndisabled, setbtndisabled] = useState(false);

  useEffect(() => {
    setloading(true);
    setbtndisabled(true);
    profilefollowdata({
      username: userprofile,
    })
      .then((res) => {
        setfollowers(res.data.userFollowers);
        setfollowerArr(res.data.userfollowerarr);
        setfollowing(res.data.userFollowing);
        setfollowingArr(res.data.userfollowingarr);
        setloading(false);
        setbtndisabled(false);
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
  }, [userprofile]);
  const handlefollow = () => {
    setbtndisabled(true);
    if (!UserInfo) {
      setbtndisabled(false);
      showNotification({
        icon: <Lock size={18} />,
        title: "Login required",
        autoClose: 3000,
        color: "red",
      });
    } else {
      follow({ followingid: profileInfo.id })
        .then((res) => {
          if (res.data.followed) {
            setfollowers((prev) => [...prev, res.data.newFollowing]);
            setfollowerArr((prev) => [
              ...prev,
              res.data.newFollowing.follower.username,
            ]);
            setfollowingdata((prev) => [
              ...prev,
              res.data.newFollowing.following.username,
            ]);

            setbtndisabled(false);
            showNotification({
              icon: <UserPlus size={18} />,
              message: `You are now following ${profileInfo.username}`,
              autoClose: 3000,
            });
          } else {
            showNotification({
              icon: <UserMinus size={18} />,
              message: `You are no longer following ${profileInfo.username}`,
              autoClose: 3000,
            });
            setfollowers((prev) => {
              return prev.filter(
                (item) => item.follower.username !== UserInfo?.username
              );
            });
            setfollowerArr((prev) => {
              return prev.filter((item) => item !== UserInfo?.username);
            });
            setfollowingdata((prev) => {
              return prev.filter((item) => item !== userprofile);
            });
          }
          setbtndisabled(false);
        })
        .catch((err) => {
          if (err.response.status === 0) {
            showNotification({
              icon: <WarningCircle size={18} />,
              color: "red",
              title: "Internal Server Error",
              autoClose: 4000,
            });
            setbtndisabled(false);
          } else {
            showNotification({
              icon: <WarningCircle size={18} />,
              color: "red",
              title: err.response.data,
              autoClose: 4000,
            });

            setbtndisabled(false);
          }
        });
    }
  };
  const [opened, setOpened] = useState(false);
  const [modaltitle, setmodaltitle] = useState("");
  const description = (text) => {
    let replacedText;

    // Match URLs
    replacedText = reactStringReplace(text, /(https?:\/\/\S+)/g, (match, i) => (
      <span
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = match;
        }}
        className="link-style"
        style={{
          color: "#1d9bf0",
        }}
        key={match + i}
      >
        {match}
      </span>
    ));

    // Match @-mentions

    replacedText = reactStringReplace(replacedText, /@(\w+)/g, (match, i) => (
      <span
        className="link-style"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/${match}`);
        }}
        style={{ color: "#1d9bf0" }}
        key={match + i}
      >
        @{match}
      </span>
    ));

    // Match hashtags
    replacedText = reactStringReplace(replacedText, /#(\w+)/g, (match, i) => (
      <span
        className="link-style"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/search/q/%23${match}`);
        }}
        style={{ color: "#1d9bf0" }}
        key={match + i}
      >
        #{match}
      </span>
    ));

    return replacedText;
  };
  return (
    <>
      <div
        style={{
          backgroundColor: darkmode ? "#1A1B1E" : "white",
          color: darkmode ? "white" : "black",
          padding: "1rem 0rem 0rem 1rem",
        }}
      >
        <ActionIcon onClick={() => navigate(-1)}>
          <ArrowLeft size="20px" />
        </ActionIcon>
      </div>
      {!loading && !profileloading ? (
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
            paddingTop: "1rem",
            paddingBottom: "0.5rem",
          }}
          className={classes.wrapper}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              fontSize: "15px",
            }}
          >
            {/* profile avatar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                paddingBottom: "0.7rem",
              }}
            >
              <Indicator
                disabled={!onlineusers.includes(profileInfo?.id)}
                color={"green"}
                withBorder
                inline
                position="bottom-end"
                offset={10}
                size={13}
              >
                <Avatar
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                  }}
                  size="lg"
                  src={profileInfo?.avatar}
                />
              </Indicator>
              {/* profile info */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "auto",
                  }}
                >
                  <Text weight={500} size={"lg"}>
                    {" "}
                    {userprofile}
                  </Text>
                  <div>
                    <Text color={"#71767b"} weight={500} size={"sm"}>
                      {" "}
                      Rank #{rankinfo.rank}
                    </Text>
                    {/* <Badge>Rank #{rankinfo.rank}</Badge> */}
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                paddingBottom: "0.4rem",
              }}
            >
              {UserInfo?.username === profileInfo.username ? (
                <>
                  <Button
                    size="xs"
                    variant="default"
                    onClick={() => {
                      navigate("/editprofile");
                    }}
                    color={"gray"}
                    fullWidth
                  >
                    Edit profile
                  </Button>
                  <Button
                    size="xs"
                    variant="default"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: "Share Profile",
                          url: `https://momosz.com/${userprofile}`,
                        });
                      }
                    }}
                    color={"gray"}
                    fullWidth
                  >
                    Share profile
                  </Button>
                </>
              ) : followingdata?.includes(profileInfo?.username) ? (
                <>
                  <Button
                    size="xs"
                    fullWidth
                    disabled={btndisabled}
                    variant="default"
                    onClick={() => {
                      setunfollowconfirm(true);
                    }}
                  >
                    Following
                  </Button>
                  <Button size="xs" variant="default" color={"gray"} fullWidth>
                    Message
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="xs"
                    disabled={btndisabled}
                    onClick={() => {
                      handlefollow();
                    }}
                    fullWidth
                  >
                    {followingArr.includes(UserInfo?.username)
                      ? "Follow back"
                      : "Follow"}
                  </Button>
                  <Button
                    size="xs"
                    onClick={async () => {
                      if (!UserInfo) {
                        showNotification({
                          icon: <Lock size={18} />,
                          title: "Login required",
                          autoClose: 3000,
                          color: "red",
                        });
                      } else {
                        await getchat(profileInfo?.id)
                          .then((res) => {
                            navigate(`/chat/${res.data.chatroomid}`);
                          })
                          .catch(() => {});
                      }
                    }}
                    variant="default"
                    color={"gray"}
                    fullWidth
                  >
                    Message
                  </Button>
                </>
              )}
            </div>
            {/* description */}
            {profileInfo?.description && (
              <div
                style={{
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                <Text>{description(profileInfo?.description)}</Text>
              </div>
            )}
            {/* joined date */}
            {profileInfo?.createdAt && (
              <div
                style={{
                  display: "flex",
                  gap: "0.4rem",
                  alignItems: "center",
                }}
              >
                <CalendarBlank color={"#71767b"} size={18} />
                <Text color={"#71767b"} weight={"400"}>
                  Joined{" "}
                  {new Date(profileInfo?.createdAt).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <UsersThree color={"#71767b"} size={18} />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <Text
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setOpened(true);
                    setmodaltitle(`Following (${following.length})`);
                  }}
                  weight={500}
                >
                  {following.length}{" "}
                  <Text color={"#71767b"} weight={"400"} component="span">
                    Following
                  </Text>
                </Text>
                <Text
                  onClick={() => {
                    setOpened(true);

                    setmodaltitle(`Followers (${followers.length})`);
                  }}
                  style={{
                    cursor: "pointer",
                  }}
                  weight={500}
                >
                  {followers.length}{" "}
                  <Text color={"#71767b"} weight={"400"} component="span">
                    Followers
                  </Text>
                </Text>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
            paddingTop: "1rem",
            paddingBottom: "0.5rem",
          }}
          className={classes.wrapper}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.7rem",
              fontSize: "15px",
            }}
          >
            {/* profile avatar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                paddingBottom: "0.7rem",
              }}
            >
              <div>
                <Skeleton height={70} circle />
              </div>
              {/* profile info */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.3rem",
                    alignItems: "center",
                  }}
                >
                  <Text weight={500} size={"lg"}>
                    {" "}
                    {userprofile}
                  </Text>
                </div>
              </div>
            </div>

            {/* description */}
            <Skeleton height={5} width={"60%"} mb={10} />
            <Skeleton height={5} width={"50%"} mb={10} />
            <Skeleton height={5} width={"40%"} mb={10} />
          </div>
        </div>
      )}

      <Modal
        zIndex={1000}
        size="sm"
        overflow="inside"
        opened={opened}
        onClose={() => setOpened(false)}
        title={modaltitle}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {modaltitle === `Following (${following.length})` ? (
            <>
              {following.map((item) => {
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      navigate(`/${item.following.username}`);
                      setOpened(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      loading="lazy"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                      src={item.following.avatar}
                      alt=""
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      {" "}
                      <Text weight="500">{item.following.username}</Text>
                      {item.following.verified &&
                        (item.following.id !== 5 ? (
                          <CircleWavyCheck
                            size={17}
                            color="#0ba6da"
                            weight="fill"
                          />
                        ) : (
                          <CircleWavyCheck
                            size={17}
                            color="#0ba6da"
                            weight="fill"
                          />
                        ))}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {" "}
              {followers.map((item) => {
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      navigate(`/${item.follower.username}`);
                      setOpened(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      loading="lazy"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                      src={item.follower.avatar}
                      alt=""
                    />
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      {" "}
                      <Text weight="500">{item.follower.username}</Text>
                      {item.follower.verified &&
                        (item.follower.id !== 5 ? (
                          <CircleWavyCheck
                            size={17}
                            color="#0ba6da"
                            weight="fill"
                          />
                        ) : (
                          <CircleWavyCheck
                            size={17}
                            color="#0ba6da"
                            weight="fill"
                          />
                        ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </Modal>
      <Modal
        zIndex={1000}
        overlayOpacity={0.3}
        padding={0}
        withCloseButton={false}
        size="xs"
        opened={unfollowconfirm}
        onClose={() => setunfollowconfirm(false)}
      >
        <div className="dpm">
          <div className="dpm-header">Unfollow {userprofile}?</div>
          <div className="dpm-body">
            This can’t be undone and this user will be removed from your
            following.
          </div>
          <div className="dpm-footer">
            <Button
              weight={"filled"}
              color={"gray"}
              onClick={() => {
                handlefollow();
                setunfollowconfirm(false);
              }}
              radius="xl"
            >
              Unfollow
            </Button>
            <Button
              onClick={() => setunfollowconfirm(false)}
              variant="outline"
              color="gray"
              radius="xl"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
