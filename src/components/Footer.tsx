
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-game-dark text-white p-6 mt-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Fun Games Hub</h3>
            <p className="text-sm opacity-75 mt-1">© 2025 All rights reserved</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-game-primary transition">Privacy</a>
            <a href="#" className="hover:text-game-primary transition">Terms</a>
            <a href="#" className="hover:text-game-primary transition">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
