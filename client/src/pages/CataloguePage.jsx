import React from 'react';
import GameCardCategory from '../components/GameCardCategory';

function CataloguePage() {
  const genres = ["FPS","aventure"] // test

  return (
    <div>
      <h1>Catalogue</h1>
      <p>Bienvenue dans la section Catalogue.</p>    
      <GameCardCategory  image="/logo.png"  title="CyberPunk" note={4.5} tags={genres} />
    </div>
  );
}

export default CataloguePage;
