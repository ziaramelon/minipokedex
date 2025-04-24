import BG from "../assets/bg.png";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: `url(${BG})`,
      }}
    >
      <div className="hero-content text-neutral-content text-center ">
        <div className="max-w-full mb-12">
          <div className="flex justify-center"></div>
          <h1 className="mb-5 text-3xl sm:hidden font-bold text-yellow-400 font-pixel tracking-wider">
            Welcome to Pokémon World!
          </h1>
          <h1 className="mb-5 hidden sm:block typewriter sm:text-3xl lg:text-6xl font-bold text-yellow-400 font-pixel tracking-wider">
            Welcome to Pokémon World!
          </h1>
          <Link
            to="/home"
            className="px-6 py-2 bg-lime-800 text-yellow-200 font-bold border-2 border-green-900 rounded-full shadow-[inset_2px_2px_0px_#3d6b3d,inset_-2px_-2px_0px_#1a3d1a] tracking-widest hover:bg-green-700 transition-all font-pix text-xs"
          >
            START
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
