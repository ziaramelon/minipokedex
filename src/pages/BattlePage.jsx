import React from "react";
import Battle from "../components/Battle";
import BattleHistory from "../components/BattleHistory";

const BattlePage = () => {
  return (
    <div className="p-4">
      <Battle />
      <hr className="my-8" />
      <BattleHistory />
    </div>
  );
};

export default BattlePage;
