import {
  ActionIcon,
  Button,
  Container,
  createStyles,
  Text,
} from "@mantine/core";
import { ArrowLeft, CircleWavyCheck } from "phosphor-react";

import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../Components/Sidebar";
import { useContext, useEffect, useState } from "react";
import { allsuggestedusersreq } from "../../api/GET";
import { AuthContext } from "../../context/Auth";
import { showNotification } from "@mantine/notifications";
import { follow } from "../../api/POST";
import { useScrollIntoView } from "@mantine/hooks";

const useStyles = createStyles(() => ({
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    paddingBottom: "5rem",
    paddingTop: "0.5rem",
  },
  leftWrapper: {
    backgroundColor: "white",
    flex: 0.7,
    "@media (max-width: 700px)": {
      flex: 1,
    },
  },
}));

export const SuggestedAccs = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const {
    suggestedUsers,
    UserInfo,
    setSuggestedusers,
    followingdata,
    setfollowingdata,
  } = useContext(AuthContext);
  const [btndisabled, setbtndisabled] = useState("");
  const { scrollIntoView, targetRef } = useScrollIntoView({
    offset: 64,
  });

  useEffect(() => {
    scrollIntoView();
    allsuggestedusersreq({ name: UserInfo ? UserInfo.username : "null" })
      .then((res) => {
        setSuggestedusers(res.data.suggestedusers);
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
    <Container px={10} className={classes.wrapper}>
      <div className={classes.leftWrapper}>
        <div
          ref={targetRef}
          style={{
            background: "white",
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
                        variant="outline"
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
                  {acc.description && (
                    <Text size={"15px"}> {acc.description}</Text>
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
