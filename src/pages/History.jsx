import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const History = () => {
  const [battles, setBattles] = useState([]);

  const fetchBattleHistory = async () => {
    try {
      const response = await axios.get("http://localhost:3001/battles");
      const sortedBattles = response.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setBattles(sortedBattles);
    } catch (error) {
      console.error("Error fetching battle history:", error);
    }
  };

  useEffect(() => {
    fetchBattleHistory();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Battle History</h2>

      <button
        onClick={fetchBattleHistory}
        className="btn btn-sm mb-4 bg-yellow-400 hover:bg-yellow-500 text-black border-none"
      >
        Refresh History
      </button>

      {battles.length === 0 ? (
        <p>No battles recorded yet.</p>
      ) : (
        <div className="space-y-4">
          {battles.map((battle) => (
            <div
              key={battle.id}
              className="bg-base-200 p-4 rounded-lg shadow border border-base-300"
            >
              <div className="text-lg font-semibold">
                {battle.pokemon1} vs {battle.pokemon2}
              </div>
              <div className="text-sm text-base-content/70">
                Result:{" "}
                <span className="font-medium text-primary">
                  {battle.result}
                </span>
              </div>
              <div className="text-sm text-base-content/60">
                Date: {dayjs(battle.date).format("MMM D, YYYY h:mm A")}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
