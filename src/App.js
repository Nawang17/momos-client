import "./App.css";
import { useState } from "react";
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
function App() {
  const [UserInfo, setUserInfo] = useState(null);
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
      path: "/Post",
      element: (
        <>
          <Navbar />
          <SinglePost />
        </>
      ),
      errorElement: <RouteError />,
    },
    {
      path: "/Profile",
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
        }}
      >
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </div>
  );
}

export default App;
