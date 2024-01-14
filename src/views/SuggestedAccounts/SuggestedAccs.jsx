import {
  ActionIcon,
  Button,
  Container,
  createStyles,
  Text,
} from "@mantine/core";
import {
  ArrowLeft,
  Lock,
  UserMinus,
  UserPlus,
  WarningCircle,
} from "@phosphor-icons/react";

import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../Components/Sidebar";
import { useContext, useEffect, useState } from "react";
import { allsuggestedusersreq } from "../../api/GET";
import { AuthContext } from "../../context/Auth";
import { showNotification } from "@mantine/notifications";
import { follow } from "../../api/POST";
import * as DOMPurify from "dompurify";
import Topuserbadge from "../../helper/Topuserbadge";
import Verifiedbadge from "../../helper/VerifiedBadge";
import { Trans } from "@lingui/macro";

const useStyles = createStyles(() => ({
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    paddingBottom: "5rem",
    paddingTop: "0.5rem",
    "@media (max-width: 700px)": {
      paddingTop: "0rem",
    },
  },
  leftWrapper: {
    backgroundColor: "white",
    flex: 0.7,
    width: "100%",
    "@media (max-width: 700px)": {
      flex: 1,
    },
  },
}));

export const SuggestedAccs = () => {
  const sanitizer = DOMPurify.sanitize;

  const { classes } = useStyles();
  const navigate = useNavigate();
  const {
    suggestedUsers,
    UserInfo,
    setSuggestedusers,
    followingdata,
    setfollowingdata,
    darkmode,
    topUser,
  } = useContext(AuthContext);
  const [btndisabled, setbtndisabled] = useState("");

  useEffect(() => {
    allsuggestedusersreq({ name: UserInfo ? UserInfo.username : "null" })
      .then((res) => {
        setSuggestedusers(res.data.suggestedusers);
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
  }, []);
  const handlefollow = (userid, username) => {
    setbtndisabled(username);
    if (!UserInfo) {
      setbtndisabled("");
      showNotification({
        icon: <Lock size={18} />,
        color: "red",
        title: <Trans>Login required </Trans>,
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
              message: <Trans>You are now following {username} </Trans>,
              autoClose: 3000,
            });
          } else {
            setbtndisabled("");
            showNotification({
              icon: <UserMinus size={18} />,
              message: <Trans>You are no longer following {username} </Trans>,
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
    <Container px={0} className={classes.wrapper}>
      <div className={classes.leftWrapper}>
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
            padding: "1rem 0rem 1rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <ActionIcon onClick={() => navigate(-1)}>
            <ArrowLeft size="20px" />
          </ActionIcon>
          <Text weight={"500"} size={"16px"}>
            <Trans> Suggested Accounts </Trans>
          </Text>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
          }}
        >
          {suggestedUsers
            .filter((val) => {
              return val.username !== UserInfo?.username;
            })
            .map((acc) => (
              <div
                onClick={() => {
                  navigate(`/${acc.username}`);
                }}
                key={acc.id}
                style={{
                  margin: "0 1.4rem",
                  display: "flex",
                  gap: "0.6rem",
                  alignItems: "center",
                  cursor: "pointer",
                  padding: "1.5rem 0rem",
                  borderBottom: darkmode
                    ? "1px solid #343536"
                    : "1px solid #e4e6eb",
                }}
              >
                <img
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                  }}
                  src={acc.avatar}
                  alt=""
                />
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "0.2rem",
                        alignItems: "center",
                      }}
                    >
                      <Text size={"16px"} weight={"500"}>
                        {acc?.username}
                      </Text>

                      {acc?.verified && <Verifiedbadge />}
                      {topUser === acc?.username && <Topuserbadge />}
                    </div>
                    {!followingdata.includes(acc?.username) ? (
                      <Button
                        disabled={btndisabled === acc?.username}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlefollow(acc?.id, acc?.username);
                        }}
                        radius="sm"
                        size="xs"
                      >
                        <Trans> follow </Trans>
                      </Button>
                    ) : (
                      <Button
                        variant="filled"
                        color="gray"
                        disabled={btndisabled === acc.username}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlefollow(acc.id, acc.username);
                        }}
                        radius="sm"
                        size="xs"
                      >
                        <Trans>unfollow</Trans>
                      </Button>
                    )}
                  </div>
                  {acc?.description && (
                    <div
                      style={{
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          color: "#8e8e8e",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: sanitizer(acc?.description, {
                            ALLOWED_ATTR: [""],
                            ALLOWED_TAGS: ["b", "i", "em", "strong"],
                          }),
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
      <Sidebar />
    </Container>
  );
};
