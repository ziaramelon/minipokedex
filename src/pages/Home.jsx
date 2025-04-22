import Header from "../components/Header";
import React, { useState, useEffect } from "react";
import axios from "axios";
import PokemonCard from "../components/PokemonCard";

const Home = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [displayedPokemons, setDisplayedPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1); // State for pagination
  const [loading, setLoading] = useState(true); // Loading state
  const [totalPages, setTotalPages] = useState(1); // Track total pages

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=1000`) // Fetch a larger number of Pokémon
      .then((res) => {
        setPokemonList(res.data.results);
        setDisplayedPokemons(res.data.results.slice(0, 12)); // Set initial 12 displayed Pokémon
        setTotalPages(Math.ceil(res.data.results.length / 12));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Pokemon data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filteredPokemons = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(search.toLowerCase())
    );

    setTotalPages(Math.ceil(filteredPokemons.length / 12));

    // If current page exceeds new total pages, reset to page 1
    if (
      page > Math.ceil(filteredPokemons.length / 12) &&
      filteredPokemons.length > 0
    ) {
      setPage(1);
    }

    const startIndex = (page - 1) * 12;
    const newDisplayedPokemons = filteredPokemons.slice(
      startIndex,
      startIndex + 12
    );
    setDisplayedPokemons(newDisplayedPokemons);
  }, [search, page, pokemonList]);

  const handlePagination = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <Header />
      <div className="p-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-center">Pokédex</h1>

        <label className="input border-2 border-yellow-200 w-full max-w-md mb-6">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="text"
            placeholder="Search Pokémon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </label>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-bounce text-xl font-bold text-yellow-500 mb-2">
              Loading Pokémon...
            </div>
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-yellow-500 border-r-yellow-300 border-b-yellow-400 border-l-yellow-200 animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-gray-300"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>
        ) : displayedPokemons.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl font-medium">
              No Pokémon found matching "{search}"
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 btn bg-yellow-400 hover:bg-yellow-500 text-black border-none"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-4 mt-4 container">
              {displayedPokemons.map((pokemon, index) => (
                <PokemonCard key={index} url={pokemon.url} />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="join mt-6 mb-4">
              <button
                className="join-item btn bg-yellow-400 hover:bg-yellow-500 text-black border-none"
                onClick={() => handlePagination(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>

              <button className="join-item btn bg-gray-200 text-black pointer-events-none">
                Page {page} of {totalPages}
              </button>

              <button
                className="join-item btn bg-yellow-400 hover:bg-yellow-500 text-black border-none"
                onClick={() => handlePagination(page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
