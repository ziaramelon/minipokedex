import React, { useEffect, useState } from "react";
import axios from "axios";

const Team = () => {
  const [team, setTeam] = useState([]);

  const fetchTeam = () => {
    axios.get("http://localhost:3001/team").then((res) => setTeam(res.data));
  };

  const removeFromTeam = (id) => {
    axios.delete(`http://localhost:3001/team/${id}`).then(fetchTeam);
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Pokémon Team</h2>
      {team.length === 0 ? (
        <p>Your team is empty.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {team.map((pokemon) => (
            <div key={pokemon.id} className="card bg-base-200 shadow">
              <figure>
                <img src={pokemon.image} alt={pokemon.name} />
              </figure>
              <div className="card-body">
                <h2 className="card-title capitalize">{pokemon.name}</h2>
                <ul className="text-sm">
                  {pokemon.stats.map((stat) => (
                    <li key={stat.name}>
                      {stat.name}: {stat.base}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => removeFromTeam(pokemon.id)}
                  className="btn btn-error btn-sm mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Team;
