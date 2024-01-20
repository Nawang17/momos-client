import { Trans } from "@lingui/macro";
import React from "react";
import { useState } from "react";
import { useImageSize } from "react-image-size";
import ImageViewer from "react-simple-image-viewer";

const PostMedia = ({ post }) => {
  const [opened, setOpened] = useState(false);
  const [viewimg, setviewimg] = useState("");
  const [dimensions] = useImageSize(
    post?.filetype === "image" ? post?.image : post?.gif
  );
  return (
    <>
      {/* if media is an image or video */}
      {post.image && (
        <div
          style={{
            padding: "0.5rem 1rem 0rem 1rem",
          }}
        >
          {post?.filetype === "image" ? (
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingBottom:
                  dimensions?.width < dimensions?.height ? "75%" : "0",
                /* 4:3 aspect ratio (change as needed) */
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <img
                style={{
                  position:
                    dimensions?.width < dimensions?.height
                      ? "absolute"
                      : "static",
                  objectFit:
                    dimensions?.width < dimensions?.height ? "cover" : "fill",
                  width: "100%",
                  height: "100%",
                  borderRadius: "4px",
                }}
                onClick={() => {
                  setviewimg(post?.image);
                  setOpened(true);
                }}
                loading="lazy"
                src={post?.image}
                alt=""
              />
            </div>
          ) : (
            <video
              poster={post?.image.slice(0, -3) + "jpg"} //video thumbnail
              style={{ width: "100%", height: "auto", borderRadius: "4px" }}
              controls
            >
              <source src={post?.image} type="video/mp4" />
              <Trans>Your browser does not support the video tag.</Trans>
            </video>
          )}
        </div>
      )}
      {/* if media is a gif */}
      {post?.gif && (
        <div
          style={{
            padding: "0.5rem 1rem 0rem 1rem",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingBottom:
                dimensions?.width < dimensions?.height ? "75%" : "0",

              /* 4:3 aspect ratio (change as needed) */
              overflow: "hidden",
              cursor: "pointer",
            }}
          >
            <img
              onClick={() => {
                setviewimg(post?.gif);
                setOpened(true);
              }}
              style={{
                position:
                  dimensions?.width < dimensions?.height
                    ? "absolute"
                    : "static",
                objectFit:
                  dimensions?.width < dimensions?.height ? "cover" : "fill",
                width: "100%",
                height: "100%",
                borderRadius: "4px",
              }}
              loading="lazy"
              src={post?.gif}
              alt=""
            />
          </div>
        </div>
      )}
      {/* view img or gif component*/}
      {opened && (
        <div
          style={{
            zIndex: 1000,
          }}
        >
          <ImageViewer
            backgroundStyle={{
              zIndex: 1000,
            }}
            src={[viewimg]}
            currentIndex={0}
            disableScroll={false}
            closeOnClickOutside={true}
            onClose={() => {
              setOpened(false);
              setviewimg("");
            }}
          />
        </div>
      )}
    </>
  );
};

export default PostMedia;
