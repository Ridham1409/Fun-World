
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const MemoryGame = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [timer, setTimer] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);
  const { toast } = useToast();

  const emojis = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
    '🐧', '🦆', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄'
  ];

  // Initialize the game
  const initializeGame = () => {
    let pairs: number;
    
    // Set pairs based on difficulty
    switch(difficulty) {
      case 'easy':
        pairs = 6;
        break;
      case 'medium':
        pairs = 10;
        break;
      case 'hard':
        pairs = 12;
        break;
      default:
        pairs = 6;
    }
    
    // Select random emojis for the pairs
    const selectedEmojis = [...emojis]
      .sort(() => 0.5 - Math.random())
      .slice(0, pairs);
    
    // Create pairs of cards
    const newCards: Card[] = [...selectedEmojis, ...selectedEmojis]
      .sort(() => 0.5 - Math.random())
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
    
    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setGameOver(false);
    setTimer(0);
    
    // Start timer
    if (timerInterval) clearInterval(timerInterval);
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
    
    setGameStarted(true);
  };

  // Handle card click
  const handleCardClick = (id: number) => {
    // Ignore click if:
    // - the card is already flipped or matched
    // - two cards are already flipped and not yet processed
    // - the game is over
    if (
      cards[id].isFlipped || 
      cards[id].isMatched || 
      flippedCards.length >= 2 ||
      gameOver
    ) {
      return;
    }
    
    // Flip the card
    const updatedCards = [...cards];
    updatedCards[id].isFlipped = true;
    setCards(updatedCards);
    
    // Add to flipped cards
    const updatedFlippedCards = [...flippedCards, id];
    setFlippedCards(updatedFlippedCards);
    
    // If two cards are flipped, check for a match
    if (updatedFlippedCards.length === 2) {
      const [firstId, secondId] = updatedFlippedCards;
      setMoves(prev => prev + 1);
      
      if (cards[firstId].emoji === cards[secondId].emoji) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstId].isMatched = true;
          matchedCards[secondId].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          
          // Check if all cards are matched
          if (matchedCards.every(card => card.isMatched)) {
            endGame();
          }
          
          // Show toast for match
          toast({
            title: "Match!",
            description: `You found a pair of ${cards[firstId].emoji}`,
            duration: 1500,
          });
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstId].isFlipped = false;
          resetCards[secondId].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // End game
  const endGame = () => {
    setGameOver(true);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    // Calculate score based on moves and time
    const score = calculateScore();
    
    toast({
      title: "Game Complete!",
      description: `You finished in ${formatTime(timer)} with ${moves} moves!`,
      variant: "default",
    });
  };

  // Calculate score
  const calculateScore = (): number => {
    const baseScore = 1000;
    const maxTime = difficulty === 'easy' ? 60 : difficulty === 'medium' ? 120 : 180;
    const maxMoves = cards.length;
    
    // Penalties for time and moves
    const timePenalty = Math.min(timer / maxTime, 1) * 500;
    const movesPenalty = Math.min(moves / maxMoves, 1) * 500;
    
    return Math.round(baseScore - timePenalty - movesPenalty);
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    setDifficulty(value as Difficulty);
  };

  // Reset game
  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setCards([]);
    setFlippedCards([]);
    setMoves(0);
    setTimer(0);
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  // Get grid size based on difficulty
  const getGridSizeClass = (): string => {
    switch(difficulty) {
      case 'easy': return 'grid-cols-3 sm:grid-cols-4';
      case 'medium': return 'grid-cols-4 sm:grid-cols-5';
      case 'hard': return 'grid-cols-4 sm:grid-cols-6';
      default: return 'grid-cols-3 sm:grid-cols-4';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Memory Matching Game</h1>
        
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Controls */}
          <div className="bg-game-primary text-white p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {!gameStarted ? (
                <div className="flex items-center gap-4 w-full justify-between">
                  <div className="w-32">
                    <Select
                      onValueChange={handleDifficultyChange}
                      defaultValue="easy"
                    >
                      <SelectTrigger id="difficulty">
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={initializeGame} 
                    size="lg"
                    className="bg-white text-game-primary hover:bg-gray-100 hover:text-game-secondary"
                  >
                    Start Game
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between w-full">
                  <div className="flex gap-8">
                    <div>
                      <div className="text-xs opacity-75">MOVES</div>
                      <div className="text-lg font-bold">{moves}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs opacity-75">TIME</div>
                      <div className="text-lg font-bold">{formatTime(timer)}</div>
                    </div>
                  </div>
                  
                  {gameOver ? (
                    <Button 
                      onClick={resetGame} 
                      className="bg-white text-game-primary hover:bg-gray-100 hover:text-game-secondary"
                    >
                      Play Again
                    </Button>
                  ) : (
                    <Button 
                      onClick={resetGame} 
                      variant="outline" 
                      className="border-white text-white hover:bg-white hover:text-game-primary"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Game Board */}
          {gameStarted && (
            <div className="p-4">
              <div className={`grid ${getGridSizeClass()} gap-2 md:gap-4`}>
                {cards.map(card => (
                  <div
                    key={card.id}
                    className={`aspect-square memory-card ${card.isFlipped ? 'flipped' : ''}`}
                    onClick={() => handleCardClick(card.id)}
                  >
                    <div className="memory-card-inner">
                      <div className="memory-card-front flex items-center justify-center bg-gradient-to-br from-game-primary to-game-tertiary text-white text-2xl rounded-lg">
                        ?
                      </div>
                      <div className="memory-card-back flex items-center justify-center bg-white border-2 border-game-light text-5xl rounded-lg">
                        {card.emoji}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Game Over Message */}
              {gameOver && (
                <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg text-center">
                  <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
                  <p>You completed the game in {formatTime(timer)} with {moves} moves.</p>
                  <p className="font-semibold mt-2">Score: {calculateScore()}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Empty State */}
          {!gameStarted && !gameOver && (
            <div className="p-8 text-center">
              <div className="text-8xl mb-4">🧠</div>
              <h3 className="text-2xl font-semibold mb-2">Memory Challenge</h3>
              <p className="text-gray-600 mb-6">Test your memory by matching pairs of cards. Select a difficulty level to start!</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
                <div className="p-4 border rounded-lg text-center">
                  <div className="font-bold">Easy</div>
                  <div className="text-sm text-gray-500">12 cards</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="font-bold">Medium</div>
                  <div className="text-sm text-gray-500">20 cards</div>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <div className="font-bold">Hard</div>
                  <div className="text-sm text-gray-500">24 cards</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Instructions */}
        <div className="max-w-4xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Choose a difficulty level</li>
            <li>Click on cards to flip them over</li>
            <li>Remember the location of each emoji</li>
            <li>Match pairs of identical emojis</li>
            <li>The game ends when all pairs are matched</li>
            <li>Try to complete the game with fewer moves and in less time for a higher score</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MemoryGame;
