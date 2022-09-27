import "./App.css";
import { Navbar } from "./Components/Navbar";
import { Hero } from "./Components/Hero";
import { Home } from "./views/Home/Home";
import { Login } from "./views/Login/Login";
import { Register } from "./views/Register/Register";
import { SinglePost } from "./views/SinglePost/SinglePost";
import { Profile } from "./views/Profile/Profile";
function App() {
  return (
    <div className="App">
      <Navbar />
      {/* <Hero /> */}
      {/* <Home /> */}
      {/* <SinglePost /> */}
      <Profile />
      {/* <Login /> */}
      {/* <Register /> */}
    </div>
  );
}

export default App;
