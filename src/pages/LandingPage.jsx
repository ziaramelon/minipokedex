import landingBG from "../assets/landingBG.png";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: `url(${landingBG})`,
      }}
    >
      <div className="hero-content text-neutral-content text-center ">
        <div className="max-w-full">
          <div className="flex justify-center">
          </div>
          <h1 className="mb-5 text-5xl sm:hidden md:text-7xl font-bold text-yellow-400 font-pixel">
            Welcome to Pokémon World!
          </h1>
          <h1 className="mb-5 hidden sm:block typewriter text-5xl md:text-7xl font-bold text-yellow-400 font-pixel">
            Welcome to Pokémon World!
          </h1>
          <Link
            to="/home"
            className="px-6 py-1 bg-lime-800 text-yellow-200 font-bold border-2 border-green-900 rounded-full shadow-[inset_2px_2px_0px_#3d6b3d,inset_-2px_-2px_0px_#1a3d1a] tracking-widest hover:bg-green-700 transition-all font-pixel text-lg"
          >
            START
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
