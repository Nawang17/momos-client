import "./App.css";
import { useState, useEffect } from "react";
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
import { showNotification } from "@mantine/notifications";
import { likedPosts, suggestedusersreq } from "./api/GET";
function App() {
  const [UserInfo, setUserInfo] = useState(null);
  const [likedpostIds, setLikedpostIds] = useState([]);
  const [followingdata, setfollowingdata] = useState([]);
  const [suggestedUsers, setSuggestedusers] = useState([]);
  useEffect(() => {
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
          title: `You are logged in as ${res.data.user.username}`,
          message: "Welcome back to momos",

          autoClose: 5000,
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
          {!UserInfo && <Hero />}

          <Home />
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
  return (
    <div className="App">
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
        }}
      >
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </div>
  );
}

export default App;
