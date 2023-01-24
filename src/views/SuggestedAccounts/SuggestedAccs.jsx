import {
  ActionIcon,
  Button,
  Container,
  createStyles,
  Text,
} from "@mantine/core";
import {
  ArrowLeft,
  CircleWavyCheck,
  Lock,
  UserMinus,
  UserPlus,
  WarningCircle,
} from "phosphor-react";

import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../Components/Sidebar";
import { useContext, useEffect, useState } from "react";
import { allsuggestedusersreq } from "../../api/GET";
import { AuthContext } from "../../context/Auth";
import { showNotification } from "@mantine/notifications";
import { follow } from "../../api/POST";
import * as DOMPurify from "dompurify";

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
        title: "Login required",
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
              message: `You are now following ${username}`,
              autoClose: 3000,
            });
          } else {
            setbtndisabled("");
            showNotification({
              icon: <UserMinus size={18} />,
              message: `You are no longer following ${username}`,
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
            Suggested Accounts
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
                  padding: "1rem 1.4rem",
                  display: "flex",
                  gap: "0.6rem",

                  cursor: "pointer",
                }}
              >
                <img
                  style={{
                    width: "40px",
                    height: "40px",
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
                        {acc.username}
                      </Text>
                      {acc.verified && (
                        <CircleWavyCheck
                          size={17}
                          color="#0ba6da"
                          weight="fill"
                        />
                      )}
                    </div>
                    {!followingdata.includes(acc.username) ? (
                      <Button
                        disabled={btndisabled === acc.username}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlefollow(acc.id, acc.username);
                        }}
                        radius="xl"
                        size="xs"
                      >
                        {" "}
                        follow
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
                        radius="xl"
                        size="xs"
                      >
                        {" "}
                        unfollow
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
