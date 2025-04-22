import Pokeball from "../assets/pokeball.png";
import DBall from "../assets/3dBall.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="navbar bg-teal-800 shadow-sm px-6 sm:px-12 md:px-16 sticky top-0 z-10 text-yellow-300">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost  text-xl uppercase p-0 flex items-center gap-1 lg:text-4xl font-pixel hover:bg-custom">
          <img src={DBall} alt="Pokemon logo" className="size-12" />
          Pokémon
        </Link>
      </div>
      <div className="navbar-end hidden md:flex">
        <ul className="menu menu-horizontal px-1 lg:text-2xl font-pixel">
          <li>
            <Link to="/home" className="rounded-full bg-custom">Pokédex</Link>
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
  );
};

export default Header;
