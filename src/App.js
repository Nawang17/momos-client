import "./App.css";
import { Navbar } from "./views/Components/Navbar";
import { Hero } from "./views/Components/Hero";
import { Home } from "./views/Home/Home";
function App() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Home />
    </div>
  );
}

export default App;
