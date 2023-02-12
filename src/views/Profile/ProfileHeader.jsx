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
  Tooltip,
} from "@mantine/core";
import {
  ArrowLeft,
  CircleWavyCheck,
  WarningCircle,
  Lock,
  UserPlus,
  UserMinus,
  Crown,
  DotsThree,
} from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { follow } from "../../api/POST";
import { AuthContext } from "../../context/Auth";
import format from "date-fns/format";
import { getchat, profilefollowdata } from "../../api/GET";
import { useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import * as DOMPurify from "dompurify";
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
          navigate(`/search/q/${match}`);
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
              justifyContent: "center",
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
          </div>
          <div className={classes.right}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.2rem",
                  }}
                >
                  <Text weight="bold" size="md">
                    {userprofile}
                  </Text>

                  {profileInfo?.verified &&
                    (profileInfo?.id !== 5 ? (
                      <Popover
                        width={200}
                        position="right"
                        withArrow
                        shadow="md"
                      >
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
                      <Popover
                        width={130}
                        position="right"
                        withArrow
                        shadow="md"
                      >
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
                  {rankinfo.rank === 1 && (
                    <Popover
                      width={"auto"}
                      position="bottom"
                      withArrow
                      shadow="md"
                    >
                      <Popover.Target>
                        <Crown
                          style={{
                            cursor: "pointer",
                          }}
                          weight="fill"
                          size={19}
                          color={darkmode ? "gold" : "orange"}
                        />
                      </Popover.Target>
                      <Popover.Dropdown>
                        <Text size="sm">This user is ranked #1</Text>
                      </Popover.Dropdown>
                    </Popover>
                  )}
                </div>
              </div>
            </div>
            {!profileloading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <div
                  onClick={() => {
                    setOpened(true);
                    setmodaltitle(`Following (${following.length})`);
                  }}
                  style={{
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    width: "4.5rem",

                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: "600" }}>{following.length}</div>{" "}
                  <div
                    style={{ color: "rgb(113, 118, 123)", fontSize: "13px" }}
                  >
                    Following
                  </div>
                </div>
                <div
                  onClick={() => {
                    setOpened(true);

                    setmodaltitle(`Followers (${followers.length})`);
                  }}
                  style={{
                    cursor: "pointer",
                    fontSize: "14px",

                    width: "4.5rem",

                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: "600" }}>{followers.length}</div>{" "}
                  <div
                    style={{ color: "rgb(113, 118, 123)", fontSize: "13px" }}
                  >
                    Followers
                  </div>
                </div>
                <Popover
                  width={"150px"}
                  position="bottom"
                  withArrow
                  shadow="md"
                >
                  <Popover.Target>
                    <div
                      style={{
                        cursor: "pointer",
                        fontSize: "14px",
                        display: "flex",
                        width: "4.5rem",

                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontWeight: "600" }}>{rankinfo.rank}</div>{" "}
                      <div
                        style={{
                          color: "rgb(113, 118, 123)",
                          fontSize: "13px",
                        }}
                      >
                        Rank
                      </div>
                    </div>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Text size="sm">
                      This user is ranked #{rankinfo.rank} with {""}
                      <span
                        style={{
                          fontWeight: "bold",
                        }}
                      >
                        {rankinfo.points}
                      </span>{" "}
                      points
                    </Text>
                  </Popover.Dropdown>
                </Popover>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    width: "4.5rem",

                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: "600" }}></div>{" "}
                  <div
                    style={{ color: "rgb(113, 118, 123)", fontSize: "13px" }}
                  >
                    Following
                  </div>
                </div>
                <div
                  style={{
                    cursor: "pointer",
                    fontSize: "14px",

                    width: "4.5rem",

                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: "600" }}></div>{" "}
                  <div
                    style={{ color: "rgb(113, 118, 123)", fontSize: "13px" }}
                  >
                    Followers
                  </div>
                </div>

                <div
                  style={{
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    width: "4.5rem",

                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div style={{ fontWeight: "600" }}></div>
                  <div
                    style={{
                      color: "rgb(113, 118, 123)",
                      fontSize: "13px",
                    }}
                  >
                    Rank
                  </div>
                </div>
              </div>
            )}

            {!profileloading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",

                  gap: "0.2rem",
                }}
              >
                {UserInfo?.username === profileInfo.username ? (
                  <>
                    <Button
                      onClick={() => {
                        navigate("/editprofile");
                      }}
                      variant="default"
                      style={{
                        width: "120px",
                      }}
                      radius={2}
                      size="sm"
                    >
                      Edit profile
                    </Button>
                  </>
                ) : followingdata?.includes(profileInfo?.username) ? (
                  <>
                    <Button
                      style={{
                        width: "120px",
                      }}
                      radius={2}
                      size="sm"
                      disabled={btndisabled}
                      variant="default"
                      onClick={() => {
                        setunfollowconfirm(true);
                      }}
                    >
                      Following
                    </Button>
                  </>
                ) : (
                  <Button
                    disabled={btndisabled}
                    onClick={() => {
                      handlefollow();
                    }}
                    style={{
                      width: "120px",
                    }}
                    radius={2}
                    size="sm"
                  >
                    {followingArr.includes(UserInfo?.username)
                      ? "Follow back"
                      : "Follow"}
                  </Button>
                )}
                {UserInfo?.username !== profileInfo?.username && (
                  <Button
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
                    style={{
                      width: "120px",
                    }}
                    radius={2}
                    size="sm"
                  >
                    Message
                  </Button>
                )}

                <ActionIcon
                  radius={2}
                  color="dark"
                  size="36px"
                  variant="default"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "Share Profile",
                        url: `https://momosz.com/${userprofile}`,
                      });
                    }
                  }}
                >
                  <DotsThree size={26} />
                </ActionIcon>
              </div>
            )}
            {profileInfo?.description && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    textAlign: "center",
                    width: "300px",
                  }}
                >
                  {description(profileInfo?.description)}
                </div>
              </div>
            )}
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
            className={classes.left}
          >
            <Skeleton height={60} circle />
          </div>
          <div className={classes.right}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.2rem",
                  }}
                >
                  <Text weight="bold" size="md">
                    {userprofile}
                  </Text>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  cursor: "pointer",
                  fontSize: "14px",
                  display: "flex",
                  width: "4.5rem",

                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: "600" }}></div>{" "}
                <div style={{ color: "rgb(113, 118, 123)", fontSize: "13px" }}>
                  Following
                </div>
              </div>
              <div
                style={{
                  cursor: "pointer",
                  fontSize: "14px",

                  width: "4.5rem",

                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: "600" }}></div>{" "}
                <div style={{ color: "rgb(113, 118, 123)", fontSize: "13px" }}>
                  Followers
                </div>
              </div>

              <div
                style={{
                  cursor: "pointer",
                  fontSize: "14px",
                  display: "flex",
                  width: "4.5rem",

                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ fontWeight: "600" }}></div>
                <div
                  style={{
                    color: "rgb(113, 118, 123)",
                    fontSize: "13px",
                  }}
                >
                  Rank
                </div>
              </div>
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
