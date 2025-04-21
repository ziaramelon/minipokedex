import { Routes, Route, Link } from "react-router-dom";
import Home from './pages/Home';
import TeamPage from "./pages/TeamPage";
import BattlePage from "./pages/BattlePage";

function App() {
  return (
    <>
      <nav className="navbar bg-base-100 shadow mb-4">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            Pokédex
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/team">Team</Link>
            </li>
            <li>
              <Link to="/battle">Battle</Link>
            </li>
          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/battle" element={<BattlePage />} />
      </Routes>

    </>
  );
}

export default App;
