import { ActionIcon, Container, createStyles, Text } from "@mantine/core";
import { ArrowLeft } from "@phosphor-icons/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getbookmarks } from "../../api/GET";
import { PostFeed } from "../../Components/PostFeed";
import { Sidebar } from "../../Components/Sidebar";
import { AuthContext } from "../../context/Auth";
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
    width: "100%",

    flex: 0.7,
    "@media (max-width: 700px)": {
      flex: 1,
    },
  },
}));

export const Bookmarks = () => {
  const { classes } = useStyles();
  const { darkmode, UserInfo } = useContext(AuthContext);
  const [bookmarkposts, setbookmarkposts] = useState([]);
  const [loading, setloading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    async function fetchdata() {
      await getbookmarks()
        .then((res) => {
          setbookmarkposts(res.data.bookmarks);
          setloading(false);
        })
        .catch(() => {
          setloading(false);
        });
    }
    if (UserInfo) {
      fetchdata();
    } else {
      navigate("/");
    }
  }, []);
  return (
    <Container px={0} className={classes.wrapper}>
      <div className={classes.leftWrapper}>
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
            padding: "1rem 0rem 0rem 1rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <ActionIcon onClick={() => navigate(-1)}>
            <ArrowLeft size="20px" />
          </ActionIcon>
        </div>
        <Text
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
            padding: "1rem 0rem 0.5rem 1rem",
          }}
          size="sm"
          weight={700}
        >
          <Trans>{bookmarkposts.length} Bookmarks </Trans>
        </Text>
        {bookmarkposts.length !== 0 && !loading && (
          <PostFeed
            setPosts={setbookmarkposts}
            posts={bookmarkposts}
            loading={loading}
          />
        )}
      </div>

      <Sidebar />
    </Container>
  );
};
