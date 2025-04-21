import React, { useState, useEffect } from "react";
import axios from "axios";

const typeColors = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-300",
  fighting: "bg-orange-700",
  poison: "bg-purple-600",
  ground: "bg-yellow-600",
  flying: "bg-indigo-400",
  psychic: "bg-pink-400",
  bug: "bg-lime-500",
  rock: "bg-yellow-800",
  ghost: "bg-violet-700",
  dragon: "bg-indigo-700",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

const typeLightColors = {
  normal: "bg-gray-200",
  fire: "bg-red-200",
  water: "bg-blue-200",
  electric: "bg-yellow-200",
  grass: "bg-green-200",
  ice: "bg-cyan-100",
  fighting: "bg-orange-200",
  poison: "bg-purple-200",
  ground: "bg-yellow-100",
  flying: "bg-indigo-200",
  psychic: "bg-pink-200",
  bug: "bg-lime-200",
  rock: "bg-yellow-300",
  ghost: "bg-violet-200",
  dragon: "bg-indigo-300",
  dark: "bg-gray-300",
  steel: "bg-gray-200",
  fairy: "bg-pink-100",
};

const PokemonCard = ({ url }) => {
  const [pokemon, setPokemon] = useState(null);
  const [weaknesses, setWeaknesses] = useState([]);

  useEffect(() => {
    axios.get(url).then(async (res) => {
      const data = res.data;
      setPokemon(data);
      await fetchWeaknesses(data.types);
    });
  }, [url]);

  const fetchWeaknesses = async (types) => {
    try {
      const damageRelationsList = await Promise.all(
        types.map((type) =>
          axios.get(`https://pokeapi.co/api/v2/type/${type.type.name}`)
        )
      );

      const allDoubleDamageFrom = damageRelationsList.flatMap((res) =>
        res.data.damage_relations.double_damage_from.map((t) => t.name)
      );

      const allHalfDamageFrom = damageRelationsList.flatMap((res) =>
        res.data.damage_relations.half_damage_from.map((t) => t.name)
      );

      const allNoDamageFrom = damageRelationsList.flatMap((res) =>
        res.data.damage_relations.no_damage_from.map((t) => t.name)
      );

      const counts = {};
      for (const type of allDoubleDamageFrom) {
        counts[type] = (counts[type] || 0) + 1;
      }
      for (const type of allHalfDamageFrom) {
        counts[type] = (counts[type] || 0) - 1;
      }
      for (const type of allNoDamageFrom) {
        counts[type] = -10;
      }

      const finalWeaknesses = Object.keys(counts).filter(
        (type) => counts[type] > 0
      );

      setWeaknesses(finalWeaknesses);
    } catch (error) {
      console.error("Error fetching weaknesses:", error);
    }
  };

  const handleAddToTeam = () => {
    axios.get("http://localhost:3001/team").then((res) => {
      const team = res.data;
      const alreadyInTeam = team.some((p) => p.name === pokemon.name);
      if (alreadyInTeam || team.length >= 6) return;

      axios.post("http://localhost:3001/team", {
        name: pokemon.name,
        image: pokemon.sprites.other["official-artwork"].front_default,
        stats: pokemon.stats.map((s) => ({
          name: s.stat.name,
          base: s.base_stat,
        })),
      });
    });
  };

  if (!pokemon) return null;

  const primaryType = pokemon.types[0].type.name;
  const figureBg = typeColors[primaryType] || "bg-gray-300";
  const modalBg = typeLightColors[primaryType] || "bg-gray-200";

  return (
    <div
      className="card bg-yellow-200 shadow-md p-2 w-64"
      onClick={() => document.getElementById(`modal-${pokemon.id}`).showModal()}
    >
      <figure className={`rounded-t-lg ${figureBg}`}>
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          className="w-48 cursor-pointer"
          alt={pokemon.name}
        />
      </figure>
      <div className="card-body bg-white rounded-b-lg">
        <h2 className="card-title capitalize">{pokemon.name}</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className={`badge text-white ${typeColors[t.type.name]}`}
            >
              {t.type.name.toUpperCase()}
            </span>
          ))}
        </div>

        {/* Modal */}
        <dialog id={`modal-${pokemon.id}`} className="modal">
          <div className={`modal-box ${modalBg}`}>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <p className="capitalize font-bold text-xl text-center bg-white mt-4 rounded-lg">
              {pokemon.name}{" "}
              <span className="text-slate-400">
                #{pokemon.id.toString().padStart(4, "0")}
              </span>
            </p>

            {/* Wrapper */}
            <div className="mt-2 md:flex md:gap-4 md:justify-center">
              {/* Image */}
              <figure className={`rounded-lg ${figureBg}`}>
                <img
                  src={pokemon.sprites.other["official-artwork"].front_default}
                  className="w-48"
                  alt={pokemon.name}
                />
              </figure>

              {/* Info */}
              <div>
                {/* Types */}
                <div className="bg-white rounded-lg mt-2 px-4 py-2">
                  <p className="font-semibold mb-2 text-base">Types</p>
                  <div className="flex gap-2 flex-wrap">
                    {pokemon.types.map((t) => (
                      <span
                        key={t.type.name}
                        className={`badge text-white ${
                          typeColors[t.type.name]
                        }`}
                      >
                        {t.type.name.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Base Stats */}
                <div className="bg-white rounded-lg mt-2 px-4 py-2">
                  <p className="font-semibold mb-2 text-base">Base Stats</p>
                  <div className="space-y-1">
                    {pokemon.stats.map((stat) => (
                      <div
                        key={stat.stat.name}
                        className="flex items-center justify-between gap-2"
                      >
                        <p className="w-32 text-sm font-medium capitalize">
                          {stat.stat.name}
                        </p>
                        <progress
                          className="progress w-full"
                          value={stat.base_stat}
                          max="200"
                        ></progress>
                        <p className="w-10 text-sm text-right">
                          {stat.base_stat}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weaknesses (Dynamic!) */}
                <div className="bg-white rounded-lg mt-2 px-4 py-2">
                  <p className="font-semibold mb-2 text-base">Weaknesses</p>
                  <div className="flex flex-wrap gap-2">
                    {weaknesses.length > 0 ? (
                      weaknesses.map((type) => (
                        <span
                          key={type}
                          className={`badge text-white ${
                            typeColors[type] || "bg-gray-400"
                          }`}
                        >
                          {type.toUpperCase()}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">Loading...</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Team */}
            <button
              onClick={handleAddToTeam}
              className="btn bg-yellow-400 hover:bg-yellow-500 text-black border-none btn-sm mt-4 w-full"
            >
              Add to Team
            </button>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default PokemonCard;
