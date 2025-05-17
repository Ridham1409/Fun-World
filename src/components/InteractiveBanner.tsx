
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Gamepad, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Word scramble game data
const words = [
  { original: "GAMES", hint: "What you play for fun" },
  { original: "PUZZLE", hint: "A problem designed to test ingenuity" },
  { original: "PLAYER", hint: "Someone who plays games" },
  { original: "VICTORY", hint: "Success in a game or competition" },
  { original: "CHALLENGE", hint: "Something that tests your abilities" },
];

const scrambleWord = (word: string) => {
  const chars = word.split('');
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  // Make sure the scrambled word is different from the original
  const scrambled = chars.join('');
  return scrambled === word ? scrambleWord(word) : scrambled;
};

const InteractiveBanner = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWord, setCurrentWord] = useState<{ original: string; scrambled: string; hint: string } | null>(null);
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showHint, setShowHint] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (isPlaying && timeLeft === 0) {
      endGame();
    }
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    selectRandomWord();
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setShowHint(false);
    setUserGuess('');
  };

  const endGame = () => {
    setIsPlaying(false);
    toast({
      title: "Game Over!",
      description: `Your final score: ${score}`,
      duration: 3000,
    });
  };

  const selectRandomWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord({
      original: randomWord.original,
      scrambled: scrambleWord(randomWord.original),
      hint: randomWord.hint
    });
    setUserGuess('');
    setShowHint(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserGuess(e.target.value.toUpperCase());
  };

  const checkAnswer = () => {
    if (!currentWord) return;
    
    if (userGuess.toUpperCase() === currentWord.original) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: "+1 point",
        duration: 1500,
      });
      selectRandomWord();
    } else {
      toast({
        title: "Incorrect!",
        description: `The correct word was: ${currentWord.original}`,
        variant: "destructive",
        duration: 2000,
      });
      setTimeLeft(prevTime => Math.max(0, prevTime - 3)); // Penalty: -3 seconds
    }
  };

  const displayHint = () => {
    setShowHint(true);
    setTimeLeft(prevTime => Math.max(0, prevTime - 2)); // Penalty: -2 seconds
  };

  return (
    <section className="bg-game-primary text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80')] bg-no-repeat bg-cover"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {!isPlaying ? (
          <div className="max-w-3xl">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Welcome to Fun Games Hub
            </motion.h1>
            
            <motion.p 
              className="text-xl mb-8 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Explore our collection of interactive games designed to challenge your skills and provide hours of entertainment!
            </motion.p>
            
            <div className="flex flex-wrap gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <a href="#games" className="game-button inline-block">
                  Explore Games
                </a>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Button 
                  onClick={startGame} 
                  variant="outline" 
                  className="bg-transparent border-white text-white hover:bg-white hover:text-game-primary"
                >
                  <Gamepad className="mr-2 h-4 w-4" />
                  Play Word Scramble
                </Button>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">Score: {score}</div>
              <div className="text-lg font-semibold">Time: {timeLeft}s</div>
            </div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-sm p-8 rounded-lg mb-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl mb-4">Unscramble this word:</h2>
              <div className="text-4xl font-bold tracking-wider mb-6">
                {currentWord?.scrambled.split('').map((char, index) => (
                  <motion.span 
                    key={index} 
                    className="inline-block mx-1 bg-game-secondary px-2 py-1 rounded"
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: 360 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
              
              {showHint && currentWord && (
                <div className="text-sm bg-game-secondary/70 inline-block p-2 rounded mb-4">
                  Hint: {currentWord.hint}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <input 
                  type="text"
                  value={userGuess}
                  onChange={handleInputChange}
                  placeholder="Type your answer"
                  className="px-4 py-2 rounded bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 w-full sm:w-auto"
                  autoFocus
                />
                
                <Button 
                  onClick={checkAnswer} 
                  className="bg-white text-game-primary hover:bg-white/90"
                >
                  Submit <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                {!showHint && (
                  <Button 
                    onClick={displayHint} 
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/10"
                  >
                    Get Hint (-2s)
                  </Button>
                )}
              </div>
            </motion.div>
            
            <Button 
              onClick={endGame} 
              variant="outline" 
              className="mt-4 border-white/50 text-white hover:bg-white/10"
            >
              End Game
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default InteractiveBanner;
