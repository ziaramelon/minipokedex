import Header from "../components/Header";
import React from "react";
import Battle from "../components/Battle";

const BattlePage = () => {
  return (
    <>
      <Header />
      <div className="p-4">
        <Battle />
      </div>
    </>
  );
};

export default BattlePage;
