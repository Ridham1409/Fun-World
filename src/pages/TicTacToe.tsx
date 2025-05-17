
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  const [drawScore, setDrawScore] = useState(0);
  const [gameHistory, setGameHistory] = useState<Array<Array<string | null>>>([]);
  const [moveNumber, setMoveNumber] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);
  const { toast } = useToast();

  // Check for winner
  useEffect(() => {
    if (!isReviewing) {
      const winner = calculateWinner(board);
      if (winner || board.every(square => square !== null)) {
        setWinner(winner);
      }
    }
  }, [board, isReviewing]);

  // Update scores when game ends
  useEffect(() => {
    if (!isReviewing && winner !== null) {
      if (winner === 'X') {
        setXScore(prev => prev + 1);
        toast({
          title: "Game Over",
          description: "Player X wins!",
          duration: 3000,
        });
      } else if (winner === 'O') {
        setOScore(prev => prev + 1);
        toast({
          title: "Game Over",
          description: "Player O wins!",
          duration: 3000,
        });
      }
    } else if (!isReviewing && board.every(square => square !== null) && !winner) {
      setDrawScore(prev => prev + 1);
      toast({
        title: "Game Over",
        description: "It's a draw!",
        duration: 3000,
      });
    }
  }, [winner, board, isReviewing, toast]);

  // Handle square click
  const handleClick = (i: number) => {
    if (isReviewing) return;
    
    if (winner || board[i]) return;

    const newBoard = board.slice();
    newBoard[i] = isXNext ? 'X' : 'O';
    
    // Save history for this move
    const newHistory = gameHistory.slice(0, moveNumber);
    newHistory.push(board);
    
    setBoard(newBoard);
    setIsXNext(!isXNext);
    setGameHistory(newHistory);
    setMoveNumber(moveNumber + 1);
  };

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setGameHistory([]);
    setMoveNumber(0);
    setIsReviewing(false);
  };

  // Review a specific move in history
  const jumpTo = (move: number) => {
    setIsReviewing(true);
    if (move === 0) {
      setBoard(Array(9).fill(null));
    } else {
      setBoard(gameHistory[move]);
    }
    setMoveNumber(move);
    setIsXNext((move % 2) === 0);
  };

  // Calculate winner
  const calculateWinner = (squares: Array<string | null>) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    
    return null;
  };

  // Get status message
  const getStatus = () => {
    if (winner) {
      return `Winner: ${winner}`;
    } else if (board.every(square => square !== null)) {
      return "Draw!";
    } else {
      return `Next player: ${isXNext ? 'X' : 'O'}`;
    }
  };

  // Render a single square
  const renderSquare = (i: number) => {
    const value = board[i];
    return (
      <motion.button 
        className={`w-20 h-20 text-4xl font-bold border-2 border-gray-300 focus:outline-none 
          ${value === 'X' ? 'text-blue-500' : 'text-red-500'} 
          ${!winner && !board[i] ? 'hover:bg-gray-100' : ''}`}
        onClick={() => handleClick(i)}
        whileHover={{ scale: !winner && !board[i] ? 1.05 : 1 }}
        whileTap={{ scale: !winner && !board[i] ? 0.95 : 1 }}
        animate={{ 
          backgroundColor: winner && calculateWinner(board) && 
            board[i] === calculateWinner(board) ? 'rgba(52, 211, 153, 0.3)' : 'transparent' 
        }}
      >
        {value}
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Tic Tac Toe</h1>
        
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-game-primary text-white p-4">
            <div className="flex justify-between">
              <div>
                <h2 className="text-lg font-semibold">Player X: {xScore}</h2>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Draws: {drawScore}</h2>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Player O: {oScore}</h2>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="text-center mb-4 text-xl font-semibold">
              {getStatus()}
            </div>
            
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => renderSquare(i))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button onClick={resetGame} variant="secondary" className="mr-4">
                New Game
              </Button>
              {isReviewing && (
                <Button onClick={() => {
                  setIsReviewing(false);
                  setBoard(gameHistory[gameHistory.length - 1]);
                  setMoveNumber(gameHistory.length);
                }} variant="outline">
                  Return to Game
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {gameHistory.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Game History</h2>
            <div className="space-y-2">
              {gameHistory.map((_, move) => (
                <Button 
                  key={move}
                  onClick={() => jumpTo(move)}
                  variant={moveNumber === move ? "default" : "outline"}
                  className="mr-2 mb-2"
                >
                  {move === 0 ? 'Go to game start' : `Go to move #${move}`}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Players take turns putting their marks (X or O) in empty squares</li>
            <li>The first player to get 3 marks in a row (horizontally, vertically, or diagonally) wins the game</li>
            <li>If all 9 squares are filled and no one has 3 marks in a row, the game is a draw</li>
            <li>You can review previous moves using the Game History section</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TicTacToe;
