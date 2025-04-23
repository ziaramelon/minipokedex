import React, { useState, useEffect } from "react";
import axios from "axios";

const typeColors = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-custom",
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
  grass: "bg-custom",
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

const Team = () => {
  const [team, setTeam] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    // Fetch team data from JSON server
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await axios.get("http://localhost:3001/team");
      const fetchedTeam = res.data;
      setTeam(fetchedTeam);

      const details = {};
      await Promise.all(
        fetchedTeam.map(async (p) => {
          const response = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${p.name}`
          );
          const pokemon = response.data;
          const weaknesses = await getWeaknesses(pokemon.types);
          details[pokemon.name] = { ...pokemon, weaknesses };
        })
      );

      setPokemonDetails(details);
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };

  const getWeaknesses = async (types) => {
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

    return Object.keys(counts).filter((type) => counts[type] > 0);
  };

  const removeFromTeam = (id) => {
    // Close the modal first
    const modal = document.getElementById(`modal-${id}`);
    if (modal) modal.close(); // Close the modal

    // Proceed with removing from the team
    axios.delete(`http://localhost:3001/team/${id}`).then(() => {
      // Optimistically update the state without waiting for a re-fetch
      setTeam((prevTeam) => prevTeam.filter((pokemon) => pokemon.id !== id));
    });
  };

  return (
    <div>
      <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center font-serif mt-8 text-yellow-400">
        My Pokémon Team
      </h2>
      {team.length === 0 ? (
        <p className="text-center text-slate-500">Your team is empty.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:px-12 gap-4 place-items-center container mx-auto">
          {team.map((p) => {
            const pokemon = pokemonDetails[p.name];
            if (!pokemon) return null;

            const primaryType = pokemon.types[0].type.name;
            const figureBg = typeColors[primaryType] || "bg-gray-300";
            const modalBg = typeLightColors[primaryType] || "bg-gray-200";

            return (
              <div
                key={pokemon.id}
                className={`card shadow-md p-2 w-64 rounded-3xl ${figureBg}`}
                onClick={() =>
                  document.getElementById(`modal-${p.id}`).showModal()
                }
              >
                <figure className="rounded-t-3xl bg-w flex-col pt-6">
                  <img
                    src={
                      pokemon.sprites.other["official-artwork"].front_default
                    }
                    className="w-36 cursor-pointer"
                    alt={pokemon.name}
                  />
                  <div className="w-full px-4 mt-2">
                    <hr />
                  </div>
                </figure>
                <div className="card-body pt-4 bg-w rounded-b-3xl">
                  <div>
                    <span className="text-num font-pixel text-2xl font-medium">
                      #{pokemon.id.toString().padStart(4, "0")}
                    </span>
                    <h2 className="card-title capitalize font-bold text-2xl">
                      {pokemon.name}
                    </h2>
                  </div>
                  <div className="flex flex-wrap justify-between mb-2">
                    {pokemon.types.map((t) => (
                      <span
                        key={t.type.name}
                        className={`rounded-full text-white capitalize px-6 py-0 font-medium ${
                          typeColors[t.type.name]
                        }`}
                      >
                        {t.type.name}
                      </span>
                    ))}
                  </div>

                  {/* Modal */}
                  <dialog id={`modal-${p.id}`} className="modal">
                    <div
                      className={`modal-box ${modalBg} max-w-max p-3 rounded-3xl`}
                    >
                      <div className="bg-w px-4 pt-2 rounded-3xl relative">
                        <form method="dialog">
                          <button className="btn btn-sm btn-circle btn-ghost absolute right-0 top-0">
                            ✕
                          </button>
                        </form>
                        {/* <p className="capitalize font-bold text-xl text-center border">
                          {pokemon.name}{" "}
                          <span className="text-slate-400">
                            #{pokemon.id.toString().padStart(4, "0")}
                          </span>
                        </p> */}

                        {/* Wrapper */}
                        <div className="mt-2 md:flex md:gap-4 md:justify-center">
                          <figure className="">
                            <img
                              src={
                                pokemon.sprites.other["official-artwork"]
                                  .front_default
                              }
                              className="w-48"
                              alt={pokemon.name}
                            />
                          </figure>

                          {/* Info */}
                          <div>
                            {/* name */}
                            <p className="capitalize font-bold text-3xl text-center md:text-left flex flex-col md:px-4">
                              <span className="text-num font-pixel text-2xl font-medium">
                                #{pokemon.id.toString().padStart(4, "0")}
                              </span>
                              {pokemon.name}{" "}
                            </p>
                            <div className="md:w-1/2 px-4 mt-4">
                              <hr />
                            </div>

                            {/* stats */}
                            <div className="md:flex">
                              {/* types and weakness */}
                              <div className="md:flex md:flex-col md:justify-between">
                                {/* types */}
                                <div className="mt-2 px-4 py-2">
                                  <p className="font-semibold mb-2 text-base font-pix md:text-lg">
                                    TYPES
                                  </p>
                                  <div className="flex gap-2 flex-wrap">
                                    {pokemon.types.map((t) => (
                                      <span
                                        key={t.type.name}
                                        className={`rounded-full text-white capitalize px-6 py-0 font-medium ${
                                          typeColors[t.type.name]
                                        }`}
                                      >
                                        {t.type.name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                {/* Weakness */}
                                <div className="mt-2 px-4 py-2">
                                  <p className="font-semibold mb-2 text-base font-pix md:text-lg">
                                    WEAKNESSES
                                  </p>
                                  <div className="flex flex-wrap gap-2 md:grid md:grid-cols-2">
                                    {pokemonDetails[p.name].weaknesses.length >
                                    0 ? (
                                      pokemonDetails[p.name].weaknesses.map(
                                        (type) => (
                                          <span
                                            key={type}
                                            className={`text-center rounded-full text-white capitalize px-6 py-0 font-medium ${
                                              typeColors[type] || "bg-gray-400"
                                            }`}
                                          >
                                            {type}
                                          </span>
                                        )
                                      )
                                    ) : (
                                      <p className="text-sm text-gray-500 italic">
                                        Loading...
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* battle stats */}
                              <div className="mt-2 px-4 py-2 md:w-72">
                                <p className="font-semibold mb-2 text-base font-pix md:text-lg">
                                  BATTLE STATS
                                </p>
                                <div className="space-y-1">
                                  {pokemon.stats.map((stat) => (
                                    <div
                                      key={stat.stat.name}
                                      className="flex items-center justify-between gap-2"
                                    >
                                      <p className="w-full text-sm font-medium capitalize">
                                        {stat.stat.name}
                                      </p>
                                      <progress
                                        className="progress progress-accent w-full"
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
                            </div>
                            <div className="grid place-items-center">
                              {/* Remove from Team Button */}
                              <button
                                onClick={() => removeFromTeam(p.id)}
                                className="btn bg-button text-w text-pix md:text-base hover:bg-red-500 border-none btn-sm mt-4 w-1/2 rounded-lg mb-4"
                              >
                                Remove from Team
                              </button>
                            </div>
                          </div>
                        </div>

                        
                      </div>
                    </div>
                  </dialog>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Team;
