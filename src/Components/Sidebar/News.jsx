import { Skeleton, Text, createStyles } from "@mantine/core";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/Auth";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import locale from "date-fns/locale/en-US";
import { getTopNews } from "../../api/GET";
import { formatDistance } from "../../helper/DateFormat";
const useStyles = createStyles(() => ({
  accounts: {
    paddingTop: "0.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  account: {
    display: "flex",
    alignItems: "center",
    padding: "0.6rem 1rem 0.6rem 1rem",
    gap: "0.8rem",
    cursor: "pointer",
  },
}));
const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTopNews()
      .then((res) => {
        setLoading(false);
        setNews(res.data.news.data);
      })
      .catch(() => {
        setLoading(true);
      });
  }, []);
  const { darkmode } = useContext(AuthContext);

  const { classes } = useStyles();

  return (
    <>
      {!loading ? (
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
            marginBottom: "0.5rem",
            borderRadius: "4px",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "0.7rem 1rem 0 1rem",
              gap: "0.4rem",
              alignItems: "center",
            }}
          >
            <Text weight={700} size={12}>
              Top News
            </Text>{" "}
          </div>
          <div
            style={{
              paddingTop: "0.3rem",
            }}
            className={classes.accounts}
          >
            {news.map((val) => {
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "0rem",
                  }}
                  onClick={() => {
                    window.location.href = val?.url;
                  }}
                  key={val.uuid}
                  className={classes.account}
                >
                  <div
                    style={{
                      // borderTop: darkmode
                      //   ? "1px solid rgb(47, 49, 54)"
                      //   : "1px solid rgb(230, 230, 230)",
                      display: "flex",
                      flex: 1,
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0rem",
                      }}
                    >
                      <div>
                        <Text
                          color={darkmode ? "#c1c2c5" : "#000000"}
                          size={"15px"}
                          weight={600}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Text color="dimmed" size="12px">
                              {val?.source}
                            </Text>
                          </div>
                          <span
                            style={{ paddingTop: "0.1rem" }}
                            className="link-style"
                          >
                            {val?.title}
                          </span>
                        </Text>
                        <Text pt="5px" size={"12px"} color="dimmed">
                          {formatDistanceToNowStrict(
                            new Date(val?.published_at),
                            {
                              locale: {
                                ...locale,
                                formatDistance,
                              },
                              addSuffix: true,
                            }
                          )}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
            marginBottom: "0.5rem",
            borderRadius: "4px",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "0.7rem 1rem 0 1rem",
              gap: "0.4rem",
              alignItems: "center",
            }}
          >
            <Text weight={700} size={12}>
              Top News
            </Text>{" "}
          </div>
          <div
            style={{
              paddingTop: "0.7rem",
            }}
            className={classes.accounts}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "0rem",
              }}
              className={classes.account}
            >
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0rem",
                  }}
                >
                  <div>
                    <Skeleton width={"180px"} height={7} radius="xl" />
                    <Skeleton width={"100px"} mt={10} height={7} radius="xl" />

                    <Skeleton width={"40px"} mt={11} height={5} radius="xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default News;
