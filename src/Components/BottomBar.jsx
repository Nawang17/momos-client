import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { ActionIcon } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChatCircleDots,
  House,
  MagnifyingGlass,
  UsersThree,
} from "@phosphor-icons/react";
import { useViewportSize } from "@mantine/hooks";
import useDetectScroll from "@smakss/react-scroll-direction";
const BottomBar = () => {
  const navigate = useNavigate();
  const { height, width } = useViewportSize();
  const { pathname } = useLocation();
  const { UserInfo, darkmode } = useContext(AuthContext);

  const scrollDir = useDetectScroll();
  return (
    <>
      {/* {width < 500 && UserInfo && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
            backgroundColor: darkmode ? "#1A1B1E" : "#fff",
            color: "white",
            display: "flex",
            justifyContent: "space-around",
            padding: scrollDir === "down" ? "15px 0px 35px 0" : "15px 0px",
            borderTop: !darkmode ? "1px solid #e9ecef" : "1px solid #2C2E33",
            zIndex: 999,
          }}
        >
          <>
            <ActionIcon
              size="lg"
              onClick={() => {
                if (pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  navigate("/");
                }
              }}
            >
              <House
                weight={pathname === "/" ? "fill" : "regular"}
                size={28}
                color={darkmode ? "white" : "black"}
              />
            </ActionIcon>

            <ActionIcon
              size="lg"
              onClick={() => {
                navigate("/discover");
              }}
            >
              <MagnifyingGlass
                weight={pathname === "/discover" ? "fill" : "regular"}
                color={darkmode ? "white" : "black"}
                size={28}
              />
            </ActionIcon>

            <ActionIcon
              size="lg"
              onClick={() => {
                navigate("/communities");
              }}
            >
              <UsersThree
                weight={pathname === "/communities" ? "fill" : "regular"}
                color={darkmode ? "white" : "black"}
                size={28}
              />
            </ActionIcon>
            <ActionIcon size="lg">
              <ChatCircleDots
                weight={
                  pathname === "/chatrooms" || pathname.split("/")[1] === "chat"
                    ? "fill"
                    : "regular"
                }
                onClick={() => {
                  navigate("/chatrooms");
                }}
                color={darkmode ? "white" : "black"}
                size={28}
              />
            </ActionIcon>
          </>
        </div>
      )} */}
    </>
  );
};

export default BottomBar;
