import { useContext, useState } from "react";
import {
  Modal,
  Textarea,
  Group,
  Divider,
  Button,
  Text,
  Input,
  Select,
} from "@mantine/core";
import {
  Alarm,
  ChartBarHorizontal,
  CircleWavyCheck,
  Gif,
  ImageSquare,
  Lightning,
  X,
  XCircle,
} from "phosphor-react";
import { AddNewPost, AddNewPostpoll } from "../api/POST";
import { showNotification } from "@mantine/notifications";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import locale from "date-fns/locale/en-US";
import { AuthContext } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import GifPicker from "gif-picker-react";
export default function CreatePostModal({
  opened,
  setOpened,

  UserInfo,
  quotepostinfo,
}) {
  const formatDistanceLocale = {
    lessThanXSeconds: "{{count}}s",
    xSeconds: "{{count}}s",
    halfAMinute: "30s",
    lessThanXMinutes: "{{count}}m",
    xMinutes: "{{count}}m",
    aboutXHours: "{{count}}h",
    xHours: "{{count}}h",
    xDays: "{{count}}d",
    aboutXWeeks: "{{count}}w",
    xWeeks: "{{count}}w",
    aboutXMonths: "{{count}}mo",
    xMonths: "{{count}}mo",
    aboutXYears: "{{count}}y",
    xYears: "{{count}}y",
    overXYears: "{{count}}y",
    almostXYears: "{{count}}y",
  };
  function formatDistance(token, count, options) {
    options = options || {};

    const result = formatDistanceLocale[token].replace("{{count}}", count);

    if (options.addSuffix) {
      if (options.comparison > 0) {
        return "in " + result;
      } else {
        return result + " ago";
      }
    }

    return result;
  }
  const [flieInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [text, settext] = useState("");
  const [loading, setloading] = useState(false);
  const [filetype, setfiletype] = useState("");
  const [media, setmedia] = useState(null);
  const [poll, setpoll] = useState(false);
  const [choice1, setchoice1] = useState("");
  const [choice2, setchoice2] = useState("");
  const [choice3, setchoice3] = useState("");
  const [choice4, setchoice4] = useState("");
  const [polldays, setpolldays] = useState("1");
  const [pollhours, setpollhours] = useState("0");
  const [pollminutes, setpollminutes] = useState("0");
  const [pollquestion, setpollquestion] = useState("");
  const [gifstatus, setgifstatus] = useState(false);
  const [gifpreview, setgifpreview] = useState("");
  const imgsizelimit = 9437184; //9mb
  const videosizelimit = 52428800; //50 mb

  const validpoll = () => {
    if (poll) {
      if (
        choice1.replace(/\s/g, "").length > 0 &&
        choice2.replace(/\s/g, "").length > 0 &&
        pollquestion.length > 0
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };
  const resetpoll = () => {
    setpoll(false);
    setpollquestion("");
    setchoice1("");
    setchoice2("");
    setchoice3("");
    setchoice4("");
    setpolldays("1");
    setpollhours("0");
    setpollminutes("0");
  };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };
  const handleflieInputChange = (e) => {
    setError("");
    setPreviewSource("");
    setfiletype("");
    const file = e.target.files[0];
    if (file.type.match("image.*")) {
      if (file.size > imgsizelimit) {
        setError("Image size is too big. Max allowed size is 9MB");
      } else {
        setfiletype("image");
        previewFile(file);
        setmedia(file);
      }
    }
    if (file.type.match("video.*")) {
      if (file.size > videosizelimit) {
        setError("Video size is too big. Max allowed size is 95MB");
      } else {
        setfiletype("video");

        previewFile(file);
        setmedia(file);
      }
    }
  };

  const closemodal = () => {
    setOpened(false);
    setPreviewSource("");
    settext("");
    setloading(false);
    setError("");
    setFileInputState("");
    setfiletype("");
    setmedia(null);
    resetpoll();
    setpollquestion("");
    setgifstatus(false);
    setgifpreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setloading(true);
    setError("");
    if (poll) {
      await AddNewPostpoll(
        choice1,
        choice2,
        choice3,
        choice4,
        pollquestion,
        polldays,
        pollhours,
        pollminutes
      )
        .then((res) => {
          closemodal();

          navigate(`/post/${res.data.newpostid}`);
          showNotification({
            color: "teal",
            icon: <Lightning size={18} />,
            title: "Post Created Successfully",
            autoClose: 3000,
          });
        })
        .catch((err) => {
          setloading(false);
          if (err.response.status === 0) {
            setError("Internal Server Error");
          } else {
            setError(err.response.data);
          }
        });
    } else {
      const formData = new FormData();
      formData.append("media", media);
      formData.append("text", text);
      formData.append("quoteid", quotepostinfo?.id ? quotepostinfo?.id : "");
      formData.append("gif", gifpreview);

      await AddNewPost(formData)
        .then((res) => {
          closemodal();

          navigate(`/post/${res.data.newpostid}`);
          showNotification({
            color: "teal",
            icon: <Lightning size={18} />,
            title: "Post Created Successfully",
            autoClose: 3000,
          });
        })
        .catch((err) => {
          setloading(false);
          if (err.response.status === 0) {
            setError("Internal Server Error");
          } else {
            setError(err.response.data);
          }
        });
    }
  };
  const { darkmode } = useContext(AuthContext);
  return (
    <>
      <Modal
        zIndex={1000}
        padding={0}
        opened={opened}
        onClose={() => closemodal()}
        withCloseButton={false}
      >
        <X
          onClick={() => closemodal()}
          style={{
            padding: "1rem 0rem 0rem 1rem",
          }}
          size={20}
        />

        {error && (
          <div style={{ padding: "1rem 0rem 0rem 1rem" }}>
            <Text size={"sm"} color={"red"}>
              {" "}
              {error}
            </Text>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              padding: "1rem",
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <img
              style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              src={UserInfo?.avatar}
              alt=""
            />
            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
              }}
            >
              <Textarea
                value={poll ? pollquestion : text}
                onChange={(e) => {
                  setError("");
                  if (poll) {
                    setpollquestion(e.target.value);
                  } else {
                    settext(e.target.value);
                  }
                }}
                maxLength={poll ? 255 : 500}
                variant="unstyled"
                placeholder={
                  !poll
                    ? `What's on your mind, ${UserInfo?.username}?`
                    : "What's your question?"
                }
                autosize
                minRows={2}
                maxRows={14}
              />
              {/* image preview */}
              {previewSource && (
                <div
                  style={{
                    paddingTop: "10px",
                    paddingBottom: "10px",

                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  {filetype !== "video" && (
                    <span
                      onClick={() => {
                        setFileInputState("");
                        setfiletype("");
                        setPreviewSource("");
                        setmedia(null);
                      }}
                      style={{
                        position: "absolute",
                        left: "5px",
                        top: "14px",
                        cursor: "pointer",
                      }}
                    >
                      <XCircle size={25} />
                    </span>
                  )}

                  {previewSource && filetype === "image" ? (
                    <img
                      style={{ width: "100%", height: "auto" }}
                      src={previewSource}
                      alt=""
                    />
                  ) : (
                    <>
                      {filetype === "video" && previewSource && (
                        <span
                          onClick={() => {
                            setFileInputState("");
                            setfiletype("");
                            setPreviewSource("");
                            setmedia(null);
                          }}
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <XCircle size={25} />
                        </span>
                      )}
                      <video
                        style={{ width: "200px", height: "200px" }}
                        controls
                      >
                        <source src={previewSource} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </>
                  )}
                </div>
              )}
              {/* gif preview */}
              {gifstatus && (
                <div
                  style={{
                    paddingTop: "10px",
                    paddingBottom: "10px",

                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  {gifpreview && (
                    <span
                      onClick={() => {
                        setgifpreview("");
                      }}
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        left: "5px",
                        top: "14px",
                      }}
                    >
                      <XCircle size={25} />
                    </span>
                  )}

                  {gifpreview && (
                    <img
                      style={{ width: "100%", height: "auto" }}
                      src={gifpreview}
                      alt=""
                    />
                  )}
                </div>
              )}
              {quotepostinfo && (
                <div
                  style={{
                    cursor: "pointer",
                    fontSize: "0.9rem",

                    display: "flex",
                    flexDirection: "column",

                    paddingBottom:
                      !quotepostinfo.image && !quotepostinfo.gif
                        ? "0.7rem"
                        : "0",
                    gap: "0.5rem",
                    borderRadius: "0.5rem",

                    border: darkmode
                      ? "1px solid #2f3336"
                      : "1px solid #e6ecf0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "0.3rem",
                      alignItems: "center",
                      padding: "0.7rem 0.7rem 0 0.7rem",
                    }}
                  >
                    <img
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                      }}
                      src={quotepostinfo?.user?.avatar}
                      alt=""
                    />
                    <div
                      style={{
                        display: "flex",
                        gap: "0.2rem",
                        alignItems: "center",
                      }}
                    >
                      <Text size="15px" weight={500}>
                        {quotepostinfo?.user?.username}
                      </Text>
                      {quotepostinfo?.user.verified &&
                        (quotepostinfo?.user.id !== 5 ? (
                          <CircleWavyCheck
                            size={17}
                            color="#0ba6da"
                            weight="fill"
                          />
                        ) : (
                          <CircleWavyCheck
                            size={17}
                            color="#0ba6da"
                            weight="fill"
                          />
                        ))}
                    </div>
                    <Text color={"dimmed"}>·</Text>
                    <Text color={"dimmed"}>
                      {" "}
                      {formatDistanceToNowStrict(
                        new Date(quotepostinfo?.createdAt),
                        {
                          locale: {
                            ...locale,
                            formatDistance,
                          },
                        }
                      )}
                    </Text>
                  </div>
                  {quotepostinfo?.text && (
                    <Text
                      size="15px"
                      style={{
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                        padding: "0 0.7rem 0 0.7rem",
                      }}
                    >
                      {quotepostinfo?.text}
                    </Text>
                  )}

                  {quotepostinfo?.image && (
                    <>
                      {quotepostinfo?.filetype === "image" ? (
                        <img
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "0 0 0.5rem 0.5rem",
                          }}
                          loading="lazy"
                          src={quotepostinfo?.image}
                          alt=""
                        />
                      ) : (
                        <video
                          poster={quotepostinfo?.image.slice(0, -3) + "jpg"}
                          // preload="none"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "0 0 0.5rem 0.5rem",
                          }}
                          controls
                        >
                          <source src={quotepostinfo?.image} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </>
                  )}
                  {quotepostinfo?.gif && (
                    <>
                      <img
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "0 0 0.5rem 0.5rem",
                        }}
                        loading="lazy"
                        src={quotepostinfo?.gif}
                        alt=""
                      />
                    </>
                  )}
                </div>
              )}
              {/* Polls  */}
              {poll && (
                <div
                  style={{
                    backgroundColor: darkmode ? "#2f3336" : "#e6ecf0",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      padding: "10px 0",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <Input.Wrapper label="Choice 1" required>
                      <Input
                        value={choice1}
                        onChange={(e) => setchoice1(e.target.value)}
                        maxLength={25}
                        placeholder="Choice 1"
                      />
                    </Input.Wrapper>
                    <Input.Wrapper label="Choice 2" required>
                      <Input
                        value={choice2}
                        onChange={(e) => setchoice2(e.target.value)}
                        maxLength={25}
                        placeholder="Choice 2"
                      />
                    </Input.Wrapper>{" "}
                    <Input.Wrapper
                      onChange={(e) => setchoice3(e.target.value)}
                      label="Choice 3 (optional)"
                    >
                      <Input
                        value={choice3}
                        maxLength={25}
                        placeholder="Choice 3"
                      />
                    </Input.Wrapper>{" "}
                    <Input.Wrapper label="Choice 4 (optional)">
                      <Input
                        value={choice4}
                        maxLength={25}
                        onChange={(e) => setchoice4(e.target.value)}
                        placeholder="Choice 4"
                      />
                    </Input.Wrapper>
                  </div>
                  <Divider
                    my="xs"
                    color={
                      darkmode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                    }
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.2rem",
                    }}
                  >
                    <Alarm weight="fill" />
                    <Text weight={600} size="14px">
                      Poll duration
                    </Text>
                  </div>{" "}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      paddingTop: "0.5rem",
                    }}
                  >
                    <Select
                      value={polldays}
                      onChange={setpolldays}
                      label="Days"
                      data={[
                        { value: "0", label: "0" },
                        { value: "1", label: "1" },
                        { value: "2", label: "2" },
                        { value: "3", label: "3" },
                        { value: "4", label: "4" },
                        { value: "5", label: "5" },
                        { value: "6", label: "6" },
                        { value: "7", label: "7" },
                      ]}
                    />
                    <Select
                      label="Hours"
                      value={pollhours}
                      onChange={setpollhours}
                      data={[
                        { value: "0", label: "0" },
                        { value: "1", label: "1" },
                        { value: "2", label: "2" },
                        { value: "3", label: "3" },
                        { value: "4", label: "4" },
                        { value: "5", label: "5" },
                        { value: "6", label: "6" },
                        { value: "7", label: "7" },
                        { value: "8", label: "8" },
                        { value: "9", label: "9" },
                        { value: "10", label: "10" },
                        { value: "11", label: "11" },
                        { value: "12", label: "12" },
                        { value: "13", label: "13" },
                        { value: "14", label: "14" },
                        { value: "15", label: "15" },
                        { value: "16", label: "16" },
                        { value: "17", label: "17" },
                        { value: "18", label: "18" },
                        { value: "19", label: "19" },
                        { value: "20", label: "20" },
                        { value: "21", label: "21" },
                        { value: "22", label: "22" },
                        { value: "23", label: "23" },
                      ]}
                    />
                    <Select
                      value={pollminutes}
                      onChange={setpollminutes}
                      label="Minutes"
                      data={[
                        { value: "0", label: "0" },
                        { value: "1", label: "1" },
                        { value: "2", label: "2" },
                        { value: "3", label: "3" },
                        { value: "4", label: "4" },
                        { value: "5", label: "5" },
                        { value: "6", label: "6" },
                        { value: "7", label: "7" },
                        { value: "8", label: "8" },
                        { value: "9", label: "9" },
                        { value: "10", label: "10" },
                        { value: "11", label: "11" },
                        { value: "12", label: "12" },
                        { value: "13", label: "13" },
                        { value: "14", label: "14" },
                        { value: "15", label: "15" },
                        { value: "16", label: "16" },
                        { value: "17", label: "17" },
                        { value: "18", label: "18" },
                        { value: "19", label: "19" },
                        { value: "20", label: "20" },
                        { value: "21", label: "21" },
                        { value: "22", label: "22" },
                        { value: "23", label: "23" },
                        { value: "24", label: "24" },
                        { value: "25", label: "25" },
                        { value: "26", label: "26" },
                        { value: "27", label: "27" },
                        { value: "28", label: "28" },
                        { value: "29", label: "29" },
                        { value: "30", label: "30" },
                        { value: "31", label: "31" },
                        { value: "32", label: "32" },
                        { value: "33", label: "33" },
                        { value: "34", label: "34" },
                        { value: "35", label: "35" },
                        { value: "36", label: "36" },
                        { value: "37", label: "37" },
                        { value: "38", label: "38" },
                        { value: "39", label: "39" },
                        { value: "40", label: "40" },
                        { value: "41", label: "41" },
                        { value: "42", label: "42" },
                        { value: "43", label: "43" },
                        { value: "44", label: "44" },
                        { value: "45", label: "45" },
                        { value: "46", label: "46" },
                        { value: "47", label: "47" },
                        { value: "48", label: "48" },
                        { value: "49", label: "49" },
                        { value: "50", label: "50" },
                        { value: "51", label: "51" },
                        { value: "52", label: "52" },
                        { value: "53", label: "53" },
                        { value: "54", label: "54" },
                        { value: "55", label: "55" },
                        { value: "56", label: "56" },
                        { value: "57", label: "57" },
                        { value: "58", label: "58" },
                        { value: "59", label: "59" },
                      ]}
                    />
                  </div>
                  <Text color="dimmed" pt={10} size={"xs"} pb={10}>
                    Default poll duration: 1 day if no selection made.
                  </Text>
                  <Button
                    onClick={() => {
                      setpoll(false);
                      settext(pollquestion);
                      resetpoll();
                    }}
                    fullWidth
                    color="red"
                  >
                    Remove Poll
                  </Button>
                </div>
              )}

              <Divider
                my="xs"
                color={darkmode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {poll || gifstatus ? (
                    <ImageSquare size={23} color={"gray"} />
                  ) : (
                    <div className="upload-btn-wrapper">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          cursor: "pointer",
                        }}
                      >
                        <ImageSquare size={23} color={"#0d61e7"} />
                      </div>
                      <input
                        value={flieInputState}
                        accept="image/* video/*"
                        type="file"
                        onChange={handleflieInputChange}
                      />
                    </div>
                  )}

                  <ChartBarHorizontal
                    onClick={() => {
                      if (
                        !poll &&
                        !quotepostinfo &&
                        !previewSource &&
                        !gifstatus
                      ) {
                        setpoll(true);
                        setpollquestion(text);
                      }
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                    size={23}
                    color={
                      !poll && !quotepostinfo && !previewSource && !gifstatus
                        ? "#0d61e7"
                        : "gray"
                    }
                  />
                  <Gif
                    onClick={() => {
                      if (
                        !poll &&
                        !quotepostinfo &&
                        !previewSource &&
                        !gifstatus
                      ) {
                        setgifstatus(true);
                        setgifpreview("");
                      }
                      if (gifstatus) {
                        setgifstatus(false);
                        setgifpreview("");
                      }
                    }}
                    weight="fill"
                    style={{
                      cursor: "pointer",
                    }}
                    size={23}
                    color={
                      !poll && !quotepostinfo && !previewSource && !gifstatus
                        ? "#0d61e7"
                        : "gray"
                    }
                  />
                </div>

                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <div style={{ fontSize: "12px" }}>
                    {" "}
                    {!poll ? text.length : pollquestion.length} /{" "}
                    {poll ? "255" : "500"}
                  </div>
                  <Divider orientation="vertical" />
                  {!loading ? (
                    <Button
                      disabled={
                        gifpreview === "" &&
                        text.length === 0 &&
                        previewSource === "" &&
                        validpoll()
                          ? true
                          : false
                      }
                      type="submit"
                      radius={"xl"}
                      size="xs"
                    >
                      Post
                    </Button>
                  ) : (
                    <Button
                      loading={loading}
                      type="submit"
                      radius={"xl"}
                      size="xs"
                    >
                      Posting
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
        {gifstatus && (
          <div
            style={{
              padding: "0.5rem 3.8rem",
            }}
          >
            <GifPicker
              onGifClick={(item) => {
                setgifstatus(true);
                setgifpreview(item.url);
              }}
              tenorApiKey={"AIzaSyBlyNG4hMFWeZGLPEKHjoORgf9LeyUp4qI"}
            />
          </div>
        )}
      </Modal>

      <Group position="center"></Group>
    </>
  );
}
