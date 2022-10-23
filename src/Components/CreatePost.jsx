import React from "react";
import "../App.css";
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
            display: "flex", //test3
            gap: "0.5rem",
          }}
        >
          <img
            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
            src="https://res.cloudinary.com/dwzjfylgh/image/upload/v1648215217/dd23namcxikmc35qewa2.jpg"
            alt=""
          />
          <div style={{ width: "100%" }}>
            <div
              className="createpostdiv"
              style={{
                cursor: "pointer",

                borderRadius: "18px",

                padding: "0.7rem",
                color: "#666",
                fontSize: "15px",
              }}
            >
              What's on your mind, Katoph?{" "}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: "0.5rem",
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
