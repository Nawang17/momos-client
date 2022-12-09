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
import { likedPosts, suggestedusersreq } from "./api/GET";
import { Editprofile } from "./views/UserSettings/Editprofile";
import { Search } from "./views/Search/Search";
import { SuggestedAccs } from "./views/SuggestedAccounts/SuggestedAccs";
import { MantineProvider } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { HandWaving } from "phosphor-react";
function App() {
  const [darkmode, setdarkmode] = useState(true);

  const [UserInfo, setUserInfo] = useState(null);
  const [likedpostIds, setLikedpostIds] = useState([]);
  const [followingdata, setfollowingdata] = useState([]);
  const [suggestedUsers, setSuggestedusers] = useState([]);
  useLayoutEffect(() => {
    if (!localStorage.getItem("darkmode")) {
      localStorage.setItem("darkmode", "true");
    }
    if (localStorage.getItem("darkmode") === "true") {
      setdarkmode(true);

      document.body.style = "background: #101113;";
    } else {
      setdarkmode(false);

      document.body.style = "background: #f0f2f5;";
    }
  }, []);
  useEffect(() => {
    scrollIntoView();
    console.log(`
    ███╗   ███╗ ██████╗ ███╗   ███╗ ██████╗ ███████╗
    ████╗ ████║██╔═══██╗████╗ ████║██╔═══██╗██╔════╝
    ██╔████╔██║██║   ██║██╔████╔██║██║   ██║███████╗
    ██║╚██╔╝██║██║   ██║██║╚██╔╝██║██║   ██║╚════██║
    ██║ ╚═╝ ██║╚██████╔╝██║ ╚═╝ ██║╚██████╔╝███████║
    ╚═╝     ╚═╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ ╚══════╝ `);
    LoginStatus()
      .then(async (res) => {
        await likedPosts().then((res) => {
          setLikedpostIds(res.data.likedposts);
        });
        likedPosts().then((res) => {
          setLikedpostIds(res.data.likedposts);
        });
        setUserInfo(res.data.user);
        setfollowingdata(res.data.userfollowingarr);
        showNotification({
          icon: <HandWaving size={18} />,
          title: `You are logged in as ${res.data.user.username}`,
          message: "Welcome back to momos",

          autoClose: 3000,
        });
      })
      .catch(() => {
        setUserInfo(null);
      });
  }, []);
  useEffect(() => {
    suggestedusersreq({
      name: UserInfo?.username ? UserInfo.username : "suggestedUsers",
    }).then((res) => {
      setSuggestedusers(res.data.suggestedusers);
    });
  }, [UserInfo]);
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Navbar />
          {!UserInfo && <Hero darkmode={darkmode} />}

          <Home />
        </>
      ),
      errorElement: <RouteError />,
    },
    {
      path: "/search/q/:searchquery",
      element: (
        <>
          <Navbar />
          <Search />
        </>
      ),
      errorElement: <RouteError />,
    },

    {
      path: "/post/:postid",
      element: (
        <>
          <Navbar />
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
          <Navbar />
          <Profile />
        </>
      ),
      errorElement: <RouteError />,
    },
    {
      path: "/suggestedaccounts",
      element: (
        <>
          <Navbar />
          <SuggestedAccs />
        </>
      ),
      errorElement: <RouteError />,
    },
    {
      path: "/editprofile",
      element: (
        <>
          <Navbar />
          <Editprofile />
        </>
      ),
      errorElement: <RouteError />,
    },
    {
      path: "/Login",
      element: (
        <>
          <Navbar />
          <Login />
        </>
      ),
      errorElement: <RouteError />,
    },
    {
      path: "/Register",
      element: (
        <>
          <Navbar />
          <Register />
        </>
      ),
      errorElement: <RouteError />,
    },
  ]);
  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView({
    offset: 66,
  });
  return (
    <MantineProvider theme={{ colorScheme: darkmode ? "dark" : "light" }}>
      <NotificationsProvider position="bottom-center">
        <div ref={targetRef} className="App">
          <AuthContext.Provider
            value={{
              UserInfo,
              setUserInfo,
              likedpostIds,
              setLikedpostIds,
              followingdata,
              setfollowingdata,
              suggestedUsers,
              setSuggestedusers,
              darkmode,
              setdarkmode,
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
