
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-game-primary text-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Fun Games Hub</Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-game-light transition">Home</Link>
          <Link to="/rock-paper-scissors" className="hover:text-game-light transition">Rock Paper Scissors</Link>
          <Link to="/number-guess" className="hover:text-game-light transition">Number Guess</Link>
          <Link to="/dice-roller" className="hover:text-game-light transition">Dice Roller</Link>
          <Link to="/memory-game" className="hover:text-game-light transition">Memory Game</Link>
        </nav>
        <div className="md:hidden">
          <button className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
