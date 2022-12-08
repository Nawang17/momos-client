import { Button, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { CircleWavyCheck } from "phosphor-react";
import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { follow } from "../api/POST";
import { AuthContext } from "../context/Auth";

const Hsuggestedacc = () => {
  const navigate = useNavigate();
  const {
    suggestedUsers,
    UserInfo,
    followingdata,
    setfollowingdata,
    darkmode,
  } = useContext(AuthContext);
  const [followeduser, setfolloweduser] = useState([]);
  const [btndisabled, setbtndisabled] = useState("");
  useEffect(() => {
    setfolloweduser(followingdata);
  }, []);
  const handlefollow = (userid, username) => {
    setbtndisabled(username);
    if (!UserInfo) {
      setbtndisabled("");
      showNotification({
        color: "red",
        title: "Please login to follow",
        autoClose: 5000,
      });
    } else {
      follow({ followingid: userid ? userid : null })
        .then((res) => {
          if (res.data.followed) {
            setfollowingdata((prev) => [
              ...prev,
              res.data.newFollowing.following.username,
            ]);

            setbtndisabled("");
            showNotification({
              message: `You are now following ${username}`,
              autoClose: 4000,
            });
          } else {
            setbtndisabled("");
            showNotification({
              message: `You are no longer following ${username}`,
              autoClose: 4000,
            });

            setfollowingdata((prev) => {
              return prev.filter((item) => item !== username);
            });
          }
        })
        .catch((err) => {
          setbtndisabled("");
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
    }
  };
  return (
    <div
      style={{
        backgroundColor: darkmode ? "#1A1B1E" : "white",
        color: darkmode ? "white" : "black",
        display: "flex",
        gap: "7px",
        margin: "10px 0px",
      }}
    >
      {suggestedUsers
        .filter((v) => {
          return (
            !followeduser.includes(v.username) &&
            v?.username !== UserInfo?.username
          );
        })

        .map((value) => (
          <div
            onClick={() => {
              navigate(`/${value.username}`);
            }}
            key={value.username}
            style={{
              border: darkmode ? "1px solid #2f3136" : "1px solid #e6e6e6",
              borderRadius: "4px",
              padding: "0px 25px",
              width: "5.5rem",
              height: "8.4rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",

              cursor: "pointer",
            }}
          >
            <img
              style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              src={value.avatar}
              alt=""
            />
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
            >
              <Text size={"15px"} weight={"500"}>
                {" "}
                {value.username}
              </Text>
              {value.verified && (
                <CircleWavyCheck size={17} color="#0ba6da" weight="fill" />
              )}
            </div>
            {!followingdata.includes(value.username) ? (
              <Button
                disabled={btndisabled === value.username}
                onClick={(e) => {
                  e.stopPropagation();
                  handlefollow(value.id, value.username);
                }}
                radius={"xl"}
                size="xs"
              >
                Follow
              </Button>
            ) : (
              <Button
                variant="outline"
                disabled={btndisabled === value.username}
                onClick={(e) => {
                  e.stopPropagation();
                  handlefollow(value.id, value.username);
                }}
                radius={"xl"}
                size="xs"
              >
                Unfollow
              </Button>
            )}
          </div>
        ))}
      <div
        onClick={() => {
          navigate("/suggestedaccounts");
        }}
        style={{
          border: darkmode ? "1px solid #2f3136" : "1px solid #e6e6e6",
          borderRadius: "4px",
          padding: "0px 25px",
          width: "5.5rem",
          height: "8.4rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",

          cursor: "pointer",
          marginRight: "14px",
        }}
      >
        <Text color="#1DA1F2" weight={"500"} size={"15px"}>
          View All
        </Text>
      </div>
    </div>
  );
};

export default Hsuggestedacc;
