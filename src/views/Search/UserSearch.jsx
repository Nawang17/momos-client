import { Input, Text } from "@mantine/core";
import { CircleWavyCheck, MagnifyingGlass, X } from "phosphor-react";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchusers } from "../../api/GET";

const UserSearch = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [accounts, setAccounts] = useState([]);
  useEffect(() => {
    searchusers().then((res) => {
      setAccounts(res.data.userAccounts);
    });
  }, []);

  return (
    <div
      style={{
        backgroundColor: "white",

        minHeight: "36.5vh",

        borderRadius: "4px",
        paddingBottom: "1rem",
      }}
    >
      <div
        style={{
          padding: "1rem 1rem",
        }}
      >
        <Input
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          value={search}
          icon={<MagnifyingGlass size={16} />}
          placeholder="Search users"
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

      {/* Accounts */}
      {accounts
        .filter((val) =>
          val.username.toUpperCase().includes(search.toUpperCase())
        )
        .map(
          (val) =>
            search && (
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
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
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
                    <CircleWavyCheck size={17} color="#0ba6da" weight="fill" />
                  )}
                </div>
              </div>
            )
        )}
    </div>
  );
};

export default UserSearch;
