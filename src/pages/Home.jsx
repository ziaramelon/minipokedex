import React, { useState, useEffect } from "react";
import axios from "axios";
import PokemonCard from "../components/PokemonCard";

const Home = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [displayedPokemons, setDisplayedPokemons] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1); // State for pagination
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=1000`) // Fetch a larger number of Pokémon
      .then((res) => {
        setPokemonList(res.data.results);
        setDisplayedPokemons(res.data.results.slice(0, 12)); // Set initial 12 displayed Pokémon
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filteredPokemons = pokemonList.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(search.toLowerCase())
    );
    const startIndex = (page - 1) * 12;
    const newDisplayedPokemons = filteredPokemons.slice(
      startIndex,
      startIndex + 12
    );
    setDisplayedPokemons(newDisplayedPokemons);
  }, [search, page, pokemonList]);

  const handlePagination = (newPage) => {
    if (newPage > 0) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <input
        type="text"
        placeholder="Search Pokémon"
        className="input input-bordered w-full max-w-xs"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex flex-wrap justify-center gap-4 mt-4 container">
        {loading ? (
          <div>Loading...</div>
        ) : (
          displayedPokemons.map((pokemon, index) => (
            <PokemonCard key={index} url={pokemon.url} />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="join mt-4">
        <button
          className="join-item btn bg-yellow-400 hover:bg-yellow-500 text-black border-none"
          onClick={() => handlePagination(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          className="join-item btn bg-yellow-400 hover:bg-yellow-500 text-black border-none"
          onClick={() => handlePagination(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
