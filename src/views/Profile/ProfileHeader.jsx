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
  BackgroundImage,
  Progress,
  Flex,
} from "@mantine/core";
import {
  ArrowLeft,
  WarningCircle,
  Lock,
  UserPlus,
  UserMinus,
  CalendarBlank,
  UsersThree,
  Link,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { follow } from "../../api/POST";
import { AuthContext } from "../../context/Auth";

import { getchat, profilefollowdata } from "../../api/GET";
import { useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import Topuserbadge from "../../helper/Topuserbadge";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import locale from "date-fns/locale/en-US";
import ImageViewer from "react-simple-image-viewer";
import { formatDistance } from "../../helper/DateFormat";
import { calculateLevelAndProgress } from "../../helper/helperfunctions";
import { getRankInfo } from "../../helper/RankInfo";
import Verifiedbadge from "../../helper/VerifiedBadge";
import { formatText } from "../../helper/FormatText";
import { Trans } from "@lingui/macro";
const useStyles = createStyles(() => ({
  wrapper: {
    background: "white",
    padding: "0rem 1.5rem 0.5rem 1rem",
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

  const {
    UserInfo,
    setfollowingdata,
    followingdata,
    darkmode,
    onlineusers,
    topUser,
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const { classes } = useStyles();
  const [followers, setfollowers] = useState([]);
  const [followerArr, setfollowerArr] = useState([]);
  const [following, setfollowing] = useState([]);
  const [followingArr, setfollowingArr] = useState([]);
  const [loading, setloading] = useState(true);
  const [unfollowconfirm, setunfollowconfirm] = useState(false);
  const [btndisabled, setbtndisabled] = useState(false);
  const [imgopen, setimgopen] = useState(false);
  const [banneropen, setbanneropen] = useState(false);
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
        title: <Trans>Login required</Trans>,
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
              message: (
                <Trans>You are now following {profileInfo.username}</Trans>
              ),
              autoClose: 3000,
            });
          } else {
            showNotification({
              icon: <UserMinus size={18} />,
              message: (
                <Trans>
                  You are no longer following {profileInfo.username}
                </Trans>
              ),
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

  const totalPoints = rankinfo?.points;

  return (
    <>
      {!loading && !profileloading ? (
        <>
          <div
            style={{
              paddingBottom: "0.5rem",
              backgroundColor: darkmode ? "#1A1B1E" : "white",
            }}
          >
            <BackgroundImage
              onClick={() => [setbanneropen(true)]}
              style={{
                cursor: "pointer",
              }}
              src={
                profileInfo?.profilebanner?.imageurl
                  ? profileInfo?.profilebanner?.imageurl
                  : darkmode
                  ? `https://ui-avatars.com/api/?background=373A40&color=fff&name=&size=1920`
                  : `https://ui-avatars.com/api/?background=dee2e6&color=fff&name=&size=1920`
              }
              radius="xs"
            >
              <>
                <div
                  style={{
                    padding: "1rem 0rem 0rem 1rem",
                  }}
                >
                  <ActionIcon
                    radius="lg"
                    color="dark"
                    variant="light"
                    onClick={() => navigate(-1)}
                  >
                    <ArrowLeft size="20px" />
                  </ActionIcon>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",

                    height: "10rem",
                  }}
                >
                  <Indicator
                    style={{
                      padding: "1rem 0rem 0rem 0.5rem",
                      marginBottom: "-8rem",
                    }}
                    disabled={!onlineusers.includes(profileInfo?.id)}
                    color={"green"}
                    withBorder
                    inline
                    position="bottom-end"
                    offset={18}
                    size={16}
                  >
                    <Avatar
                      onClick={(e) => e.stopPropagation()[setimgopen(true)]}
                      style={{
                        cursor: "pointer",
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        border: !darkmode
                          ? "5px solid white"
                          : "5px solid #1A1B1E",
                      }}
                      size="lg"
                      src={profileInfo?.avatar}
                    />
                  </Indicator>
                  {/* profile info */}
                </div>
              </>
            </BackgroundImage>
          </div>
          <div
            style={{
              backgroundColor: darkmode ? "#1A1B1E" : "white",
              color: darkmode ? "white" : "black",
              padding: "2rem 1.5rem 0rem 1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "auto",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <Text weight={500} size={"lg"}>
                  {" "}
                  {userprofile}
                </Text>
                {profileInfo?.verified && <Verifiedbadge />}
                {topUser === userprofile && <Topuserbadge />}
                <div>
                  {rankinfo.rank && (
                    <Text color={"#71767b"} weight={500} size={"md"}>
                      #{rankinfo.rank}
                    </Text>
                  )}
                </div>
              </div>
              {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: darkmode ? "rgb(40 39 37)" : "gray",
                  borderRadius: "4px",
                  gap: "0.5rem",
                  padding: "0.2rem 0.5rem 0.2rem 0.5rem",
                }}
              >
               
                <Star
                  style={{
                    cursor: "pointer",
                  }}
                  size={20}
                  weight="fill"
                  color="gold"
                />{" "}
                <Plant
                  style={{
                    cursor: "pointer",
                  }}
                  color="#5ef90b"
                  size={20}
                  weight="fill"
                />
              </div> */}
            </div>
            {!onlineusers.includes(profileInfo?.id) &&
              profileInfo?.lastseen && (
                <Text color="dimmed" size="xs">
                  <Trans>
                    Active{" "}
                    {formatDistanceToNowStrict(
                      new Date(profileInfo?.lastseen),
                      {
                        locale: {
                          ...locale,
                          formatDistance,
                        },
                      }
                    )}{" "}
                    ago
                  </Trans>
                </Text>
              )}
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              paddingBottom: "0.5rem",
              backgroundColor: darkmode ? "#1A1B1E" : "white",
            }}
          >
            <BackgroundImage
              src={
                darkmode
                  ? `https://ui-avatars.com/api/?background=373A40&color=fff&name=&size=1920`
                  : `https://ui-avatars.com/api/?background=dee2e6&color=fff&name=&size=1920`
              }
              radius="xs"
            >
              <>
                <div
                  style={{
                    padding: "1rem 0rem 0rem 1rem",
                  }}
                >
                  <ActionIcon
                    radius="lg"
                    color="dark"
                    variant="light"
                    onClick={() => navigate(-1)}
                  >
                    <ArrowLeft size="20px" />
                  </ActionIcon>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",

                    height: "10rem",
                  }}
                >
                  <Indicator
                    style={{
                      padding: "1rem 0rem 0rem 0.5rem",
                      marginBottom: "-8rem",
                    }}
                    disabled={true}
                    color={"green"}
                    withBorder
                    inline
                    position="bottom-end"
                    offset={18}
                    size={16}
                  >
                    <Skeleton height={100} circle />
                  </Indicator>
                  {/* profile info */}
                </div>
              </>
            </BackgroundImage>
          </div>
          <div
            style={{
              backgroundColor: darkmode ? "#1A1B1E" : "white",
              color: darkmode ? "white" : "black",
              padding: "2rem 1.5rem 0rem 1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "auto",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              <Text weight={500} size={"lg"}>
                {" "}
                {userprofile}
              </Text>
            </div>
          </div>
        </>
      )}

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
                    <Trans>Edit profile</Trans>
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
                    <Trans>Share profile</Trans>
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
                    <Trans>Following</Trans>
                  </Button>
                  <Button
                    onClick={async () => {
                      if (!UserInfo) {
                        showNotification({
                          icon: <Lock size={18} />,
                          title: <Trans>Login required</Trans>,
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
                    size="xs"
                    variant="default"
                    color={"gray"}
                    fullWidth
                  >
                    <Trans>Message</Trans>
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
                    {followingArr.includes(UserInfo?.username) ? (
                      <Trans>Follow back</Trans>
                    ) : (
                      <Trans>Follow</Trans>
                    )}
                  </Button>
                  <Button
                    size="xs"
                    onClick={async () => {
                      if (!UserInfo) {
                        showNotification({
                          icon: <Lock size={18} />,
                          title: <Trans>Login required</Trans>,
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
                    <Trans>Message</Trans>
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
                <Text>{formatText(profileInfo?.description, navigate)}</Text>
              </div>
            )}

            {/* users link  */}
            {profileInfo?.link && (
              <Flex gap="0.4rem" align="center">
                <Link color={"#71767b"} size={18} />
                <div
                  style={{
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <Text
                    onClick={() => {
                      window.open(profileInfo?.link, "_blank");
                    }}
                    className="link-style"
                    style={{
                      color: "#1d9bf0",
                    }}
                  >
                    {profileInfo?.link}
                  </Text>
                </div>
              </Flex>
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
                  <Trans>
                    <Text component="span" pr={3}>
                      Joined
                    </Text>
                    {new Date(profileInfo?.createdAt).toLocaleString(
                      "default",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </Trans>
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
                    <Trans>Following</Trans>
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
                    <Trans>Followers</Trans>
                  </Text>
                </Text>
              </div>
            </div>
          </div>

          {/* account level and progress */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.4rem 0.7rem",
              borderRadius: "4px",

              gap: "0.5rem",
              backgroundColor: `${getRankInfo(totalPoints).backgroundColor}`,
              color: `${getRankInfo(totalPoints).color}`,
            }}
          >
            <ActionIcon
              className="heartbeat-icon"
              color="dark"
              variant="filled"
              radius="xl"
              size="lg"
            >
              {getRankInfo(totalPoints).icon}
            </ActionIcon>

            <div
              style={{
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "0.5rem 0",
                  gap: "0.5rem",
                }}
              >
                <Text
                  style={{
                    cursor: "pointer",
                  }}
                  size="xs"
                  weight={500}
                >
                  {getRankInfo(totalPoints).rankName} Rank - {rankinfo?.points}{" "}
                  points
                </Text>
              </div>
              <Progress
                value={
                  (calculateLevelAndProgress(totalPoints).progress /
                    calculateLevelAndProgress(totalPoints).totalPointsInLevel) *
                  100
                }
                mt={4}
                radius="xl"
                size={"lg"}
                color="#17caad"
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "0.2rem",
                }}
              >
                <Text
                  style={{
                    cursor: "pointer",
                  }}
                  size="sm"
                  weight={600}
                >
                  <Trans>
                    Level {calculateLevelAndProgress(totalPoints).level}
                  </Trans>
                </Text>
                <Text pt={5} size="xs" weight={500}>
                  <Trans>
                    <Text component="span">
                      {calculateLevelAndProgress(totalPoints)
                        .totalPointsInLevel -
                        calculateLevelAndProgress(totalPoints).progress}{" "}
                      points to
                    </Text>{" "}
                    Level {calculateLevelAndProgress(totalPoints).level + 1}
                  </Trans>
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
                      {item.following.verified && <Verifiedbadge />}
                      {topUser === item.following.username && <Topuserbadge />}
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
                      {item.follower.verified && <Verifiedbadge />}
                      {topUser === item.follower.username && <Topuserbadge />}
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
          <div className="dpm-header">
            <Trans>Unfollow {userprofile}?</Trans>
          </div>
          <div className="dpm-body">
            <Trans>
              This can’t be undone and this user will be removed from your
              following.
            </Trans>
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
              <Trans>Unfollow</Trans>
            </Button>
            <Button
              onClick={() => setunfollowconfirm(false)}
              variant="outline"
              color="gray"
              radius="xl"
            >
              <Trans>Cancel</Trans>
            </Button>
          </div>
        </div>
      </Modal>

      {/* view user profile image */}

      {imgopen && (
        <ImageViewer
          backgroundStyle={{
            zIndex: 1000,
          }}
          src={[profileInfo?.avatar]}
          currentIndex={0}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={() => {
            setimgopen(false);
          }}
        />
      )}

      {/* view user profile banner image  */}
      {banneropen && (
        <ImageViewer
          backgroundStyle={{
            zIndex: 1000,
          }}
          src={[
            profileInfo?.profilebanner?.imageurl
              ? profileInfo?.profilebanner?.imageurl
              : darkmode
              ? `https://ui-avatars.com/api/?background=373A40&color=fff&name=&size=1920`
              : `https://ui-avatars.com/api/?background=dee2e6&color=fff&name=&size=1920`,
          ]}
          currentIndex={0}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={() => {
            setbanneropen(false);
          }}
        />
      )}
    </>
  );
};
