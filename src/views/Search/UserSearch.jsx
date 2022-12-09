import { ActionIcon, Button, Input, Loader, Tabs, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import {
  ArrowLeft,
  CircleWavyCheck,
  Lock,
  MagnifyingGlass,
  UserMinus,
  UserPlus,
  WarningCircle,
  X,
} from "phosphor-react";
import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { searchposts, searchusers } from "../../api/GET";
import { follow } from "../../api/POST";
import { PostFeed } from "../../Components/PostFeed";
import { AuthContext } from "../../context/Auth";
import useDebounce from "./useDebounce";

const UserSearch = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [postresults, setPostResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uloading, setuLoading] = useState(false);
  const {
    UserInfo,

    followingdata,
    setfollowingdata,
    darkmode,
  } = useContext(AuthContext);
  const [btndisabled, setbtndisabled] = useState("");
  const [Top, setTop] = useState([]);
  const debouncedSearch = useDebounce(search, 500);
  const { searchquery } = useParams();

  useEffect(() => {
    if (searchquery !== "null") {
      setSearch(searchquery);
    }
  }, []);
  useEffect(() => {
    async function searchuser() {
      setuLoading(true);
      await searchusers({ searchvalue: debouncedSearch }).then((res) => {
        if (!res.data) {
          setAccounts([]);
        }
        setAccounts(res.data);
      });

      setuLoading(false);
    }
    async function searchforposts() {
      setLoading(true);
      await searchposts({ searchvalue: debouncedSearch }).then((res) => {
        if (!res.data) {
          setPostResults([]);
        }

        setPostResults(res.data.latestposts);
        setTop(res.data.popularposts);
      });

      setLoading(false);
    }
    if (debouncedSearch) {
      searchforposts();
      searchuser();
    }
  }, [debouncedSearch]);

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
    <div
      style={{
        paddingBottom: "0rem",
        backgroundColor: darkmode ? "#1A1B1E" : "white",
        color: darkmode ? "white" : "black",
      }}
    >
      <div
        style={{
          display: "flex",

          padding: "1rem 0.7rem 0rem 0.7rem",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <ActionIcon onClick={() => navigate(-1)}>
          <ArrowLeft size="20px" />
        </ActionIcon>
        <Input
          style={{
            width: "100%",
          }}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          value={search}
          icon={<MagnifyingGlass size={16} />}
          placeholder="Search momos"
          rightSection={
            search && (
              <div
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSearch("");
                }}
              >
                <X size={18} style={{ display: "block", opacity: 0.5 }} />
              </div>
            )
          }
        />
      </div>
      <div
        style={{
          paddingTop: "0.5rem",
        }}
      >
        <Tabs defaultValue="Top">
          <Tabs.List
            style={{
              borderBottom: "none",
            }}
          >
            <Tabs.Tab value="Top">Top</Tabs.Tab>
            <Tabs.Tab value="Latest">Latest</Tabs.Tab>
            <Tabs.Tab value="Accounts">Accounts</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="Accounts">
            {accounts.length === 0 && !uloading && search && (
              <div
                style={{
                  paddingLeft: "0.9rem",
                }}
              >
                <Text
                  style={{
                    padding: "1rem 0",
                  }}
                  size={"14px"}
                >
                  {`No results found for "${search}"`}
                </Text>
              </div>
            )}
            {uloading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "1rem 0",
                }}
              >
                <Loader />
              </div>
            ) : (
              accounts.map((val) => (
                <div
                  onClick={() => {
                    navigate(`/${val.username}`);
                  }}
                  key={val.id}
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
                    src={val.avatar}
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
                          {val.username}
                        </Text>
                        {val.verified && (
                          <CircleWavyCheck
                            size={17}
                            color="#0ba6da"
                            weight="fill"
                          />
                        )}
                      </div>
                      {UserInfo?.username !== val.username &&
                        (!followingdata.includes(val.username) ? (
                          <Button
                            disabled={btndisabled === val.username}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlefollow(val.id, val.username);
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
                            disabled={btndisabled === val.username}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlefollow(val.id, val.username);
                            }}
                            radius="xl"
                            size="xs"
                          >
                            {" "}
                            unfollow
                          </Button>
                        ))}
                    </div>
                    {val.description && (
                      <Text size={"15px"}> {val.description}</Text>
                    )}
                  </div>
                </div>
              ))
            )}
          </Tabs.Panel>

          <Tabs.Panel
            style={{
              backgroundColor: darkmode ? "#101113" : " #f0f2f5",
            }}
            value="Latest"
            pt="xs"
          >
            <PostFeed
              posts={postresults}
              loading={loading}
              setPosts={setPostResults}
            />
          </Tabs.Panel>

          <Tabs.Panel
            style={{
              backgroundColor: darkmode ? "#101113" : " #f0f2f5",
            }}
            value="Top"
            pt="xs"
          >
            <PostFeed posts={Top} loading={loading} setPosts={setTop} />
          </Tabs.Panel>
        </Tabs>
      </div>
      {/* Accounts */}
    </div>
  );
};

export default UserSearch;
