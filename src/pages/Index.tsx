
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GameCard from '../components/GameCard';
import InteractiveBanner from '../components/InteractiveBanner';

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
      title: 'Dice Roller',
      description: 'Roll virtual dice with beautiful animations. Perfect for board games!',
      imageSrc: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80',
      path: '/dice-roller',
    },
    {
      id: 3,
      title: 'Memory Game',
      description: 'Test your memory by matching pairs of cards in this classic concentration game.',
      imageSrc: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&q=80',
      path: '/memory-game',
    },
    {
      id: 4,
      title: 'Tic Tac Toe',
      description: 'The classic game of Xs and Os. Challenge a friend or play against yourself.',
      imageSrc: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&q=80',
      path: '/tic-tac-toe',
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-purple-100">
      <Header />
      
      <main className="flex-grow">
        {/* Interactive Banner Section */}
        <InteractiveBanner />
        
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
