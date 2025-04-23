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
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center font-serif mt-8 text-yellow-400">
          Pokédex
        </h1>

        <label className="input w-full max-w-md mb-6 rounded-full bg-teal-800/50">
          <input
            type="text"
            placeholder="Search Pokémon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full font-pix"
          />
        </label>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-bounce text-xl font-bold text-yellow-400 mb-2">
              Loading Pokémon...
            </div>
            
          </div>
        ) : displayedPokemons.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl font-medium">
              No Pokémon found matching "{search}"
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 btn bg-custom rounded-full text-w border-none"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <>
            <div className="grid place-items-center md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 container">
              {displayedPokemons.map((pokemon, index) => (
                <PokemonCard key={index} url={pokemon.url} />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="join mt-6 mb-4">
              <button
                className="join-item btn bg-custom hover:bg-teal-800 text-w border-none"
                onClick={() => handlePagination(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>

              <button className="join-item btn bg-gray-200 text-black pointer-events-none">
                Page {page} of {totalPages}
              </button>

              <button
                className="join-item btn bg-custom hover:bg-teal-800 text-w border-none"
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
