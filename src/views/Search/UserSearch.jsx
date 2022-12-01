import { Input, Loader, Tabs, Text } from "@mantine/core";
import { CircleWavyCheck, MagnifyingGlass, X } from "phosphor-react";
import React from "react";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchposts, searchusers } from "../../api/GET";
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
  const { suggestedUsers } = useContext(AuthContext);

  const debouncedSearch = useDebounce(search, 500);

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
        setPostResults(res.data);
      });

      setLoading(false);
    }
    if (debouncedSearch) {
      searchforposts();
      searchuser();
    } else {
      setAccounts(suggestedUsers);
    }
  }, [debouncedSearch]);

  return (
    <div
      style={{
        borderRadius: "4px",
        paddingBottom: "1rem",
      }}
    >
      <div
        style={{
          padding: "0.5rem 0rem 0.5rem 0rem",
        }}
      >
        <Input
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
      <div>
        <Tabs defaultValue="Accounts">
          <Tabs.List>
            <Tabs.Tab value="Accounts">Accounts</Tabs.Tab>
            <Tabs.Tab value="messages">Posts</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="Accounts" pt="xs">
            {accounts.length === 0 && !loading && (
              <div
                style={{
                  paddingLeft: "0.9rem",
                }}
              >
                <Text size={"15px"}>No results found for "{search}"</Text>
              </div>
            )}
            {uloading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
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
                  key={val.username}
                  className="searchaccounts"
                  style={{
                    display: "flex",
                    gap: "1rem",
                    padding: "0.5rem 1rem",
                    alignItems: "center",
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
                      display: "flex",
                      gap: "0.3rem",
                      alignItems: "center",
                    }}
                  >
                    <Text weight={500} size="15px">
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
                </div>
              ))
            )}
          </Tabs.Panel>

          <Tabs.Panel
            style={{ backgroundColor: "#f0f2f5" }}
            value="messages"
            pt="xs"
          >
            <PostFeed
              posts={postresults}
              loading={loading}
              setPosts={setPostResults}
            />
          </Tabs.Panel>
        </Tabs>
      </div>
      {/* Accounts */}
    </div>
  );
};

export default UserSearch;
