import { Button, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  Lock,
  UserMinus,
  UserPlus,
  WarningCircle,
} from "@phosphor-icons/react";
import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { follow } from "../api/POST";
import { AuthContext } from "../context/Auth";
import Topuserbadge from "../helper/Topuserbadge";
import Verifiedbadge from "../helper/VerifiedBadge";
import { Trans } from "@lingui/macro";

const Hsuggestedacc = () => {
  const navigate = useNavigate();
  const {
    suggestedUsers,
    UserInfo,
    followingdata,
    setfollowingdata,
    darkmode,
    topUser,
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
        icon: <Lock size={18} />,
        title: <Trans>Login required</Trans>,
        autoClose: 3000,
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
              icon: <UserPlus size={18} />,
              message: <Trans>You are now following ${username}</Trans>,
              autoClose: 3000,
            });
          } else {
            setbtndisabled("");
            showNotification({
              icon: <UserMinus size={18} />,
              message: <Trans>You are no longer following ${username}</Trans>,
              autoClose: 3000,
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
              padding: "0px 10px",
              width: "8rem",

              height: "12rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "9px",

              cursor: "pointer",
            }}
          >
            <img
              style={{ width: "90px", height: "90px", borderRadius: "50%" }}
              src={value.avatar}
              alt=""
            />
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
            >
              <Text size={"14px"} weight={"500"}>
                {" "}
                {value.username}
              </Text>
              {value.verified && <Verifiedbadge />}
              {topUser === value.username && <Topuserbadge />}
            </div>
            {!followingdata.includes(value.username) ? (
              <Button
                style={{
                  width: "100%",
                }}
                disabled={btndisabled === value.username}
                onClick={(e) => {
                  e.stopPropagation();
                  handlefollow(value.id, value.username);
                }}
                size="xs"
              >
                <Trans>Follow</Trans>
              </Button>
            ) : (
              <Button
                style={{
                  width: "100%",
                }}
                color="gray"
                variant="filled"
                disabled={btndisabled === value.username}
                onClick={(e) => {
                  e.stopPropagation();
                  handlefollow(value.id, value.username);
                }}
                size="xs"
              >
                <Trans>Unfollow</Trans>
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
          padding: "0px 10px",
          width: "8rem",

          height: "12rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "9px",

          cursor: "pointer",
          marginRight: "14px",
        }}
      >
        <Text color="#1DA1F2" weight={"500"} size={"15px"}>
          <Trans>See all</Trans>
        </Text>
      </div>
    </div>
  );
};

export default Hsuggestedacc;
