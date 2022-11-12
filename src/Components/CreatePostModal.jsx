import { useState } from "react";
import { Modal, Textarea, Group, Divider, Button, Text } from "@mantine/core";
import { ImageSquare, X, XCircle } from "phosphor-react";
import { AddNewPost } from "../api/POST";
import { showNotification } from "@mantine/notifications";
export default function CreatePostModal({
  opened,
  setOpened,
  setHomePosts,
  UserInfo,
}) {
  const [flieInputState, setFileInputState] = useState("");

  const [previewSource, setPreviewSource] = useState("");
  const [error, setError] = useState("");
  const [text, settext] = useState("");
  const [loading, setloading] = useState(false);
  const [filetype, setfiletype] = useState("");
  const maxallowdsize = 41 * 1024 * 1024; //41mb
  const handleflieInputChange = (e) => {
    setError("");
    setPreviewSource("");
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
    AddNewPost(text, previewSource, filetype)
      .then((res) => {
        closemodal();
        setHomePosts((prev) => [res.data.newpost, ...prev]);
        showNotification({
          title: "Post Created Successfully",
          autoClose: 4000,
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
              src={UserInfo.avatar}
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
                placeholder={`What's on your mind, ${UserInfo.username}?`}
                autosize
                minRows={2}
                maxRows={14}
              />
              {filetype === "video" && previewSource && (
                <span
                  onClick={() => {
                    setFileInputState("");

                    setPreviewSource("");
                  }}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <XCircle size={25} /> Remove video
                </span>
              )}

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
                    <video style={{ width: "100%", height: "auto" }} controls>
                      <source src={previewSource} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}

              <Divider my="xs" color={"#E1E8ED"} />

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
                      <ImageSquare size={23} color="#0d61e7" />
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

                  <Button
                    loading={loading}
                    type="submit"
                    radius={"xl"}
                    size="xs"
                  >
                    {!loading ? "Post" : "Posting"}
                  </Button>
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
