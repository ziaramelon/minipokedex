import Header from "../components/Header";
import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const History = () => {
  const [battles, setBattles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBattleHistory = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/battles");
      const sortedBattles = response.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setBattles(sortedBattles);
    } catch (error) {
      console.error("Error fetching battle history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBattleHistory();
  }, []);

  // Extract winner from result string
  const extractWinner = (result) => {
    if (!result) return "";
    const parts = result.split(",");
    return parts[0];
  };

  // Determine if the player won or lost
  const getResultStatus = (result) => {
    if (!result) return "draw";
    if (result.toLowerCase().includes("you win")) return "win";
    if (result.toLowerCase().includes("you lose")) return "lose";
    return "draw";
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-yellow-500 font-serif">
            Battle History
          </h2>
          <button
            onClick={fetchBattleHistory}
            className="bg-custom hover:bg-teal-800 text-w cursor-pointer font-bold py-2 px-6 rounded-full shadow-md transform transition-transform duration-200 hover:scale-105"
          >
            Refresh
          </button>
        </div>
        {/* Battle Count Summary */}
        {battles.length > 0 && (
          <div className="mb-8 bg-yellow-50 p-6 rounded-3xl shadow-md border-2 border-yellow-100">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Battle Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl shadow text-center">
                <p className="text-gray-600 font-medium">Total Battles</p>
                <p className="text-4xl font-bold text-yellow-500">
                  {battles.length}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow text-center">
                <p className="text-gray-600 font-medium">Victories</p>
                <p className="text-4xl font-bold text-green-500">
                  {
                    battles.filter((b) =>
                      b.result.toLowerCase().includes("you win")
                    ).length
                  }
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow text-center">
                <p className="text-gray-600 font-medium">Defeats</p>
                <p className="text-4xl font-bold text-red-500">
                  {
                    battles.filter((b) =>
                      b.result.toLowerCase().includes("you lose")
                    ).length
                  }
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow text-center">
                <p className="text-gray-600 font-medium">Draw</p>
                <p className="text-4xl font-bold text-black">
                  {
                    battles.filter((b) =>
                      b.result.toLowerCase().includes("draw")
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-bounce text-xl font-bold text-yellow-500">
              Loading Battle History...
            </div>
          </div>
        ) : battles.length === 0 ? (
          <div className="bg-gray-100 p-10 rounded-3xl shadow-md text-center">
            <p className="text-xl text-gray-600">No battles recorded yet.</p>
            <p className="mt-2 text-gray-500">
              Head to the Battle Arena to start your Pokémon journey!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {battles.map((battle) => {
              const resultStatus = getResultStatus(battle.result);
              const winner = extractWinner(battle.result);

              return (
                <div
                  key={battle.id}
                  className="bg-white p-6 rounded-3xl shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Battle Title */}
                    <div className="flex items-center">
                      <div className="bg-blue-500 text-white font-bold py-2 px-4 rounded-l-full capitalize">
                        {battle.pokemon1}
                      </div>
                      <div className="bg-yellow-400 text-black font-bold py-2 px-3">
                        VS
                      </div>
                      <div className="bg-red-500 text-white font-bold py-2 px-4 rounded-r-full capitalize">
                        {battle.pokemon2}
                      </div>
                    </div>

                    {/* Result */}
                    <div
                      className={`
                      text-lg font-bold rounded-full py-2 px-6 
                      ${
                        resultStatus === "win"
                          ? "bg-green-100 text-green-800"
                          : resultStatus === "lose"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    `}
                    >
                      Winner: <span className="capitalize">{winner}</span>
                    </div>

                    {/* Date */}
                    <div className="bg-gray-100 text-gray-700 rounded-full py-2 px-4 text-sm font-medium">
                      {dayjs(battle.date).format("MMM D, YYYY h:mm A")}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default History;
