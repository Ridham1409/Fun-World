
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
    <div className="game-card hover:translate-y-[-5px] transition-all duration-300">
      <div className="relative overflow-hidden rounded-t-lg">
        <img src={imageSrc} alt={title} className="game-card-image w-full h-48 object-cover transition-transform duration-500 hover:scale-110" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <Link to={path} className="game-button transform hover:scale-105 transition-transform duration-300">
            Play Now
          </Link>
        </div>
      </div>
      <div className="game-card-body p-6 bg-white rounded-b-lg">
        <h3 className="game-card-title text-xl font-bold mb-2 text-game-primary">{title}</h3>
        <p className="game-card-desc text-gray-600 mb-4">{description}</p>
        <Link to={path} className="text-game-primary hover:text-game-secondary font-medium flex items-center">
          Play Now
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default GameCard;
