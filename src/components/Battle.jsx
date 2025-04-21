import React, { useEffect, useState } from "react";
import axios from "axios";

const Battle = () => {
  const [team, setTeam] = useState([]);
  const [poke1, setPoke1] = useState(null);
  const [poke2, setPoke2] = useState(null);
  const [winner, setWinner] = useState("");
  const [mode, setMode] = useState("stats"); // 'stats' or 'damage'

  useEffect(() => {
    axios.get("http://localhost:3001/team").then((res) => setTeam(res.data));
  }, []);

  const simulateStatsBattle = () => {
    if (!poke1 || !poke2) return;

    let score1 = 0,
      score2 = 0;
    const statsToCompare = ["hp", "attack", "speed"];

    statsToCompare.forEach((stat) => {
      const p1 = poke1.stats.find((s) => s.name === stat)?.base || 0;
      const p2 = poke2.stats.find((s) => s.name === stat)?.base || 0;
      if (p1 > p2) score1++;
      else if (p2 > p1) score2++;
    });

    const result =
      score1 > score2 ? poke1.name : score2 > score1 ? poke2.name : "Draw";
    setWinner(result);

    saveBattle(result);
  };

  const simulateDamageBattle = () => {
    if (!poke1 || !poke2) return;

    let attacker =
      poke1.stats.find((s) => s.name === "speed").base >
      poke2.stats.find((s) => s.name === "speed").base
        ? poke1
        : poke2;
    let defender = attacker === poke1 ? poke2 : poke1;

    let hp1 = poke1.stats.find((s) => s.name === "hp").base;
    let hp2 = poke2.stats.find((s) => s.name === "hp").base;

    const getAttack = (poke) =>
      poke.stats.find((s) => s.name === "attack").base;

    while (hp1 > 0 && hp2 > 0) {
      let dmg = getAttack(attacker);
      if (defender === poke1) hp1 -= dmg;
      else hp2 -= dmg;

      [attacker, defender] = [defender, attacker]; // swap turns
    }

    const result =
      hp1 <= 0 && hp2 <= 0 ? "Draw" : hp1 <= 0 ? poke2.name : poke1.name;
    setWinner(result);

    saveBattle(result);
  };

  const saveBattle = (result) => {
    axios.post("http://localhost:3001/battles", {
      pokemon1: poke1.name,
      pokemon2: poke2.name,
      result,
      date: new Date().toISOString(),
    });
  };

  const startBattle = () => {
    if (poke1 && poke2) {
      mode === "stats" ? simulateStatsBattle() : simulateDamageBattle();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Battle</h2>

      <div className="flex gap-4 items-center flex-wrap">
        <select
          className="select select-bordered"
          onChange={(e) =>
            setPoke1(team.find((p) => p.name === e.target.value))
          }
        >
          <option>Select Pokémon 1</option>
          {team.map((p) => (
            <option key={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          className="select select-bordered"
          onChange={(e) =>
            setPoke2(team.find((p) => p.name === e.target.value))
          }
        >
          <option>Select Pokémon 2</option>
          {team.map((p) => (
            <option key={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          className="select select-bordered"
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="stats">Stats Battle</option>
          <option value="damage">Damage Battle</option>
        </select>

        <button onClick={startBattle} className="btn btn-primary">
          Fight!
        </button>
      </div>

      {winner && (
        <div className="mt-4 text-xl font-semibold">Winner: {winner}</div>
      )}
    </div>
  );
};

export default Battle;
