import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import TeamPage from "./pages/TeamPage";
import BattlePage from "./pages/BattlePage";
import History from "./pages/History";
import Pokeball from "./assets/pokeball.png";

function App() {
  return (
    <>
      
      <div className="navbar bg-base-100 shadow-sm px-6 sm:px-12 md:px-16 sticky top-0 z-10">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl p-0 flex items-center gap-1 lg:text-2xl">
            <img src={Pokeball} alt="Pokemon logo" className="size-6" />
            Pokémon
          </a>
        </div>
        <div className="navbar-end hidden md:flex">
          <ul className="menu menu-horizontal px-1 lg:text-lg">
            <li>
              <Link to="/home">Pokédex</Link>
            </li>
            <li>
              <Link to="/team">Team</Link>
            </li>
            <li>
              <Link to="/battle">Battle</Link>
            </li>
            <li>
              <Link to="/history">History</Link>
            </li>
          </ul>
        </div>
        <div className="dropdown navbar-end md:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box top-12 z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/home">Pokédex</Link>
            </li>
            <li>
              <Link to="/team">Team</Link>
            </li>
            <li>
              <Link to="/battle">Battle</Link>
            </li>
            <li>
              <Link to="/history">History</Link>
            </li>
          </ul>
        </div>
      </div>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/battle" element={<BattlePage />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </>
  );
}

export default App;
