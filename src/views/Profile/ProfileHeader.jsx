import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Modal,
  createStyles,
  Text,
  ActionIcon,
  Skeleton,
  Badge,
  Popover,
} from "@mantine/core";
import {
  ArrowLeft,
  CircleWavyCheck,
  WarningCircle,
  Lock,
  UserPlus,
  UserMinus,
} from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { follow } from "../../api/POST";
import { AuthContext } from "../../context/Auth";
import format from "date-fns/format";
import { profilefollowdata } from "../../api/GET";
import { useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import * as DOMPurify from "dompurify";
const useStyles = createStyles(() => ({
  wrapper: {
    background: "white",
    padding: "1rem 1.5rem 0.5rem 1rem  ",
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
    gap: "0.5rem",
  },
}));
export const ProfileHeader = ({ profileInfo, profileloading }) => {
  const { userprofile } = useParams();

  const { UserInfo, setfollowingdata, followingdata, darkmode } =
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
  const sanitizer = DOMPurify.sanitize;
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
      {!loading ? (
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
          }}
          className={classes.wrapper}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
            className={classes.left}
          >
            {!profileloading ? (
              <img
                loading="lazy"
                className={classes.avatar}
                src={profileInfo?.avatar}
                alt=""
              />
            ) : (
              <Skeleton height={60} circle />
            )}

            {!profileloading && (
              <>
                {UserInfo?.username === profileInfo.username ? (
                  <>
                    <Button
                      onClick={() => {
                        navigate("/editprofile");
                      }}
                      variant="default"
                      radius={"xl"}
                      size="xs"
                    >
                      Edit profile
                    </Button>
                  </>
                ) : followingdata?.includes(profileInfo?.username) ? (
                  <Button
                    disabled={btndisabled}
                    variant="default"
                    onClick={() => {
                      setunfollowconfirm(true);
                    }}
                    radius={"xl"}
                    size="xs"
                  >
                    Following
                  </Button>
                ) : (
                  <Button
                    disabled={btndisabled}
                    onClick={() => {
                      handlefollow();
                    }}
                    radius={"xl"}
                    size="xs"
                  >
                    Follow
                  </Button>
                )}
              </>
            )}
          </div>
          <div className={classes.right}>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
              >
                <Text weight="bold" size="md">
                  {userprofile}
                </Text>
                {profileInfo?.verified &&
                  (profileInfo?.id !== 5 ? (
                    <Popover width={200} position="right" withArrow shadow="md">
                      <Popover.Target>
                        <CircleWavyCheck
                          size={17}
                          color="#0ba6da"
                          weight="fill"
                        />
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Text size="sm">
                          This account is verified because the user has a
                          verified email address.
                        </Text>
                      </Popover.Dropdown>
                    </Popover>
                  ) : (
                    <Popover width={130} position="right" withArrow shadow="md">
                      <Popover.Target>
                        <CircleWavyCheck
                          size={17}
                          color="#0ba6da"
                          weight="fill"
                        />
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Text size="sm">Developer account</Text>
                      </Popover.Dropdown>
                    </Popover>
                  ))}

                <div>
                  {followingArr.includes(UserInfo?.username) && (
                    <Badge size="sm" color={"gray"}>
                      Follows you
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {profileInfo?.description && (
              <div
                style={{
                  width: "100%",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: sanitizer(profileInfo?.description, {
                      ALLOWED_ATTR: [""],
                      ALLOWED_TAGS: ["b", "i", "em", "strong"],
                    }),
                  }}
                />
              </div>
            )}
            {profileInfo?.createdAt && (
              <div>
                <Text color="rgb(113, 118, 123)" size="13px">
                  <span>Joined </span>
                  {format(new Date(profileInfo?.createdAt), "MMMMMM yyyy")}
                </Text>
              </div>
            )}

            <div style={{ display: "flex", gap: "1rem" }}>
              <Text
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setOpened(true);
                  setmodaltitle(`Following (${following.length})`);
                }}
                size="15px"
              >
                <span style={{ fontWeight: "500" }}>{following.length}</span>{" "}
                <span style={{ color: "rgb(113, 118, 123)", fontSize: "14px" }}>
                  Following
                </span>
              </Text>
              <Text
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setOpened(true);

                  setmodaltitle(`Followers (${followers.length})`);
                }}
                size="15px"
              >
                <span style={{ fontWeight: "500" }}>{followers.length}</span>{" "}
                <span style={{ color: "rgb(113, 118, 123)", fontSize: "14px" }}>
                  Followers
                </span>
              </Text>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
          }}
          className={classes.wrapper}
        >
          <div className={classes.left}>
            <Skeleton height={60} circle mb="xl" />
          </div>
          <div className={classes.right}>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
              >
                <Text weight="bold" size="md">
                  {userprofile}
                </Text>
                {profileInfo.verified && (
                  <CircleWavyCheck size={17} color="#0ba6da" weight="fill" />
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <Text
                color={"rgb(113, 118, 123)"}
                style={{ cursor: "pointer" }}
                size="14px"
              >
                Followers
              </Text>
              <Text
                color={"rgb(113, 118, 123)"}
                style={{ cursor: "pointer" }}
                size="14px"
              >
                Following
              </Text>
            </div>
          </div>
        </div>
      )}

      <Modal
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
