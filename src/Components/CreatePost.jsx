import { Button, Textarea } from "@mantine/core";
import React from "react";

const CreatePost = () => {
  return (
    //TODO : continue working on create post component
    <>
      <div
        style={{
          padding: "1rem",
          background: "white",
          marginBottom: "0.5rem",
          borderRadius: "4px",
        }}
      >
        <div
          style={{
            display: "flex", //test2
            gap: "0.5rem",
          }}
        >
          <img
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            src="https://res.cloudinary.com/dwzjfylgh/image/upload/v1648215217/dd23namcxikmc35qewa2.jpg"
            alt=""
          />
          <div style={{ width: "100%" }}>
            <Textarea
              placeholder="What's on your mind, Katoph?"
              autosize
              minRows={1}
              maxRows={15}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: "0.5rem",
              }}
            >
              <Button>Post</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
