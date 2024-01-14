import { useContext, useEffect, useState } from "react";
import { Modal, Textarea, Divider, Button, Text } from "@mantine/core";
import { Gif, Lightning, Pencil, X, XCircle } from "@phosphor-icons/react";
import { addComment, addnestedComment } from "../api/POST";
import { showNotification } from "@mantine/notifications";
import { AuthContext } from "../context/Auth";
import GifPicker from "gif-picker-react";
import { useParams } from "react-router-dom";
import { updatecomment, updatenestedcomment } from "../api/UPDATE";
import { Trans } from "@lingui/macro";

export default function NestedReplyModal({
  opened,
  setOpened,
  replypost,
  UserInfo,
  setComments,
  postUser,
  editcommentinfo,
  editreplyingto,
  editnestedcommentinfo,
}) {
  const [error, setError] = useState("");
  const [text, settext] = useState("");
  const [loading, setloading] = useState(false);
  const { darkmode } = useContext(AuthContext);
  const [gifstatus, setgifstatus] = useState(false);
  const [gifpreview, setgifpreview] = useState("");
  const { postid } = useParams();
  useEffect(() => {
    if (editcommentinfo) {
      settext(editcommentinfo.text);
      setgifpreview(editcommentinfo.gif);
    } else if (editnestedcommentinfo) {
      settext(editnestedcommentinfo.text);
      setgifpreview(editnestedcommentinfo.gif);
    }
  }, [opened]);
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
            title: <Trans>Reply added</Trans>,
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
    } else if (editcommentinfo) {
      updatecomment({
        text: text ? text : "",
        postId: postid,
        gif: gifpreview,
        commentid: editcommentinfo.id,
      })
        .then((res) => {
          closemodal();
          //replace the  comment with the updated comment
          setComments((prev) => {
            return prev.map((comment) => {
              if (comment.id === editcommentinfo.id) {
                return res.data.updatedcomment;
              }
              return comment;
            });
          });

          showNotification({
            icon: <Pencil size={18} />,
            color: "green",
            title: <Trans>Comment updated successfully</Trans>,
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
    } else if (editnestedcommentinfo) {
      updatenestedcomment({
        editnestedcommentinfo: editnestedcommentinfo,
        text: text ? text : "",

        gif: gifpreview,
      })
        .then((res) => {
          closemodal();
          //replace the  nested comment with the updated reply

          setComments((prev) => {
            return prev.map((comment) => {
              if (comment.id === editnestedcommentinfo.commentId) {
                return {
                  ...comment,
                  nestedcomments: comment.nestedcomments.map((reply) => {
                    if (reply.id === editnestedcommentinfo.id) {
                      return res.data.updatedreply;
                    }
                    return reply;
                  }),
                };
              }
              return comment;
            });
          });

          showNotification({
            icon: <Pencil size={18} />,
            color: "green",
            title: <Trans>reply updated successfully</Trans>,
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
            title: <Trans>Reply added</Trans>,
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
                <Trans>
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
                    {editcommentinfo && editreplyingto}
                    {editnestedcommentinfo &&
                      editnestedcommentinfo?.repliedtouser?.username}
                  </span>
                </Trans>
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
                value={text}
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
                  <div style={{ fontSize: "12px" }}>{text?.length} / 255</div>
                  <Divider
                    orientation="vertical"
                    color={
                      darkmode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                    }
                  />
                  {editnestedcommentinfo && (
                    <Button
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={
                        text === editnestedcommentinfo.text &&
                        editnestedcommentinfo.gif === gifpreview
                      }
                      loading={loading}
                      radius={"xl"}
                      size="xs"
                    >
                      <Trans>Save changes</Trans>
                    </Button>
                  )}
                  {editcommentinfo && (
                    <Button
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={
                        text === editcommentinfo.text &&
                        editcommentinfo.gif === gifpreview
                      }
                      loading={loading}
                      radius={"xl"}
                      size="xs"
                    >
                      <Trans>Save Changes</Trans>
                    </Button>
                  )}
                  {!editcommentinfo && !editnestedcommentinfo && (
                    <Button
                      onClick={() => {
                        handleSubmit();
                      }}
                      disabled={text?.length === 0 && !gifpreview}
                      loading={loading}
                      radius={"xl"}
                      size="xs"
                    >
                      <Trans>Reply</Trans>
                    </Button>
                  )}
                </div>
              </div>
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
