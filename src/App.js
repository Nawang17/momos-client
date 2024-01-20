import "./App.css";
import { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { AuthContext } from "./context/Auth";
import { LoginStatus } from "./api/AUTH";
import {
  NotificationsProvider,
  showNotification,
} from "@mantine/notifications";
import {
  getTopuser,
  getbookmarksid,
  notiCount,
  suggestedusersreq,
  userlevel,
} from "./api/GET";

import { Affix, Button, MantineProvider, Transition } from "@mantine/core";
import { ArrowUp, HandWaving } from "@phosphor-icons/react";

import { useWindowScroll, useIdle } from "@mantine/hooks";

import { io } from "socket.io-client";

import ReactGA from "react-ga4";

import { ModalsProvider } from "@mantine/modals";
import { lngs } from "./i18n";
import { routes } from "./routes";
import { Darkmodecheck } from "./helper/Darkmodecheck";
import { Trans } from "@lingui/macro";
ReactGA.initialize("G-YJSVSC17CL");

const socket = io(process.env.REACT_APP_SERVER_URL);

function App() {
  const idle = useIdle(60000); //in miliseconds; // 1 minute of inactivity to be considered idle
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [scroll, scrollTo] = useWindowScroll();
  const [darkmode, setdarkmode] = useState(true);
  const [UserInfo, setUserInfo] = useState(null);
  const [followingdata, setfollowingdata] = useState([]);
  const [suggestedUsers, setSuggestedusers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardloading, setLeaderboardloading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [topUser, settopUser] = useState("");
  const [userlevelinfo, setUserlevelinfo] = useState(null);
  const [onlineusers, setonlineusers] = useState([]);
  const [onlinelist, setonlinelist] = useState([]);
  const [bookmarkIds, setbookmarkIds] = useState([]);
  const [currentLng, setcurrentLng] = useState(
    lngs[localStorage.getItem("language")]?.nativeName || "English"
  );
  const [unseennotiCount, setunseennotiCount] = useState(0);
  function getloginstatus() {
    LoginStatus()
      .then((res) => {
        setUserInfo(res.data.user);
        setfollowingdata(res.data.userfollowingarr);
        showNotification({
          icon: <HandWaving size={18} />,
          title: <Trans>Welcome back, {res.data.user.username}</Trans>,

          autoClose: 3000,
        });
        setLoading(false);
      })
      .catch(() => {
        setUserInfo(null);
        setLoading(false);
      });
  }
  function getsuggestedusers() {
    suggestedusersreq({
      name: UserInfo?.username ? UserInfo.username : "suggestedUsers",
    }).then((res) => {
      setSuggestedusers(res.data.suggestedusers);
    });
  }
  function unseennotiCountfunc() {
    notiCount().then((res) => {
      setunseennotiCount(res.data.count);
    });
  }
  function getuserlevel() {
    userlevel()
      .then((res) => {
        setUserlevelinfo(res.data.userlevel);
      })

      .catch(() => {
        setUserInfo(null);
        setUserlevelinfo(null);
      });
  }
  function getuserbookmarkids() {
    getbookmarksid()
      .then((res) => {
        setbookmarkIds(res.data.bookmarkIds);
      })
      .catch(() => {
        setbookmarkIds([]);
      });
  }

  //socket connection intialization

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleOnlineUsers = (data) => {
      setonlinelist(data);
      setonlineusers(data.map((user) => user?.userid));
    };

    // Add event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("onlineusers", handleOnlineUsers);

    // Emit onlinestatus event
    socket.emit("onlinestatus", {
      token: localStorage.getItem("token"),
    });

    // Cleanup function
    return () => {
      // Remove event listeners
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("onlineusers", handleOnlineUsers);
    };
  }, []);

  //socket connection on idle event
  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);

      if (!idle) {
        socket.emit("onlinestatus", {
          token: localStorage.getItem("token"),
        });
      } else {
        socket.emit("removeOnlinestatus", {
          token: localStorage.getItem("token"),
        });
      }
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
      // You might also want to clean up other event listeners here
    };
  }, [idle]);

  useEffect(() => {
    Darkmodecheck(setdarkmode);
    const gettopuserr = async () => {
      await getTopuser().then((res) => {
        settopUser(res.data.topuser);
      });
    };
    gettopuserr();
  }, []);
  useEffect(() => {
    setLoading(true);
    console.log(`
    ███╗   ███╗ ██████╗ ███╗   ███╗ ██████╗ ███████╗
    ████╗ ████║██╔═══██╗████╗ ████║██╔═══██╗██╔════╝
    ██╔████╔██║██║   ██║██╔████╔██║██║   ██║███████╗
    ██║╚██╔╝██║██║   ██║██║╚██╔╝██║██║   ██║╚════██║
    ██║ ╚═╝ ██║╚██████╔╝██║ ╚═╝ ██║╚██████╔╝███████║
    ╚═╝     ╚═╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ ╚══════╝ `);

    getloginstatus();
  }, []);
  useEffect(() => {
    getsuggestedusers();
    if (UserInfo) {
      getuserbookmarkids();
      getuserlevel();
      unseennotiCountfunc();
    } else {
      setUserlevelinfo(null);
      setbookmarkIds([]);
    }
  }, [UserInfo]);

  return (
    <MantineProvider theme={{ colorScheme: darkmode ? "dark" : "light" }}>
      <ModalsProvider>
        <NotificationsProvider
          style={{
            zIndex: 999,
          }}
          position={"bottom-center"}
        >
          <div className="App">
            <Affix position={{ bottom: 20, right: 20 }}>
              <Transition transition="slide-up" mounted={scroll.y > 0}>
                {(transitionStyles) => (
                  <Button
                    size="xs"
                    color="gray"
                    radius="xl"
                    leftIcon={<ArrowUp size={16} />}
                    style={transitionStyles}
                    onClick={() => scrollTo({ y: 0 })}
                  >
                    <Trans>Scroll to top</Trans>
                  </Button>
                )}
              </Transition>
            </Affix>
            <AuthContext.Provider
              value={{
                UserInfo,
                setUserInfo,
                followingdata,
                setfollowingdata,
                suggestedUsers,
                setSuggestedusers,
                darkmode,
                setdarkmode,
                leaderboard,
                setLeaderboard,
                leaderboardloading,
                setLeaderboardloading,
                userlevelinfo,
                setUserlevelinfo,
                onlineusers,
                onlinelist,
                topUser,
                socket,
                bookmarkIds,
                setbookmarkIds,
                currentLng,
                setcurrentLng,
                unseennotiCount,
                setunseennotiCount,
              }}
            >
              <RouterProvider
                router={routes(socket, UserInfo, loading, darkmode)}
              />
            </AuthContext.Provider>
          </div>
        </NotificationsProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
