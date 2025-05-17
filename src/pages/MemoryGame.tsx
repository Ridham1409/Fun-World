
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import { Clock, RotateCw, Star } from 'lucide-react';

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
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    const saved = localStorage.getItem('memoryGameBestScore');
    return saved ? JSON.parse(saved) : 0;
  });
  const { toast } = useToast();

  const emojis = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
    '🐧', '🦆', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄'
  ];

  // Initialize the game
  const initializeGame = useCallback(() => {
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
    setScore(0);
    setGameOver(false);
    setTimer(0);
    
    // Start timer
    if (timerInterval) clearInterval(timerInterval);
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
    
    setGameStarted(true);
  }, [difficulty, emojis, timerInterval]);

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
    
    // Play flip sound
    const flipSound = new Audio('/card-flip.mp3');
    flipSound.volume = 0.3;
    flipSound.play().catch(e => console.log('Audio play error:', e));
    
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
          // Play match sound
          const matchSound = new Audio('/match-sound.mp3');
          matchSound.volume = 0.5;
          matchSound.play().catch(e => console.log('Audio play error:', e));
          
          const matchedCards = [...cards];
          matchedCards[firstId].isMatched = true;
          matchedCards[secondId].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          
          // Update score - more points for fewer moves
          const matchPoints = difficulty === 'easy' ? 50 : difficulty === 'medium' ? 75 : 100;
          setScore(prev => prev + matchPoints);
          
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
          // Play fail sound
          const failSound = new Audio('/fail-sound.mp3');
          failSound.volume = 0.3;
          failSound.play().catch(e => console.log('Audio play error:', e));
          
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
    
    // Calculate final score
    const finalScore = calculateScore();
    setScore(finalScore);
    
    // Check if this is a new best score
    if (finalScore > bestScore) {
      setBestScore(finalScore);
      localStorage.setItem('memoryGameBestScore', JSON.stringify(finalScore));
      
      // Play victory sound
      const victorySound = new Audio('/victory.mp3');
      victorySound.volume = 0.5;
      victorySound.play().catch(e => console.log('Audio play error:', e));
      
      toast({
        title: "New Best Score!",
        description: `Congratulations! You've set a new record: ${finalScore} points!`,
        variant: "default",
      });
    } else {
      // Play complete sound
      const completeSound = new Audio('/game-complete.mp3');
      completeSound.volume = 0.5;
      completeSound.play().catch(e => console.log('Audio play error:', e));
      
      toast({
        title: "Game Complete!",
        description: `You finished in ${formatTime(timer)} with ${moves} moves!`,
        variant: "default",
      });
    }
  };

  // Calculate score
  const calculateScore = (): number => {
    const baseScore = 1000;
    const maxTime = difficulty === 'easy' ? 60 : difficulty === 'medium' ? 120 : 180;
    const maxMoves = cards.length;
    
    // Penalties for time and moves
    const timePenalty = Math.min(timer / maxTime, 1) * 500;
    const movesPenalty = Math.min(moves / maxMoves, 1) * 500;
    
    // Bonus for difficulty
    const difficultyBonus = difficulty === 'easy' ? 0 : difficulty === 'medium' ? 300 : 600;
    
    return Math.round(baseScore - timePenalty - movesPenalty + difficultyBonus);
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

  // Card animations
  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    exit: { scale: 0.8, opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-game-light/10 to-game-primary/10">
      <Header />
      <BackgroundAnimation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-center mb-8 text-game-primary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Memory Matching Game
        </motion.h1>
        
        <motion.div 
          className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Controls */}
          <div className="bg-gradient-to-r from-game-primary to-game-secondary text-white p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {!gameStarted ? (
                <div className="flex items-center gap-4 w-full justify-between">
                  <div className="w-32">
                    <Select
                      onValueChange={handleDifficultyChange}
                      defaultValue="easy"
                    >
                      <SelectTrigger id="difficulty" className="bg-white/20 border-white/30 text-white">
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
                    className="bg-white text-game-primary hover:bg-gray-100 hover:text-game-secondary hover:scale-105 transition-all duration-300"
                  >
                    Start Game
                  </Button>
                </div>
              ) : (
                <div className="flex justify-between w-full">
                  <div className="flex gap-3 sm:gap-8">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-300" />
                      <div>
                        <div className="text-xs opacity-75">SCORE</div>
                        <div className="text-lg font-bold">{score}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <RotateCw className="h-4 w-4 text-yellow-300" />
                      <div>
                        <div className="text-xs opacity-75">MOVES</div>
                        <div className="text-lg font-bold">{moves}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-yellow-300" />
                      <div>
                        <div className="text-xs opacity-75">TIME</div>
                        <div className="text-lg font-bold">{formatTime(timer)}</div>
                      </div>
                    </div>
                  </div>
                  
                  {gameOver ? (
                    <Button 
                      onClick={resetGame} 
                      className="bg-white text-game-primary hover:bg-gray-100 hover:text-game-secondary hover:scale-105 transition-all duration-300"
                    >
                      Play Again
                    </Button>
                  ) : (
                    <Button 
                      onClick={resetGame} 
                      variant="outline" 
                      className="border-white text-white hover:bg-white hover:text-game-primary hover:scale-105 transition-all duration-300"
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
                <AnimatePresence>
                  {cards.map((card, index) => (
                    <motion.div
                      key={card.id}
                      className={`aspect-square memory-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                      onClick={() => handleCardClick(card.id)}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
                      whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
                    >
                      <div className="memory-card-inner">
                        <div className="memory-card-front flex items-center justify-center bg-gradient-to-br from-game-primary to-game-tertiary text-white text-2xl rounded-lg shadow-md">
                          ?
                        </div>
                        <div className={`memory-card-back flex items-center justify-center ${card.isMatched ? 'bg-green-100 border-green-300' : 'bg-white border-game-light'} border-2 text-5xl rounded-lg shadow-md`}>
                          {card.emoji}
                          {card.isMatched && (
                            <motion.div 
                              className="absolute inset-0 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <motion.div 
                                className="text-green-600 text-4xl"
                                initial={{ rotate: 0, scale: 0 }}
                                animate={{ rotate: 360, scale: 1 }}
                                transition={{ duration: 0.5 }}
                              >
                                ✓
                              </motion.div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {/* Game Over Message */}
              {gameOver && (
                <motion.div 
                  className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg text-center shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.h3 
                    className="text-xl font-bold mb-2 text-game-primary"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
                  >
                    Congratulations!
                  </motion.h3>
                  <p>You completed the game in {formatTime(timer)} with {moves} moves.</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
                    <motion.div 
                      className="px-6 py-3 bg-gradient-to-r from-game-primary to-game-secondary rounded-full text-white font-semibold shadow-md flex items-center gap-2"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Star className="h-5 w-5" />
                      <span>Score: {score}</span>
                    </motion.div>
                    {bestScore > 0 && (
                      <motion.div 
                        className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full text-white font-semibold shadow-md flex items-center gap-2"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Star className="h-5 w-5" />
                        <span>Best Score: {bestScore}</span>
                      </motion.div>
                    )}
                  </div>
                  <motion.div 
                    className="mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <Button 
                      onClick={initializeGame} 
                      className="bg-game-primary hover:bg-game-secondary text-white mr-2 hover:scale-105 transition-all duration-300"
                    >
                      Play Again
                    </Button>
                    <Button 
                      onClick={resetGame} 
                      variant="outline" 
                      className="border-game-primary text-game-primary hover:bg-game-primary hover:text-white hover:scale-105 transition-all duration-300"
                    >
                      Change Difficulty
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          )}
          
          {/* Empty State */}
          {!gameStarted && !gameOver && (
            <motion.div 
              className="p-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="text-8xl mb-4"
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
              >
                🧠
              </motion.div>
              <motion.h3 
                className="text-2xl font-semibold mb-2 text-game-primary"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Memory Challenge
              </motion.h3>
              <motion.p 
                className="text-gray-600 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Test your memory by matching pairs of cards. Select a difficulty level to start!
              </motion.p>
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <motion.div 
                  className="p-4 border rounded-lg text-center bg-gradient-to-br from-white to-blue-50 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => {
                    setDifficulty('easy');
                    initializeGame();
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="font-bold text-game-primary">Easy</div>
                  <div className="text-sm text-gray-500">12 cards</div>
                </motion.div>
                <motion.div 
                  className="p-4 border rounded-lg text-center bg-gradient-to-br from-white to-purple-50 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => {
                    setDifficulty('medium');
                    initializeGame();
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="font-bold text-game-secondary">Medium</div>
                  <div className="text-sm text-gray-500">20 cards</div>
                </motion.div>
                <motion.div 
                  className="p-4 border rounded-lg text-center bg-gradient-to-br from-white to-violet-50 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => {
                    setDifficulty('hard');
                    initializeGame();
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="font-bold text-game-tertiary">Hard</div>
                  <div className="text-sm text-gray-500">24 cards</div>
                </motion.div>
              </motion.div>
              
              {bestScore > 0 && (
                <motion.div 
                  className="mt-8 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg inline-flex items-center gap-2 shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">Best Score: {bestScore}</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
        
        {/* Instructions */}
        <motion.div 
          className="max-w-4xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-game-primary">How to Play</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Choose a difficulty level</li>
            <li>Click on cards to flip them over</li>
            <li>Remember the location of each emoji</li>
            <li>Match pairs of identical emojis</li>
            <li>The game ends when all pairs are matched</li>
            <li>Try to complete the game with fewer moves and in less time for a higher score</li>
          </ul>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MemoryGame;
