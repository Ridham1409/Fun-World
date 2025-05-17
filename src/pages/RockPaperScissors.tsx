
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type Choice = 'rock' | 'paper' | 'scissors' | null;

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [result, setResult] = useState<string>('');
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [computerScore, setComputerScore] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const { toast } = useToast();

  const choices: Choice[] = ['rock', 'paper', 'scissors'];

  const getComputerChoice = (): Choice => {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  };

  const determineWinner = (player: Choice, computer: Choice): string => {
    if (player === computer) return "It's a tie!";
    if (
      (player === 'rock' && computer === 'scissors') || 
      (player === 'paper' && computer === 'rock') || 
      (player === 'scissors' && computer === 'paper')
    ) {
      setPlayerScore(prev => prev + 1);
      return 'You win!';
    } else {
      setComputerScore(prev => prev + 1);
      return 'Computer wins!';
    }
  };

  const handlePlayerChoice = (choice: Choice) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setPlayerChoice(choice);
    setComputerChoice(null);
    setResult('');
    
    // Simulate computer "thinking"
    setTimeout(() => {
      const compChoice = getComputerChoice();
      setComputerChoice(compChoice);
      setResult(determineWinner(choice, compChoice));
      setIsAnimating(false);
      
      toast({
        title: "Game Result",
        description: determineWinner(choice, compChoice),
        duration: 2000,
      });
    }, 1000);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult('');
  };

  const getChoiceEmoji = (choice: Choice) => {
    switch (choice) {
      case 'rock': return '👊';
      case 'paper': return '✋';
      case 'scissors': return '✌️';
      default: return '❓';
    }
  };

  const getResultClass = (choice: Choice) => {
    if (!result) return '';
    if (result === "It's a tie!") return 'bg-yellow-100 border-yellow-300';
    if (
      (playerChoice === choice && result === 'You win!') ||
      (computerChoice === choice && result === 'Computer wins!')
    ) return 'bg-green-100 border-green-300';
    return '';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Rock Paper Scissors</h1>
        
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Game Information */}
          <div className="bg-game-primary text-white p-4">
            <div className="flex justify-between">
              <div>
                <h2 className="text-lg font-semibold">Player: {playerScore}</h2>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Computer: {computerScore}</h2>
              </div>
            </div>
          </div>
          
          {/* Game Area */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-around items-center mb-8 space-y-6 md:space-y-0">
              {/* Player Choice */}
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Your Choice</h3>
                <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center text-6xl
                  ${playerChoice ? getResultClass(playerChoice) : 'border-gray-300 bg-gray-100'}`}>
                  {playerChoice ? getChoiceEmoji(playerChoice) : '?'}
                </div>
              </div>
              
              {/* VS */}
              <div className="text-4xl font-bold">VS</div>
              
              {/* Computer Choice */}
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Computer's Choice</h3>
                <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center text-6xl 
                  ${isAnimating ? 'animate-spin' : ''} 
                  ${computerChoice ? getResultClass(computerChoice) : 'border-gray-300 bg-gray-100'}`}>
                  {computerChoice ? getChoiceEmoji(computerChoice) : '?'}
                </div>
              </div>
            </div>
            
            {/* Result Display */}
            {result && (
              <div className={`text-center p-4 rounded-lg mb-8 text-xl font-semibold
                ${result === "It's a tie!" ? 'bg-yellow-100 text-yellow-800' : 
                  result === 'You win!' ? 'bg-green-100 text-green-800' : 
                  'bg-red-100 text-red-800'}`}>
                {result}
              </div>
            )}
            
            {/* Choice Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              {choices.map((choice) => (
                <Button
                  key={choice}
                  onClick={() => handlePlayerChoice(choice)}
                  disabled={isAnimating}
                  className="text-2xl p-6 hover:scale-105 transition"
                  variant="outline"
                >
                  <span className="mr-2">{getChoiceEmoji(choice)}</span>
                  <span className="capitalize">{choice}</span>
                </Button>
              ))}
            </div>
            
            {(playerChoice || computerChoice) && (
              <div className="mt-6 text-center">
                <Button onClick={resetGame} variant="secondary">
                  New Game
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Instructions */}
        <div className="max-w-3xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Click on Rock, Paper, or Scissors to make your choice</li>
            <li>The computer will randomly select its choice</li>
            <li>Rock beats Scissors</li>
            <li>Scissors beats Paper</li>
            <li>Paper beats Rock</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RockPaperScissors;
