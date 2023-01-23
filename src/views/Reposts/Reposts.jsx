import { ActionIcon, Container, createStyles, List, Text } from "@mantine/core";
import { ArrowLeft } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getreposts } from "../../api/GET";
import { PostFeed } from "../../Components/PostFeed";
import { Sidebar } from "../../Components/Sidebar";
import { AuthContext } from "../../context/Auth";

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

export const Reposts = () => {
  const { classes } = useStyles();
  const { darkmode } = useContext(AuthContext);
  const [reposts, setreposts] = useState([]);
  const [loading, setloading] = useState(true);
  const { postId } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    getreposts(postId)
      .then((res) => {
        setreposts(res.data);
        setloading(false);
      })
      .catch((err) => {
        setloading(false);
        setreposts([]);
      });
  }, [postId]);
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
          <Text size="sm" weight={700}>
            {reposts.length} reposts
          </Text>
          <div></div>
        </div>
        <div>
          <PostFeed setPosts={setreposts} posts={reposts} loading={loading} />
        </div>
      </div>

      <Sidebar />
    </Container>
  );
};
