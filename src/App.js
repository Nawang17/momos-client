import "./App.css";
import { Navbar } from "./views/Components/Navbar";
import { Hero } from "./views/Components/Hero";
import { Home } from "./views/Home/Home";
import { Login } from "./views/Login/Login";
import { Register } from "./views/Register/Register";
function App() {
  return (
    <div className="App">
      <Navbar />
      {/* <Hero />
      <Home /> */}
      <Login />
      {/* <Register /> */}
    </div>
  );
}

export default App;
