import { useEffect, useState } from "react";
import {
  ActionIcon,
  Button,
  Container,
  createStyles,
  Input,
  Text,
  Textarea,
} from "@mantine/core";
import { Sidebar } from "../../Components/Sidebar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import { ArrowLeft } from "phosphor-react";
import { editprofileinfo } from "../../api/GET";
import { updateprofileinfo } from "../../api/UPDATE";

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

export const Editprofile = () => {
  const { classes } = useStyles();
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [btndisabled, setbtndisabled] = useState(true);
  const [flieInputState, setFileInputState] = useState("");
  const [avatar, setavatar] = useState("");
  const [profileinfo, setprofileinfo] = useState({});
  const [newavatar, setnewavatar] = useState("");
  const handleflieInputChange = (e) => {
    setbtndisabled(false);
    const file = e.target.files[0];
    previewFile(file);
  };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setavatar(reader.result);
      setnewavatar(reader.result);
    };
  };
  const handleSave = () => {
    setbtndisabled(true);
    updateprofileinfo(username, newavatar, description)
      .then((res) => {})
      .catch((err) => {
        setbtndisabled(false);
        if (err.response.status === 0) {
          showNotification({
            color: "red",
            title: "Internal Server Error",

            autoClose: 7000,
          });
        } else {
          showNotification({
            color: "red",
            title: "Error",
            message: err.response.data.message,
            autoClose: 7000,
          });
        }
      });
  };
  const handleUndo = () => {
    setUsername(profileinfo.username);
    setDescription(profileinfo.description);
    setavatar(profileinfo.avatar);
    setbtndisabled(true);
    setnewavatar("");
  };
  useEffect(() => {
    editprofileinfo()
      .then((res) => {
        setUsername(res.data.userInfo.username);
        setDescription(res.data.userInfo.description);
        setavatar(res.data.userInfo.avatar);
        setprofileinfo(res.data.userInfo);
      })
      .catch((err) => {
        navigate("/");
        if (err.response.status === 0) {
          showNotification({
            color: "red",
            title: "Internal Server Error",

            autoClose: 7000,
          });
        } else {
          showNotification({
            color: "red",
            title: "Error",
            message: err.response.data.message,
            autoClose: 7000,
          });
        }
      });
  }, []);
  return (
    <Container px={10} className={classes.wrapper}>
      <div className={classes.leftWrapper}>
        <div
          style={{
            background: "white",
            padding: "1rem 0rem 0rem 1rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <ActionIcon onClick={() => navigate(-1)}>
            <ArrowLeft size="20px" />
          </ActionIcon>
          <Text weight={"500"}>Edit profile</Text>
          <div></div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            background: "white",
            padding: "3rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <img
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
              }}
              src={avatar}
              alt=""
            />
            <div>
              <Text>katoph</Text>
              <span className="upload-btn-wrapper">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Text
                    color={"blue"}
                    style={{ paddingTop: "5px", cursor: "pointer" }}
                  >
                    Change profile photo
                  </Text>
                </div>
                <input
                  value={flieInputState}
                  accept="image/*"
                  type="file"
                  onChange={handleflieInputChange}
                />
              </span>
            </div>
          </div>{" "}
          <Input.Wrapper label="Username">
            <Input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setbtndisabled(false);
              }}
            />
          </Input.Wrapper>
          <div>
            <Textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setbtndisabled(false);
              }}
              minRows={3}
              maxRows={4}
              label="Bio"
              maxLength={160}
            />
            <Text style={{ paddingTop: "5px" }} variant="dimmed" size={"xs"}>
              {description.length} / 160
            </Text>
          </div>
          <div
            style={{
              display: "flex",
              gap: "1rem",
            }}
          >
            <Button onClick={handleSave} disabled={btndisabled} radius="sm">
              Save Changes
            </Button>
            <Button
              onClick={() => {
                handleUndo();
              }}
              disabled={btndisabled}
              radius="sm"
              color={"red"}
            >
              Undo all Changes
            </Button>
          </div>
        </div>
      </div>

      <Sidebar />
    </Container>
  );
};
