import { ActionIcon, Container, createStyles } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { ArrowLeft } from "phosphor-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../Components/Sidebar";
import UserSearch from "./UserSearch";

const useStyles = createStyles(() => ({
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    paddingBottom: "5rem",
    paddingTop: "0.5rem",
  },
  leftWrapper: {
    flex: 0.7,
    "@media (max-width: 700px)": {
      flex: 1,
    },
  },
}));

export const Search = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const { scrollIntoView, targetRef } = useScrollIntoView({
    offset: 64,
  });

  useEffect(() => {
    scrollIntoView();
  }, []);
  return (
    <Container ref={targetRef} px={10} className={classes.wrapper}>
      <div className={classes.leftWrapper}>
        {/* <div style={{ background: "white", padding: "1rem 0rem 0rem 1rem" }}>
          <ActionIcon onClick={() => navigate(-1)}>
            <ArrowLeft size="20px" />
          </ActionIcon>
        </div> */}
        <UserSearch />
      </div>
      <Sidebar />
    </Container>
  );
};
