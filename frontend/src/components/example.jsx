import React from "react";

function MonComponent() {
  // 1. Variables / state
  const message = "Bonjour";

  // 2. Fonctions
  const handleClick = () => {
    console.log("Clique !");
  };

  // 3. Rendu (ce que tu affiches)
  return (
    <div>
      <h1>{message}</h1>
      <button onClick={handleClick}>Clique moi</button>
    </div>
  );
}

export default MonComponent;