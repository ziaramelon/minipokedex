import React, { useEffect, useState } from "react";
import axios from "axios";
import po from "../assets/po.png";
import versus from "../assets/versus.png";
import battleImg from "../assets/battleImg.png";
// Import a lose image - you'll need to create this and place it in your assets folder
import loseImg from "../assets/lose.png"; // Assuming you have a lose.png image

const typeColors = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-custom",
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
  const [loser, setLoser] = useState(null); // Track the losing Pokemon

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
          if (parsedData.loser)
            setLoser(parsedData.loser);
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
        loser,
      };
      localStorage.setItem("pokemonBattle", JSON.stringify(battleState));
    }
  }, [poke1, poke2, battleResults, overallWinner, loser]);

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
    setLoser(null); // Reset loser

    if (playerWins > enemyWins) {
      finalWinner = `${poke1.name}, You Win!`;
      setLoser(poke2.name); // Set enemy as loser
    } else if (enemyWins > playerWins) {
      finalWinner = `${poke2.name}, You Lose!`;
      setLoser(poke1.name); // Set player as loser
    } else {
      finalWinner = "It's a Draw!";
      setLoser(null); // No loser in a draw
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
    setLoser(null);
    localStorage.removeItem("pokemonBattle");
  };

  const getCardBackground = (pokemon) => {
    if (!pokemon || !pokemon.types || pokemon.types.length === 0)
      return "bg-white";
    return typeColors[pokemon.types[0].type.name] || "bg-white";
  };

  const renderCard = (pokemon, isYourTeam = true) => {
    if (!pokemon) return null;
    const figureBg = getCardBackground(pokemon);
    const isLoser = loser === pokemon.name;

    return (
      <div className="relative">
        {/* The card */}
        <div className="card shadow-md p-2 w-72 rounded-3xl bg-white">
          <figure className="rounded-t-3xl flex-col pt-6 bg-white">
            <img
              src={pokemon.sprites.other["official-artwork"].front_default}
              className="w-36 cursor-pointer"
              alt={pokemon.name}
            />
            <div className="w-full px-4 mt-2">
              <hr />
            </div>
          </figure>
          <div className="card-body pt-4 bg-white rounded-b-3xl">
            <div>
              <span className="text-gray-500 font-mono text-lg font-medium">
                #{pokemon.id.toString().padStart(4, "0")}
              </span>
              <h2 className="card-title capitalize font-bold text-2xl">
                {pokemon.name}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {pokemon.types.map((t) => (
                <span
                  key={t.type.name}
                  className={`rounded-full text-white capitalize px-4 py-1 font-medium ${
                    typeColors[t.type.name] || "bg-gray-500"
                  }`}
                >
                  {t.type.name}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {pokemon.stats
                .filter(
                  (s) =>
                    s.stat.name === "hp" ||
                    s.stat.name === "attack" ||
                    s.stat.name === "speed"
                )
                .map((s) => (
                  <div
                    key={s.stat.name}
                    className="rounded-lg bg-gray-100 p-2 text-center"
                  >
                    <p className="font-semibold capitalize text-sm text-gray-700">
                      {s.stat.name}
                    </p>
                    <p className="font-bold text-lg">{s.base_stat}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
        
        {/* The LOSE overlay - only show if this pokemon is the loser */}
        {isLoser && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
            <img 
              src={loseImg} 
              alt="LOSE" 
              className="w-full transform rotate-[-20deg] z-10"
              style={{ 
                maxWidth: "120%", 
                marginLeft: "-10%", 
                marginTop: "-5%"
              }}
            />
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-bounce text-xl font-bold text-pix text-red-500 flex flex-col justify-center">
          <div className="mx-auto">
            <img src={po} alt="" className="w-12" />
          </div>
          <p>LOADING BATTLE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto lg:px-16 pb-12">
      <h2 className="text-4xl md:text-5xl font-bold mb-10 text-center font-serif mt-8 text-gray-800">
        <span className="text-yellow-500">Pokémon</span> Battle Arena
      </h2>

      <div className="grid md:grid-cols-3 place-items-center gap-6">
        {/* Your Team */}
        <div className="space-y-6 text-center">
          <h1 className="text-bold text-2xl bg-blue-500 text-white py-2 px-6 rounded-full inline-block">
            Your Team
          </h1>
          {!poke1 && (
            <div className="bg-gray-100 rounded-3xl p-6 shadow-md">
              <img
                src={battleImg}
                className="w-72 mx-auto"
                alt="Pokemon Logo"
              />
            </div>
          )}
          {renderCard(poke1, true)}
          <select
            className="select bg-white border-2 border-gray-300 rounded-full py-2 px-4 w-full max-w-xs focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
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
        <div className="flex justify-center items-center">
          <img
            src={versus}
            alt="vs logo"
            className="w-36 max-w-xs transform hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Enemy Team */}
        <div className="space-y-6 text-center">
          <h1 className="text-bold text-2xl bg-red-500 text-white py-2 px-6 rounded-full inline-block">
            Enemy Team
          </h1>
          {!poke2 && (
            <div className="bg-gray-100 rounded-3xl p-6 shadow-md">
              <img
                src={battleImg}
                className="w-72 mx-auto"
                alt="Pokemon Logo"
              />
            </div>
          )}
          {renderCard(poke2, false)}
          <div className="flex items-center gap-2 justify-center">
            <select
              className="select bg-white border-2 border-gray-300 rounded-full py-2 px-4 w-full max-w-xs focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
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
              className="btn bg-custom hover:bg-teal-800 text-w border-none rounded-full px-4"
            >
              Random
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6 mt-10">
        <button
          onClick={simulateBattle}
          disabled={!poke1 || !poke2}
          className={`px-8 py-4 text-xl font-bold rounded-full shadow-lg transform transition-transform duration-200 hover:scale-105 ${
            !poke1 || !poke2
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-custom hover:bg-teal-800 text-w"
          }`}
        >
          BATTLE!
        </button>

        {(poke1 || poke2 || battleResults.length > 0) && (
          <button
            onClick={resetBattle}
            className="px-8 py-4 text-xl font-bold rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transform transition-transform duration-200 hover:scale-105"
          >
            Reset
          </button>
        )}
      </div>

      {/* Battle Logs */}
      {battleResults.length > 0 && (
        <div className="mt-12 border-4 border-custom rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-custom py-3 px-4 text-black font-bold text-xl text-center">
            Battle Results
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-100">
                <tr className="text-black">
                  <th className="py-4 text-center">Round</th>
                  <th className="py-4 text-center">Stat</th>
                  <th className="py-4 text-center">Your Pokémon</th>
                  <th className="py-4 text-center">Enemy Pokémon</th>
                  <th className="py-4 text-center">Winner</th>
                </tr>
              </thead>
              <tbody>
                {battleResults.map((round) => (
                  <tr key={round.round} className="hover:bg-gray-50 border-b">
                    <td className="py-3 text-center font-bold">
                      {round.round}
                    </td>
                    <td className="py-3 text-center font-medium bg-gray-100">
                      {round.stat}
                    </td>
                    <td className="py-3 text-center capitalize">
                      <span className="font-semibold">{round.player.name}</span>
                      <br />
                      <span className="badge bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full">
                        {round.player.value}
                      </span>
                    </td>
                    <td className="py-3 text-center capitalize">
                      <span className="font-semibold">{round.enemy.name}</span>
                      <br />
                      <span className="badge bg-red-100 text-red-800 font-bold px-3 py-1 rounded-full">
                        {round.enemy.value}
                      </span>
                    </td>
                    <td
                      className={`py-3 text-center capitalize font-bold ${
                        round.winner === poke1?.name
                          ? "text-green-600"
                          : round.winner === poke2?.name
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {round.winner}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-2xl p-4 font-bold text-center border-t-4 border-custom bg-w">
            Winner:{" "}
            <span className="capitalize text-yellow-600">{overallWinner}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Battle;