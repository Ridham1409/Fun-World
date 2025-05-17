
import React from 'react';
import { Link } from 'react-router-dom';

interface GameCardProps {
  title: string;
  description: string;
  imageSrc: string;
  path: string;
}

const GameCard: React.FC<GameCardProps> = ({ title, description, imageSrc, path }) => {
  return (
    <div className="game-card">
      <div className="relative">
        <img src={imageSrc} alt={title} className="game-card-image" />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <Link to={path} className="game-button">
            Play Now
          </Link>
        </div>
      </div>
      <div className="game-card-body">
        <h3 className="game-card-title">{title}</h3>
        <p className="game-card-desc">{description}</p>
        <Link to={path} className="text-game-primary hover:text-game-secondary font-medium">
          Play Now →
        </Link>
      </div>
    </div>
  );
};

export default GameCard;
