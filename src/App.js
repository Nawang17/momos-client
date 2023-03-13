import "./App.css";
import { useState, useEffect, useLayoutEffect } from "react";
import { Navbar } from "./Components/Navbar";
import { Home } from "./views/Home/Home";
import { Login } from "./views/Login/Login";
import { Register } from "./views/Register/Register";
import { SinglePost } from "./views/SinglePost/SinglePost";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Profile } from "./views/Profile/Profile";
import { RouteError } from "./Components/RouteError";
import { Hero } from "./Components/Hero";
import { AuthContext } from "./context/Auth";
import { LoginStatus } from "./api/AUTH";
import {
  NotificationsProvider,
  showNotification,
} from "@mantine/notifications";
import { leaderboardinfo, suggestedusersreq, userlevel } from "./api/GET";
import { Editprofile } from "./views/UserSettings/Editprofile";
import { Search } from "./views/Search/Search";
import { SuggestedAccs } from "./views/SuggestedAccounts/SuggestedAccs";
import { Affix, Button, MantineProvider, Transition } from "@mantine/core";
import { ArrowUp, HandWaving } from "phosphor-react";
import { Leaderboard } from "./views/Leaderboard/Leaderboard";
import ScrollToTop from "./helper/ScrollToTop";
import { useWindowScroll } from "@mantine/hooks";
import { About } from "./Components/About";
import { Chat } from "./views/Chat/Chat";
import { Reposts } from "./views/Reposts/Reposts";
import { io } from "socket.io-client";
import { Chatrooms } from "./views/Chat/Chatrooms";
import { Discover } from "./views/Discover/Discover";
import { useNetwork } from "@mantine/hooks";
const socket = io(process.env.REACT_APP_SERVER_URL);

function App() {
  const networkStatus = useNetwork();
  const [isConnected, setIsConnected] = useState(socket.connected);

  const [darkmode, setdarkmode] = useState(true);

  const [UserInfo, setUserInfo] = useState(null);

  const [followingdata, setfollowingdata] = useState([]);
  const [suggestedUsers, setSuggestedusers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardloading, setLeaderboardloading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userlevelinfo, setUserlevelinfo] = useState(null);
  const [onlineusers, setonlineusers] = useState([]);
  const [onlinelist, setonlinelist] = useState([]);
  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.emit("onlinestatus", {
      token: localStorage.getItem("token"),
    });

    socket.on("onlineusers", (data) => {
      setonlinelist(data);
      setonlineusers(
        data.map((user) => {
          return user?.userid;
        })
      );
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem("darkmode") === null) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        localStorage.setItem("darkmode", "true");
        setdarkmode(true);
        document.body.style = "background: #101113;";
      } else {
        localStorage.setItem("darkmode", "false");
        setdarkmode(false);
        document.body.style = "background: #f0f2f5;";
      }
    } else {
      if (localStorage.getItem("darkmode") === "true") {
        setdarkmode(true);

        document.body.style = "background: #101113;";
      } else {
        setdarkmode(false);

        document.body.style = "background: #f0f2f5;";
      }
    }
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
    async function getloginstatus() {
      await LoginStatus()
        .then(async (res) => {
          setUserInfo(res.data.user);
          setfollowingdata(res.data.userfollowingarr);
          showNotification({
            icon: <HandWaving size={18} />,
            title: `Welcome back, ${res.data.user.username}`,

            autoClose: 3000,
          });
          setLoading(false);
        })
        .catch(() => {
          setUserInfo(null);
          setLoading(false);
        });
    }
    getloginstatus();
  }, []);
  useEffect(() => {
    async function getleaderboard() {
      await leaderboardinfo(0)
        .then((res) => {
          setLeaderboard(res.data.leaderboard);
          setLeaderboardloading(false);
        })
        .catch(() => {
          setLeaderboardloading(true);
        });
    }
    async function getsuggestedusers() {
      await suggestedusersreq({
        name: UserInfo?.username ? UserInfo.username : "suggestedUsers",
      }).then((res) => {
        setSuggestedusers(res.data.suggestedusers);
      });
    }
    async function getuserlevel() {
      await userlevel()
        .then((res) => {
          setUserlevelinfo(res.data.userlevel);
        })

        .catch(() => {
          setUserlevelinfo(null);
        });
    }
    getleaderboard();
    getsuggestedusers();
    if (UserInfo) {
      getuserlevel();
    } else {
      setUserlevelinfo(null);
    }
  }, [UserInfo]);
  const router = createBrowserRouter([
    {
      path: "/discover",
      element: (
        <>
          <Navbar socket={socket} />

          <ScrollToTop />

          <Discover />
        </>
      ),
      errorElement: <RouteError />,
    },
    {
      path: "/",
      element: (
        <>
          <Navbar socket={socket} />

          <ScrollToTop />

          {!UserInfo && !loading && <Hero darkmode={darkmode} />}

          <Home />
        </>
      ),
      errorElement: <RouteError />,
    },
    {
      path: "/search/q/:searchquery",
      element: (
        <>
          <Navbar socket={socket} />

          <ScrollToTop />

          <Search />
        </>
      ),
      errorElement: <RouteError />,
    },

    {
      path: "/post/:postid",
      element: (
        <>
          <ScrollToTop />

          <Navbar socket={socket} />

          <SinglePost />
        </>
      ),
      errorElement: <RouteError />,
    },
    //profile page
    {
      path: "/:userprofile",
      element: (
        <>
          <ScrollToTop />

          <Navbar socket={socket} />

          <Profile />
        </>
      ),
      errorElement: <RouteError />,
    },
    {
      path: "/reposts/:postId",
      element: (
        <>
          <ScrollToTop />

          <Navbar socket={socket} />

          <Reposts />
        </>
      ),
      errorElement: <RouteError />,
    },
    {
      path: "/suggestedaccounts",
      element: (
        <>
          <Navbar socket={socket} />

          <ScrollToTop />

          <SuggestedAccs />
        </>
      ),
      errorElement: <RouteError />,
    },
    {
      path: "/Leaderboard",
      element: (
        <>
          <Navbar socket={socket} />

          <ScrollToTop />

          <Leaderboard />
        </>
      ),
      errorElement: <RouteError />,
    },
    {
      path: "/editprofile",
      element: (
        <>
          <Navbar socket={socket} />

          <ScrollToTop />

          <Editprofile />
        </>
      ),
      errorElement: <RouteError />,
    },
    {
      path: "/Login",
      element: (
        <>
          <Navbar socket={socket} />

          <ScrollToTop />

          <Login socket={socket} />
        </>
      ),
      errorElement: <RouteError />,
    },
    {
      path: "/Register",
      element: (
        <>
          <Navbar socket={socket} />

          <ScrollToTop />

          <Register socket={socket} />
        </>
      ),
      errorElement: <RouteError />,
    },
    {
      path: "/About",
      element: (
        <>
          <Navbar socket={socket} />

          <ScrollToTop />

          <About />
        </>
      ),
    },
    {
      path: "/Chat/:roomid",
      element: (
        <>
          <Navbar socket={socket} />

          <ScrollToTop />

          <Chat socket={socket} />
        </>
      ),
    },
    {
      path: "/Chatrooms",
      element: (
        <>
          <Navbar socket={socket} />

          <ScrollToTop />

          <Chatrooms />
        </>
      ),
    },
  ]);
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <MantineProvider theme={{ colorScheme: darkmode ? "dark" : "light" }}>
      <NotificationsProvider position="bottom-center">
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
                  Scroll to top
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
            }}
          >
            <RouterProvider router={router} />
          </AuthContext.Provider>
        </div>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default App;
