import { Navbar } from "./Components/Navbar";
import { Home } from "./views/Home/Home";
import { Login } from "./views/Login/Login";
import { Register } from "./views/Register/Register";
import { SinglePost } from "./views/SinglePost/SinglePost";
import { createBrowserRouter } from "react-router-dom";
import { Profile } from "./views/Profile/Profile";
import { RouteError } from "./Components/RouteError";
import { Hero } from "./Components/Hero";

import { Editprofile } from "./views/UserSettings/Editprofile";
import { Search } from "./views/Search/Search";
import { SuggestedAccs } from "./views/SuggestedAccounts/SuggestedAccs";
import { Leaderboard } from "./views/Leaderboard/Leaderboard";
import ScrollToTop from "./helper/ScrollToTop";
import { About } from "./Components/About";
import { Chat } from "./views/Chat/Chat";
import { Reposts } from "./views/Reposts/Reposts";
import { Chatrooms } from "./views/Chat/Chatrooms";
import { Discover } from "./views/Discover/Discover";
import { SettingsPage } from "./views/settingspage/settingsPage";
import { Bookmarks } from "./views/bookmark/Bookmarks";
import { Admin } from "./views/admin/Admin";
import { Communities } from "./views/communities/Communities";
import { CommunityProfile } from "./views/communities/CommunityProfile";
import { Singlecommunitypost } from "./views/singlecommunitypost/Singelcommunitypost";
import BottomBar from "./Components/BottomBar";
import { ForgotPasswordUpdate } from "./views/Login/ForgotPasswordUpdate";

export const routes = (socket, UserInfo, loading, darkmode) => {
  return createBrowserRouter([
    {
      path: "/communitypost/:postid",
      element: (
        <>
          <Navbar socket={socket} />

          <ScrollToTop />

          <Singlecommunitypost />
          <BottomBar />
        </>
      ),
      errorElement: <RouteError />,
    },
    {
      path: "/Communities",
      element: (
        <>
          <Navbar socket={socket} />

          <ScrollToTop />

          <Communities />
          <BottomBar />
        </>
      ),
      errorElement: <RouteError />,
    },
    {
      path: "/community/:name",
      element: (
        <>
          <Navbar socket={socket} />

          <ScrollToTop />

          <CommunityProfile />
          <BottomBar />
        </>
      ),
      errorElement: <RouteError />,
    },
    {
      path: "/discover",
      element: (
        <>
          <Navbar socket={socket} />

          <ScrollToTop />

          <Discover />
          <BottomBar />
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
          <BottomBar />
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
          <BottomBar />
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
          <BottomBar />
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
          <BottomBar />
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
          <BottomBar />
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
          <BottomBar />
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
          <BottomBar />
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
          <BottomBar />
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
          <BottomBar />
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
          <BottomBar />
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
          <BottomBar />
        </>
      ),
    },
    {
      path: "/settings",
      element: (
        <>
          <Navbar socket={socket} />

          <ScrollToTop />

          <SettingsPage socket={socket} />
        </>
      ),
    },
    {
      path: "/bookmarks",
      element: (
        <>
          <Navbar socket={socket} />

          <ScrollToTop />

          <Bookmarks />
          <BottomBar />
        </>
      ),
    },
    {
      path: "/admin",
      element: (
        <>
          <Navbar socket={socket} />

          <ScrollToTop />

          <Admin />
          <BottomBar />
        </>
      ),
    },
    // reset-password
    {
      path: "/reset-password/:resetToken",
      element: (
        <>
          <Navbar socket={socket} />

          <ScrollToTop />

          <ForgotPasswordUpdate socket={socket} />
          <BottomBar />
        </>
      ),
    },
  ]);
};
