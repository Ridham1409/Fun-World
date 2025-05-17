
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { Menu } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-game-primary text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Fun Games Hub</Link>
        
        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className="text-white px-3 py-2 hover:text-game-light transition">
                Home
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/rock-paper-scissors" className="text-white px-3 py-2 hover:text-game-light transition">
                Rock Paper Scissors
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/dice-roller" className="text-white px-3 py-2 hover:text-game-light transition">
                Dice Roller
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/memory-game" className="text-white px-3 py-2 hover:text-game-light transition">
                Memory Game
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/tic-tac-toe" className="text-white px-3 py-2 hover:text-game-light transition">
                Tic Tac Toe
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="p-2 focus:outline-none" onClick={toggleMenu} aria-label="Toggle menu">
            <Menu size={24} />
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-game-primary border-t border-game-secondary">
          <div className="container mx-auto py-2">
            <Link to="/" className="block px-4 py-2 hover:bg-game-secondary transition" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/rock-paper-scissors" className="block px-4 py-2 hover:bg-game-secondary transition" onClick={toggleMenu}>
              Rock Paper Scissors
            </Link>
            <Link to="/dice-roller" className="block px-4 py-2 hover:bg-game-secondary transition" onClick={toggleMenu}>
              Dice Roller
            </Link>
            <Link to="/memory-game" className="block px-4 py-2 hover:bg-game-secondary transition" onClick={toggleMenu}>
              Memory Game
            </Link>
            <Link to="/tic-tac-toe" className="block px-4 py-2 hover:bg-game-secondary transition" onClick={toggleMenu}>
              Tic Tac Toe
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
