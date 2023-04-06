import { useEffect, useState } from "react";
import {
  ActionIcon,
  Avatar,
  BackgroundImage,
  Button,
  Container,
  createStyles,
  Indicator,
  Input,
  Skeleton,
  Text,
  Textarea,
} from "@mantine/core";
import { Sidebar } from "../../Components/Sidebar";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import {
  ArrowLeft,
  Camera,
  CircleWavyCheck,
  Pencil,
  WarningCircle,
} from "phosphor-react";
import { editprofileinfo } from "../../api/GET";
import { updateprofileinfo } from "../../api/UPDATE";
import { useContext } from "react";
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
    width: "100%",
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
  const [banner, setbanner] = useState("");
  const [newbanner, setnewbanner] = useState("");
  const [btndisabled, setbtndisabled] = useState(true);
  const [avatar, setavatar] = useState("");
  const [profileinfo, setprofileinfo] = useState({});
  const [newavatar, setnewavatar] = useState("");
  const { setUserInfo, UserInfo, darkmode } = useContext(AuthContext);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");
  const handleflieInputChange = (e) => {
    seterror("");
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
  const handlebannerInputChange = (e) => {
    seterror("");
    setbtndisabled(false);
    const file = e.target.files[0];
    bannerpreviewFile(file);
  };
  const bannerpreviewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setbanner(reader.result);
      setnewbanner(reader.result);
    };
  };
  const handleSave = () => {
    setbtndisabled(true);
    updateprofileinfo(username, newavatar, description, newbanner)
      .then((res) => {
        setUserInfo(res.data.newUserInfo);
        showNotification({
          icon: <Pencil size={18} />,
          message: "Profile updated successfully",
          color: "teal",
        });
        navigate(`/${res.data.newUserInfo.username}`);
      })
      .catch((err) => {
        setbtndisabled(false);
        if (err.response.status === 0) {
          showNotification({
            color: "red",
            title: "Error",
            message: "Internal Server Error",
            autoClose: 4000,
          });
          seterror("Internal Server Error");
        } else {
          showNotification({
            color: "red",
            title: "Error",
            message: err.response.data,
            autoClose: 4000,
          });
          seterror(err.response.data);
        }
      });
  };
  const handleUndo = () => {
    setUsername(profileinfo.username);
    setDescription(profileinfo.description);
    setavatar(profileinfo.avatar);
    setbanner(profileinfo.profilebanner.imageurl);
    setbtndisabled(true);
    setnewavatar("");
    setnewbanner("");
  };
  useEffect(() => {
    setloading(true);
    if (!UserInfo) {
      navigate("/");
    }
    editprofileinfo()
      .then((res) => {
        setUsername(res.data.userInfo.username);
        setDescription(res.data.userInfo.description);
        setavatar(res.data.userInfo.avatar);
        setprofileinfo(res.data.userInfo);
        setbanner(res.data.userInfo.profilebanner.imageurl);
        setloading(false);
      })
      .catch((err) => {
        navigate("/");
        if (err.response.status === 0) {
          showNotification({
            icon: <WarningCircle size={18} />,
            color: "red",
            title: "Internal Server Error",
            autoClose: 4000,
          });
        } else {
          showNotification({
            color: "red",
            title: "Error",
            message: err.response.data.message,
            autoClose: 4000,
          });
        }
      });
  }, []);
  return (
    <Container px={0} className={classes.wrapper}>
      <div className={classes.leftWrapper}>
        <div
          style={{
            backgroundColor: darkmode ? "#1A1B1E" : "white",
            color: darkmode ? "white" : "black",
            padding: "1rem 2rem 1rem 1rem",
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
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              backgroundColor: darkmode ? "#1A1B1E" : "white",
              color: darkmode ? "white" : "black",
              padding: "3rem",
            }}
          >
            <Text weight={"500"} size={"md"} color={"red"}>
              {error}
            </Text>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Skeleton height={60} circle />
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.2rem",
                  }}
                >
                  <Text>{username}</Text>
                  {profileinfo.verified && (
                    <CircleWavyCheck size={17} color="#0ba6da" weight="fill" />
                  )}
                </div>
              </div>
            </div>{" "}
            <div>
              <Textarea
                value={description}
                onChange={(e) => {
                  seterror("");
                  setDescription(e.target.value);
                  setbtndisabled(false);
                }}
                minRows={3}
                maxRows={4}
                label="Bio"
                maxLength={160}
              />
              <Text style={{ paddingTop: "5px" }} variant="dimmed" size={"xs"}>
                {description?.length} / 160
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
        ) : (
          <div
            style={{
              backgroundColor: darkmode ? "#1A1B1E" : "white",
              color: darkmode ? "white" : "black",
              // padding: "1rem",
            }}
          >
            <BackgroundImage src={banner} radius="xs">
              {" "}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "0.5rem 0.5rem 0 0",
                }}
              >
                {profileinfo.username !== "Demo" && (
                  <span className="upload-btn-wrapper">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ActionIcon
                        radius={"xl"}
                        color="dark"
                        size={"xl"}
                        variant="light"
                      >
                        <Camera color="white" size="1.5rem" />
                      </ActionIcon>
                    </div>
                    <input
                      accept="image/*"
                      type="file"
                      onChange={handlebannerInputChange}
                    />
                  </span>
                )}
              </div>
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",

                    height: "10rem",
                  }}
                >
                  <Indicator
                    children={<div>hello</div>}
                    style={{
                      padding: "1rem 0rem 0rem 0.5rem",
                      marginBottom: "-8rem",
                    }}
                    disabled={true}
                    color={"green"}
                    withBorder
                    inline
                    position="bottom-end"
                    offset={18}
                    size={16}
                  >
                    <Avatar
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        border: !darkmode
                          ? "5px solid white"
                          : "5px solid #1A1B1E",
                      }}
                      size="lg"
                      src={avatar}
                    />
                  </Indicator>
                </div>
              </>
            </BackgroundImage>
            <div
              style={{
                padding: "0.4rem 0 0 4.5rem",
              }}
            >
              {" "}
              {profileinfo.username !== "Demo" && (
                <span className="upload-btn-wrapper">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ActionIcon
                      style={{
                        border: !darkmode
                          ? "4px solid white"
                          : "4px solid #1A1B1E",
                      }}
                      size="lg"
                      radius="xl"
                      variant="filled"
                      color="blue"
                    >
                      <Camera size={16} />
                    </ActionIcon>
                  </div>
                  <input
                    accept="image/*"
                    type="file"
                    onChange={handleflieInputChange}
                  />
                </span>
              )}
            </div>

            <div
              style={{
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                paddingTop: "1rem",
              }}
            >
              {UserInfo?.username !== "Demo" && (
                <Input.Wrapper label="Username">
                  <Input
                    value={username}
                    onChange={(e) => {
                      seterror("");
                      setUsername(e.target.value);
                      setbtndisabled(false);
                    }}
                  />
                </Input.Wrapper>
              )}
              <div>
                <Textarea
                  value={description}
                  onChange={(e) => {
                    seterror("");
                    setDescription(e.target.value);
                    setbtndisabled(false);
                  }}
                  minRows={3}
                  maxRows={4}
                  label="Bio"
                  maxLength={160}
                />
                <Text
                  style={{ paddingTop: "5px" }}
                  variant="dimmed"
                  size={"xs"}
                >
                  {description?.length} / 160
                </Text>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
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
        )}
      </div>

      <Sidebar />
    </Container>
  );
};
