import { useContext, useState } from "react";
import { Modal, Textarea, Group, Divider, Button, Text } from "@mantine/core";
import {
  CircleWavyCheck,
  ImageSquare,
  Lightning,
  X,
  XCircle,
} from "phosphor-react";
import { AddNewPost } from "../api/POST";
import { showNotification } from "@mantine/notifications";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import locale from "date-fns/locale/en-US";
import { AuthContext } from "../context/Auth";
import { useNavigate } from "react-router-dom";
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
  const maxallowdsize = 41 * 1024 * 1024; //41mb
  const handleflieInputChange = (e) => {
    setError("");
    setPreviewSource("");
    setfiletype("");
    const file = e.target.files[0];

    if (file.size > maxallowdsize) {
      setError("File size is too big. Max allowed size is 41MB");
    } else {
      if (file.type.match("image.*")) {
        setfiletype("image");
      }

      if (file.type.match("video.*")) {
        setfiletype("video");
      }
      previewFile(file);
    }
  };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };
  const closemodal = () => {
    setOpened(false);
    setPreviewSource("");
    settext("");
    setloading(false);
    setError("");
    setFileInputState("");
    setfiletype("");
  };

  const handleSubmit = (e) => {
    setloading(true);
    setError("");
    e.preventDefault();
    AddNewPost(text, previewSource, filetype, quotepostinfo?.id)
      .then((res) => {
        closemodal();

        navigate(`/post/${res.data.newpost.id}`);
        showNotification({
          color: "teal",
          icon: <Lightning size={18} />,
          title: "Post Created Successfully",
          autoClose: 3000,
        });
      })
      .catch((err) => {
        if (err.response.status === 0) {
          setError("Internal Server Error");
        } else {
          setError(err.response.data);
        }
        setloading(false);
      });
  };
  const { darkmode } = useContext(AuthContext);
  return (
    <>
      <Modal
        padding={0}
        opened={opened}
        onClose={() => closemodal()}
        withCloseButton={false}
      >
        <X
          onClick={() => closemodal()}
          style={{ padding: "1rem 0rem 0rem 1rem" }}
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
                onChange={(e) => {
                  setError("");
                  settext(e.target.value);
                }}
                maxLength={255}
                variant="unstyled"
                placeholder={`What's on your mind, ${UserInfo?.username}?`}
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
                      onClick={(e) => {
                        setFileInputState("");
                        setfiletype("");
                        setPreviewSource("");
                      }}
                      style={{
                        position: "absolute",
                        left: "5px",
                        top: "14px",
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

                            setPreviewSource("");
                            setfiletype("");
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
              {quotepostinfo && (
                <div
                  style={{
                    cursor: "pointer",
                    fontSize: "0.9rem",

                    display: "flex",
                    flexDirection: "column",
                    paddingBottom: !quotepostinfo.image ? "0.7rem" : "0",
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
                <div>
                  <span className="upload-btn-wrapper">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
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
                  </span>
                </div>

                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <div style={{ fontSize: "12px" }}> {text.length} / 255</div>
                  <Divider orientation="vertical" />
                  {!loading ? (
                    <Button
                      disabled={text.length === 0 && previewSource === ""}
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
      </Modal>

      <Group position="center"></Group>
    </>
  );
}
