import Header from "../components/Header";
import React from "react";
import Team from "../components/Team";

const TeamPage = () => {
  return (
    <>
      <Header />
      <div className="p-4">
        <Team />
      </div>
    </>
  );
};

export default TeamPage;
