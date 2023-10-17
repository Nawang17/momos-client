import {
  Container,
  createStyles,
  Input,
  NavLink,
  Skeleton,
  Text,
} from "@mantine/core";

import { MagnifyingGlass, TrendUp } from "@phosphor-icons/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gettrending } from "../../api/GET";

import { Sidebar } from "../../Components/Sidebar";
import { AuthContext } from "../../context/Auth";
import Topuserbadge from "../../helper/Topuserbadge";
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
    flex: 0.7,
    "@media (max-width: 700px)": {
      flex: 1,
    },
  },
}));

export const Discover = () => {
  const { classes } = useStyles();
  const { darkmode, suggestedUsers, followingdata, UserInfo, topUser } =
    useContext(AuthContext);
  const [loading, setloading] = useState(true);
  const navigate = useNavigate();
  const [trending, settrending] = useState([]);

  useEffect(() => {
    async function gettrendingfunc() {
      gettrending().then((res) => {
        settrending(res.data);
        setloading(false);
      });
    }
    gettrendingfunc();
  }, []);
  return (
    <Container px={0} className={classes.wrapper}>
      <div
        style={{
          backgroundColor: darkmode ? "#1A1B1E" : "white",
          color: darkmode ? "white" : "black",
        }}
        className={classes.leftWrapper}
      >
        <div
          style={{
            padding: "0rem 1rem",
          }}
        >
          <Input
            mt={"1rem"}
            style={{
              cursor: "text",
            }}
            onClick={() => {
              navigate("/search/q/null");
            }}
            component="div"
            icon={<MagnifyingGlass />}
          >
            Search momos
          </Input>
          <div
            style={{
              padding: "20px 0px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Text size={"xl"} weight={700}>
              Trending Topics
            </Text>
            <TrendUp size={20} />
          </div>
          {!loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                paddingBottom: "2rem",
              }}
            >
              {trending.map((trends, key) => (
                <div
                  onClick={() => {
                    navigate(`/search/q/%23${trends?.hashtag.slice(1)}`);
                  }}
                  key={key}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                  }}
                >
                  <Text weight={700}>{trends?.hashtag}</Text>
                  <Text color={"dimmed"} size={"xs"}>
                    {trends?.count} posts
                  </Text>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                paddingBottom: "2rem",
              }}
            >
              {new Array(10).fill(0).map((_, key) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                  }}
                >
                  <Skeleton width="30%" height={7} mt={6} radius="xl" />
                  <Skeleton width="20%" height={7} mt={8} radius="xl" />
                </div>
              ))}
            </div>
          )}
        </div>
        {suggestedUsers.length - 1 !== 0 && (
          <div
            style={{
              padding: "0px 0px",
            }}
          >
            <Text pl={"1rem"} pb={10} size={"xl"} weight={700}>
              Suggested Accounts
            </Text>

            <div>
              {suggestedUsers
                .filter((v) => {
                  return (
                    !followingdata.includes(v.username) &&
                    v?.username !== UserInfo?.username
                  );
                })
                .map((user) => (
                  <NavLink
                    style={{
                      paddingTop: "0.8rem",
                      paddingBottom: "0.8rem",
                      wordBreak: "break-word",
                    }}
                    onClick={() => {
                      navigate(`/${user?.username}`);
                    }}
                    key={user.username}
                    label={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.2rem",
                        }}
                      >
                        <Text>{user?.username}</Text>
                        {topUser === user?.username && <Topuserbadge />}
                      </div>
                    }
                    description={user?.description}
                    icon={
                      <img
                        src={user?.avatar}
                        alt=""
                        loading="lazy"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                        }}
                      />
                    }
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      <Sidebar />
    </Container>
  );
};
