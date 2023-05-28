import { useContext, useState } from "react";
import { Modal, Textarea, Divider, Button, Text } from "@mantine/core";
import { Gif, Lightning, X, XCircle } from "phosphor-react";
import { addComment, addnestedComment } from "../api/POST";
import { showNotification } from "@mantine/notifications";
import { AuthContext } from "../context/Auth";
import GifPicker from "gif-picker-react";
import { useParams } from "react-router-dom";

export default function NestedReplyModal({
  opened,
  setOpened,
  replypost,
  UserInfo,
  setComments,
  postUser,
}) {
  const [error, setError] = useState("");
  const [text, settext] = useState("");
  const [loading, setloading] = useState(false);
  const { darkmode } = useContext(AuthContext);
  const [gifstatus, setgifstatus] = useState(false);
  const [gifpreview, setgifpreview] = useState("");
  const { postid } = useParams();
  const closemodal = () => {
    setOpened(false);
    settext("");
    setloading(false);
    setError("");
    setgifstatus(false);
    setgifpreview("");
  };

  const handleSubmit = () => {
    setloading(true);
    setError("");
    if (postUser) {
      addComment({ text: text, postid: postid, gif: gifpreview })
        .then((res) => {
          closemodal();
          setComments((prev) => [...prev, res.data.comment]);
          showNotification({
            icon: <Lightning size={18} />,
            title: "Reply added",
            autoClose: 3000,
            color: "green",
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
    } else {
      addnestedComment({ replyinfo: replypost, text, gif: gifpreview })
        .then((res) => {
          closemodal();

          setComments((prev) => {
            return prev.map((comment) => {
              if (comment.id === replypost.commentId) {
                return {
                  ...comment,
                  nestedcomments: [
                    ...comment.nestedcomments,
                    res.data.nestedcomment,
                  ],
                };
              }
              return comment;
            });
          });
          showNotification({
            icon: <Lightning size={18} />,
            color: "green",
            title: "Reply added",
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
    }
  };
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
          style={{ padding: "1rem 0rem 0rem 1rem" }}
          size={20}
        />

        <div
          style={{
            padding: "0.1rem 1rem 0rem 1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "3rem",
            }}
          >
            <div></div>
            <div>
              <div style={{ fontSize: "16px", color: "gray" }}>
                Replying to
                <span
                  style={{
                    cursor: "pointer",
                    paddingLeft: "5px",
                    color: "#1DA1F2",
                    fontWeight: "500",
                  }}
                >
                  {postUser ? postUser : replypost?.replyingto}
                </span>
              </div>
              {error && (
                <div>
                  <Text size={"sm"} color={"red"}>
                    {" "}
                    {error}
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
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
                onChange={(e) => settext(e.target.value)}
                maxLength={255}
                variant="unstyled"
                placeholder="Write your reply"
                autosize
                minRows={2}
                maxRows={14}
              />
              {/* gif preview */}
              {gifpreview && (
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
              {/* image preview */}
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
                  <Gif
                    onClick={() => setgifstatus(!gifstatus)}
                    weight="fill"
                    style={{
                      cursor: "pointer",
                    }}
                    size={23}
                    color={"#0d61e7"}
                  />
                </div>

                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <div style={{ fontSize: "12px" }}>{text.length} / 255</div>
                  <Divider
                    orientation="vertical"
                    color={
                      darkmode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                    }
                  />

                  <Button
                    onClick={() => {
                      handleSubmit();
                    }}
                    disabled={text.length === 0 && !gifpreview}
                    loading={loading}
                    radius={"xl"}
                    size="xs"
                  >
                    Reply
                  </Button>
                </div>
              </div>{" "}
            </div>
          </div>
        </div>
        {gifstatus && (
          <div
            style={{
              padding: "0.5rem 3.8rem",
            }}
          >
            <GifPicker
              onGifClick={(item) => {
                setgifpreview(item.url);
                setgifstatus(false);
              }}
              tenorApiKey={"AIzaSyBlyNG4hMFWeZGLPEKHjoORgf9LeyUp4qI"}
            />
          </div>
        )}
      </Modal>
    </>
  );
}
