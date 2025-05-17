
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GameCard from '../components/GameCard';

const Index = () => {
  // Game data for our cards
  const games = [
    {
      id: 1,
      title: 'Rock Paper Scissors',
      description: 'Play the classic game of chance against the computer. Can you outsmart the AI?',
      imageSrc: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&q=80',
      path: '/rock-paper-scissors',
    },
    {
      id: 2,
      title: 'Number Guessing',
      description: 'Guess the secret number within a limited number of tries. Get hints along the way!',
      imageSrc: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
      path: '/number-guess',
    },
    {
      id: 3,
      title: 'Dice Roller',
      description: 'Roll virtual dice with beautiful animations. Perfect for board games!',
      imageSrc: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80',
      path: '/dice-roller',
    },
    {
      id: 4,
      title: 'Memory Game',
      description: 'Test your memory by matching pairs of cards in this classic concentration game.',
      imageSrc: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80',
      path: '/memory-game',
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-purple-100">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-game-primary text-white py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80')] bg-no-repeat bg-cover"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">Welcome to Fun Games Hub</h1>
              <p className="text-xl mb-8 opacity-90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Explore our collection of interactive games designed to challenge your skills and provide hours of entertainment!
              </p>
              <a href="#games" className="game-button inline-block animate-fade-in" style={{ animationDelay: '0.4s' }}>
                Explore Games
              </a>
            </div>
          </div>
        </section>
        
        {/* Games Section */}
        <section id="games" className="game-section py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  title={game.title}
                  description={game.description}
                  imageSrc={game.imageSrc}
                  path={game.path}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* How to Play */}
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">How to Play</h2>
            <div className="max-w-3xl mx-auto">
              <div className="mb-6 p-6 bg-purple-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">1. Choose a Game</h3>
                <p>Browse our collection and select any game that interests you from the games above.</p>
              </div>
              <div className="mb-6 p-6 bg-purple-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">2. Learn the Rules</h3>
                <p>Each game has simple instructions that will guide you through how to play.</p>
              </div>
              <div className="mb-6 p-6 bg-purple-50 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">3. Have Fun!</h3>
                <p>Challenge yourself or play against the computer. Try to beat your high score!</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
