import React, { useEffect, useState } from "react";
import axios from "axios";
import VS from "../assets/vs.png";
import Pokelogo from "../assets/logo.png";

const typeColors = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400",
  normal: "bg-gray-400",
  fighting: "bg-orange-700",
  flying: "bg-indigo-300",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  rock: "bg-yellow-800",
  bug: "bg-lime-500",
  ghost: "bg-purple-700",
  steel: "bg-gray-500",
  psychic: "bg-pink-500",
  ice: "bg-blue-200",
  dragon: "bg-indigo-600",
  dark: "bg-gray-800",
  fairy: "bg-pink-300",
};

const Battle = () => {
  const [team, setTeam] = useState([]);
  const [allPokemon, setAllPokemon] = useState([]);
  const [poke1, setPoke1] = useState(null);
  const [poke2, setPoke2] = useState(null);
  const [battleResults, setBattleResults] = useState([]);
  const [overallWinner, setOverallWinner] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    // Check for saved battle data in localStorage
    const loadSavedState = () => {
      try {
        const savedBattle = localStorage.getItem("pokemonBattle");
        if (savedBattle) {
          const parsedData = JSON.parse(savedBattle);
          if (parsedData.poke1) setPoke1(parsedData.poke1);
          if (parsedData.poke2) setPoke2(parsedData.poke2);
          if (parsedData.battleResults)
            setBattleResults(parsedData.battleResults);
          if (parsedData.overallWinner)
            setOverallWinner(parsedData.overallWinner);
        }
      } catch (error) {
        console.error("Error loading saved battle state:", error);
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch team data
        const teamResponse = await axios.get("http://localhost:3001/team");
        setTeam(teamResponse.data);

        // Fetch all Pokemon data
        const pokemonResponse = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=151"
        );
        const detailedData = await Promise.all(
          pokemonResponse.data.results.map((p) =>
            axios.get(p.url).then((r) => r.data)
          )
        );
        setAllPokemon(detailedData);

        // Load saved state after we have the Pokemon data
        loadSavedState();
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Save battle state to localStorage whenever it changes
  useEffect(() => {
    if (poke1 || poke2 || battleResults.length > 0) {
      const battleState = {
        poke1,
        poke2,
        battleResults,
        overallWinner,
      };
      localStorage.setItem("pokemonBattle", JSON.stringify(battleState));
    }
  }, [poke1, poke2, battleResults, overallWinner]);

  const selectPokemonFromDropdown = (name, setter) => {
    const selected = allPokemon.find((p) => p.name === name);
    setter(selected);
  };

  const pickRandomEnemy = () => {
    const randomPoke =
      allPokemon[Math.floor(Math.random() * allPokemon.length)];
    setPoke2(randomPoke);
  };

  const getStat = (pokemon, statName) =>
    pokemon.stats.find((s) => s.stat.name === statName)?.base_stat || 0;

  const simulateBattle = async () => {
    if (!poke1 || !poke2) return;

    const rounds = ["hp", "attack", "speed"];
    let playerWins = 0;
    let enemyWins = 0;

    const results = rounds.map((stat, index) => {
      const playerStat = getStat(poke1, stat);
      const enemyStat = getStat(poke2, stat);
      let winner = "";

      if (playerStat > enemyStat) {
        winner = poke1.name;
        playerWins++;
      } else if (enemyStat > playerStat) {
        winner = poke2.name;
        enemyWins++;
      } else {
        winner = "Draw";
      }

      return {
        round: index + 1,
        stat: stat.toUpperCase(),
        player: { name: poke1.name, value: playerStat },
        enemy: { name: poke2.name, value: enemyStat },
        winner,
      };
    });

    let finalWinner = "";
    if (playerWins > enemyWins) {
      finalWinner = `${poke1.name}, You Win!`;
    } else if (enemyWins > playerWins) {
      finalWinner = `${poke2.name}, You Lose!`;
    } else {
      finalWinner = "It's a Draw!";
    }

    setBattleResults(results);
    setOverallWinner(finalWinner);

    // Save battle to db.json
    try {
      await axios.post("http://localhost:3001/battles", {
        pokemon1: poke1.name,
        pokemon2: poke2.name,
        result: finalWinner,
        date: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving battle:", error);
    }
  };

  // Reset the battle state
  const resetBattle = () => {
    setPoke1(null);
    setPoke2(null);
    setBattleResults([]);
    setOverallWinner("");
    localStorage.removeItem("pokemonBattle");
  };

  const renderCard = (pokemon) => {
    if (!pokemon) return null;
    return (
      <div className="card bg-yellow-200 shadow-md p-2 w-72">
        <figure
          className={`rounded-t-lg ${
            typeColors[pokemon.types[0].type.name] || "bg-gray-300"
          }`}
        >
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
                className={`badge text-white ${
                  typeColors[t.type.name] || "bg-gray-500"
                }`}
              >
                {t.type.name.toUpperCase()}
              </span>
            ))}
          </div>
          <div className="flex gap-1 flex-wrap">
            {pokemon.stats
              .filter(
                (s) =>
                  s.stat.name === "hp" ||
                  s.stat.name === "attack" ||
                  s.stat.name === "speed"
              )
              .map((s) => (
                <p
                  key={s.stat.name}
                  className="badge badge-sm badge-soft font-semibold"
                >
                  {s.stat.name.charAt(0).toUpperCase() + s.stat.name.slice(1)}:{" "}
                  <span className="font-medium">{s.base_stat}</span>
                </p>
              ))}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-bounce text-xl font-bold text-yellow-500">
          Loading Pokémon...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto lg:px-16">
      <h2 className="text-2xl font-bold my-4 text-center">Battle Simulation</h2>

      <div className="grid md:grid-cols-3 place-items-center gap-2">
        {/* Your Team */}
        <div className="space-y-2 text-center">
          <h1 className="text-bold text-xl">Your Team</h1>
          {!poke1 && <img src={Pokelogo} className="w-72" alt="Pokemon Logo" />}
          {renderCard(poke1)}
          <select
            className="select select-bordered border-2 border-yellow-200"
            onChange={(e) =>
              selectPokemonFromDropdown(e.target.value, setPoke1)
            }
            value={poke1?.name || ""}
          >
            <option value="">Select Your Pokémon</option>
            {team.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* VS */}
        <img src={VS} alt="vs logo" className="w-52 md:w-64 lg:w-full my-6" />

        {/* Enemy Team */}
        <div className="space-y-2 text-center">
          <h1 className="text-bold text-xl">Enemy Team</h1>
          {!poke2 && <img src={Pokelogo} className="w-72" alt="Pokemon Logo" />}
          {renderCard(poke2)}
          <div className="flex items-center gap-2 justify-center">
            <select
              className="select select-bordered border-2 border-yellow-200"
              onChange={(e) =>
                selectPokemonFromDropdown(e.target.value, setPoke2)
              }
              value={poke2?.name || ""}
            >
              <option value="">Select Enemy Pokémon</option>
              {allPokemon.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
            <button
              onClick={pickRandomEnemy}
              className="btn bg-yellow-400 hover:bg-yellow-500 text-black border-none"
            >
              Random
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={simulateBattle}
          disabled={!poke1 || !poke2}
          className={`btn btn-lg text-black border-none ${
            !poke1 || !poke2
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-yellow-400 hover:bg-yellow-500"
          }`}
        >
          Fight
        </button>

        {(poke1 || poke2 || battleResults.length > 0) && (
          <button
            onClick={resetBattle}
            className="btn bg-red-500 hover:bg-red-600 text-white btn-lg border-none"
          >
            Reset
          </button>
        )}
      </div>

      {/* Battle Logs */}
      {battleResults.length > 0 && (
        <div className="overflow-x-auto mt-6 border border-yellow-400 rounded-lg shadow-md">
          <table className="table table-zebra w-full">
            <thead className="bg-yellow-400">
              <tr className="text-black">
                <th>Round</th>
                <th>Stat</th>
                <th>Your Pokémon</th>
                <th>Enemy Pokémon</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
              {battleResults.map((round) => (
                <tr key={round.round}>
                  <th>{round.round}</th>
                  <td>{round.stat}</td>
                  <td className="capitalize">
                    {round.player.name} ({round.player.value})
                  </td>
                  <td className="capitalize">
                    {round.enemy.name} ({round.enemy.value})
                  </td>
                  <td
                    className={`capitalize ${
                      round.winner === poke1?.name
                        ? "text-green-600 font-bold"
                        : round.winner === poke2?.name
                        ? "text-red-600 font-bold"
                        : "text-gray-500"
                    }`}
                  >
                    {round.winner}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-lg p-2 font-medium text-center border-t-2 border-yellow-400 bg-yellow-50">
            Winner:{" "}
            <span className="capitalize font-bold">{overallWinner}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Battle;
