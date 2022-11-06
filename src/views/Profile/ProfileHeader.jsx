import React, { useContext, useEffect } from "react";
import { Button, Modal, createStyles, Text, ActionIcon } from "@mantine/core";
import { ArrowLeft, CircleWavyCheck } from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { follow } from "../../api/POST";
import { AuthContext } from "../../context/Auth";
import { useState } from "react";
import { profilefollowdata } from "../../api/GET";
import { useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";

const useStyles = createStyles(() => ({
  wrapper: {
    background: "white",
    padding: "1rem",
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
    gap: "1rem",
  },
}));
export const ProfileHeader = ({ profileInfo }) => {
  const { userprofile } = useParams();

  const { UserInfo, setfollowingdata } = useContext(AuthContext);
  const navigate = useNavigate();
  const { classes } = useStyles();
  const [followers, setfollowers] = useState([]);
  const [followerArr, setfollowerArr] = useState([]);
  const [following, setfollowing] = useState([]);
  const [followingArr, setfollowingArr] = useState([]);
  useEffect(() => {
    profilefollowdata({
      username: userprofile,
    }).then((res) => {
      setfollowers(res.data.userFollowers);
      setfollowerArr(res.data.userfollowerarr);
      setfollowing(res.data.userFollowing);
      setfollowingArr(res.data.userfollowingarr);
    });
  }, [userprofile]);
  const handlefollow = () => {
    follow({ followingid: profileInfo.id })
      .then((res) => {
        if (res.data.followed) {
          setfollowers((prev) => [...prev, res.data.newFollowing]);
          setfollowerArr((prev) => [
            ...prev,
            res.data.newFollowing.follower.username,
          ]);
          showNotification({
            message: `You are now following ${profileInfo.username}`,
            autoClose: 4000,
          });
          setfollowingdata((prev) => [
            ...prev,
            res.data.newFollowing.following.username,
          ]);
        } else {
          showNotification({
            message: `You are no longer following ${profileInfo.username}`,
            autoClose: 4000,
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
      })
      .catch((err) => {
        if (err.response.status === 0) {
          showNotification({
            color: "red",
            title: "Internal Server Error",

            autoClose: 7000,
          });
        } else {
          showNotification({
            color: "red",
            title: err.response.data,
            autoClose: 7000,
          });
        }
      });
  };
  const [opened, setOpened] = useState(false);
  const [modaltitle, setmodaltitle] = useState("");
  return (
    <>
      <div style={{ background: "white", padding: "1rem 0rem 0rem 1rem" }}>
        <ActionIcon onClick={() => navigate(-1)}>
          <ArrowLeft size="20px" />
        </ActionIcon>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <img
            loading="lazy"
            className={classes.avatar}
            src={profileInfo.avatar}
            alt=""
          />
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
                {profileInfo?.username}
              </Text>
              {profileInfo.verified && (
                <CircleWavyCheck size={17} color="#0ba6da" weight="fill" />
              )}
            </div>
            {UserInfo?.username === profileInfo.username && (
              <Button variant="outline" radius={"xl"} size="xs">
                edit profile
              </Button>
            )}
            {UserInfo?.username !== profileInfo.username &&
              (followerArr?.includes(UserInfo?.username) ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    handlefollow();
                  }}
                  radius={"xl"}
                  size="xs"
                >
                  Following
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    handlefollow();
                  }}
                  radius={"xl"}
                  size="xs"
                >
                  Follow
                </Button>
              ))}
          </div>
 {profileInfo.description && (
            <Text size="15px" color={"gray"}>
              {profileInfo.description}
            </Text>
          )}

          <div style={{ display: "flex", gap: "1rem" }}>
            <Text
              style={{ cursor: "pointer" }}
              onClick={() => {
                setOpened(true);
                setmodaltitle("Followers");
              }}
              size="15px"
            >
              <span style={{ fontWeight: "500" }}>{followers.length}</span>{" "}
              Followers
            </Text>
            <Text
              style={{ cursor: "pointer" }}
              onClick={() => {
                setOpened(true);
                setmodaltitle("Following");
              }}
              size="15px"
            >
              <span style={{ fontWeight: "500" }}>{following.length}</span>{" "}
              Following
            </Text>
          </div>
         
        </div>
      </div>
      <Modal
        overflow="inside"
        opened={opened}
        onClose={() => setOpened(false)}
        title={modaltitle}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {modaltitle === "Following" ? (
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
                      {item.following.verified && (
                        <CircleWavyCheck
                          size={17}
                          color="#0ba6da"
                          weight="fill"
                        />
                      )}
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
                      {item.follower.verified && (
                        <CircleWavyCheck
                          size={17}
                          color="#0ba6da"
                          weight="fill"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </Modal>
    </>
  );
};
