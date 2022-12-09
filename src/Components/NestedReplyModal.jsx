import { useContext, useState } from "react";
import { Modal, Textarea, Group, Divider, Button, Text } from "@mantine/core";
import { Lightning, X } from "phosphor-react";
import { addnestedComment } from "../api/POST";
import { showNotification } from "@mantine/notifications";
import { AuthContext } from "../context/Auth";
export default function NestedReplyModal({
  opened,
  setOpened,
  replypost,
  UserInfo,
  setReplyPost,
  setComments,
}) {
  const [error, setError] = useState("");
  const [text, settext] = useState("");
  const [loading, setloading] = useState(false);
  const { darkmode } = useContext(AuthContext);
  const closemodal = () => {
    setOpened(false);
    settext("");
    setloading(false);
    setError("");
    setReplyPost(null);
  };

  const handleSubmit = (e) => {
    setloading(true);
    setError("");
    e.preventDefault();
    addnestedComment({ replyinfo: replypost, text })
      .then((res) => {
        closemodal();
        // setHomePosts((prev) => [res.data.newpost, ...prev]);
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
                  {replypost?.replyingto}
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
                onChange={(e) => settext(e.target.value)}
                maxLength={255}
                variant="unstyled"
                placeholder="Write your reply"
                autosize
                minRows={2}
                maxRows={14}
              />

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
                  <span className="upload-btn-wrapper">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <div style={{ fontSize: "12px" }}>
                        {text.length} / 255
                      </div>
                    </div>
                  </span>
                </div>

                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <Divider
                    orientation="vertical"
                    color={
                      darkmode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                    }
                  />

                  <Button
                    disabled={text.length === 0}
                    loading={loading}
                    type="submit"
                    radius={"xl"}
                    size="xs"
                  >
                    Reply
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
