
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const NumberGuess = () => {
  const [minRange, setMinRange] = useState<number>(1);
  const [maxRange, setMaxRange] = useState<number>(100);
  const [secretNumber, setSecretNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [maxAttempts, setMaxAttempts] = useState<number>(10);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const { toast } = useToast();

  // Generate a random number within the range
  const generateRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Start a new game
  const startGame = () => {
    // Set ranges and max attempts based on difficulty
    let min = 1;
    let max = 100;
    let attempts = 10;
    
    if (difficulty === 'medium') {
      max = 200;
      attempts = 8;
    } else if (difficulty === 'hard') {
      max = 500;
      attempts = 6;
    }
    
    setMinRange(min);
    setMaxRange(max);
    setSecretNumber(generateRandomNumber(min, max));
    setAttempts(0);
    setMaxAttempts(attempts);
    setMessage(`I'm thinking of a number between ${min} and ${max}. You have ${attempts} attempts.`);
    setGuess('');
    setGameOver(false);
    setGameStarted(true);
  };

  // Handle guess submission
  const handleGuess = () => {
    const numGuess = Number(guess);
    
    // Validate input
    if (isNaN(numGuess) || numGuess < minRange || numGuess > maxRange) {
      setMessage(`Please enter a valid number between ${minRange} and ${maxRange}.`);
      return;
    }
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    // Check guess
    if (numGuess === secretNumber) {
      setMessage(`Congratulations! You guessed the number in ${newAttempts} attempts!`);
      setGameOver(true);
      toast({
        title: "You won!",
        description: `You found the number ${secretNumber} in ${newAttempts} attempts!`,
        variant: "default",
      });
    } else {
      const hint = numGuess < secretNumber ? 'higher' : 'lower';
      
      if (newAttempts >= maxAttempts) {
        setMessage(`Game over! You've used all your attempts. The number was ${secretNumber}.`);
        setGameOver(true);
        toast({
          title: "Game Over",
          description: `You ran out of attempts. The number was ${secretNumber}.`,
          variant: "destructive",
        });
      } else {
        const attemptsLeft = maxAttempts - newAttempts;
        setMessage(`Try ${hint}! You have ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} left.`);
      }
    }
    
    setGuess('');
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(e.target.value);
  };

  // Handle key press for Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !gameOver && gameStarted) {
      handleGuess();
    }
  };

  const handleDifficultyChange = (level: 'easy' | 'medium' | 'hard') => {
    setDifficulty(level);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Number Guessing Game</h1>
        
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Game Area */}
          <div className="p-6">
            {!gameStarted ? (
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-6">Choose Difficulty</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                  <Button 
                    onClick={() => handleDifficultyChange('easy')}
                    variant={difficulty === 'easy' ? 'default' : 'outline'}
                    className="px-8"
                  >
                    Easy (1-100)
                  </Button>
                  <Button 
                    onClick={() => handleDifficultyChange('medium')}
                    variant={difficulty === 'medium' ? 'default' : 'outline'}
                    className="px-8"
                  >
                    Medium (1-200)
                  </Button>
                  <Button 
                    onClick={() => handleDifficultyChange('hard')}
                    variant={difficulty === 'hard' ? 'default' : 'outline'}
                    className="px-8"
                  >
                    Hard (1-500)
                  </Button>
                </div>
                <Button onClick={startGame} size="lg">
                  Start Game
                </Button>
              </div>
            ) : (
              <>
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Attempts: {attempts}/{maxAttempts}</span>
                    <span>Remaining: {maxAttempts - attempts}</span>
                  </div>
                  <Progress value={(attempts / maxAttempts) * 100} className="h-2" />
                </div>
                
                {/* Message */}
                <div className={`p-4 rounded-lg mb-6 text-center
                  ${message.includes('Congratulations') ? 'bg-green-100 text-green-800' : 
                    message.includes('Game over') ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'}`}>
                  <p className="text-lg">{message}</p>
                </div>
                
                {/* Input Area */}
                {!gameOver && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      type="number"
                      min={minRange}
                      max={maxRange}
                      value={guess}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      placeholder={`Enter a number (${minRange}-${maxRange})`}
                      className="flex-grow"
                      autoFocus
                    />
                    <Button onClick={handleGuess}>
                      Guess
                    </Button>
                  </div>
                )}
                
                {/* Game Over Actions */}
                {gameOver && (
                  <div className="flex justify-center mt-6">
                    <Button onClick={startGame}>
                      Play Again
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Instructions */}
        <div className="max-w-2xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Choose a difficulty level: Easy, Medium, or Hard</li>
            <li>The computer will pick a random number within the range</li>
            <li>Enter your guess in the input field</li>
            <li>After each guess, you'll get a hint: try higher or lower</li>
            <li>Try to guess the number within the allowed attempts</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NumberGuess;
