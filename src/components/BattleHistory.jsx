import React, { useEffect, useState } from "react";
import axios from "axios";

const BattleHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/battles?_sort=date&_order=desc")
      .then((res) => setHistory(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Battle History</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Pokémon 1</th>
              <th>Pokémon 2</th>
              <th>Winner</th>
            </tr>
          </thead>
          <tbody>
            {history.map((b, i) => (
              <tr key={i}>
                <td>{new Date(b.date).toLocaleString()}</td>
                <td className="capitalize">{b.pokemon1}</td>
                <td className="capitalize">{b.pokemon2}</td>
                <td className="capitalize font-bold">{b.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BattleHistory;
