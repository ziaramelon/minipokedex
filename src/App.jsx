import { Routes, Route, Link } from "react-router-dom";
import Landing from "./pages/LandingPage";
import Home from "./pages/Home";
import TeamPage from "./pages/TeamPage";
import BattlePage from "./pages/BattlePage";
import History from "./pages/History";


function App() {
  return (
    <>
      
  
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/battle" element={<BattlePage />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </>
  );
}

export default App;
