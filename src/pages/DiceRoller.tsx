
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type DieType = 4 | 6 | 8 | 10 | 12 | 20;

const DiceRoller = () => {
  const [numberOfDice, setNumberOfDice] = useState<number>(1);
  const [dieType, setDieType] = useState<DieType>(6);
  const [results, setResults] = useState<number[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [rollHistory, setRollHistory] = useState<{ dice: number, type: DieType, results: number[], total: number }[]>([]);

  const diceTypes: DieType[] = [4, 6, 8, 10, 12, 20];

  // Roll the dice
  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    
    // Fake rolling animation with changing values
    let rollCount = 0;
    const maxRolls = 10;
    const interval = setInterval(() => {
      const tempResults = Array(numberOfDice).fill(0).map(() => Math.floor(Math.random() * dieType) + 1);
      setResults(tempResults);
      setTotal(tempResults.reduce((sum, val) => sum + val, 0));
      
      rollCount++;
      if (rollCount >= maxRolls) {
        clearInterval(interval);
        const finalResults = Array(numberOfDice).fill(0).map(() => Math.floor(Math.random() * dieType) + 1);
        const finalTotal = finalResults.reduce((sum, val) => sum + val, 0);
        
        setResults(finalResults);
        setTotal(finalTotal);
        setIsRolling(false);
        
        // Add to history
        setRollHistory(prev => [
          {
            dice: numberOfDice,
            type: dieType,
            results: finalResults,
            total: finalTotal
          },
          ...prev.slice(0, 9) // Keep only the last 10 rolls
        ]);
      }
    }, 100);
  };

  // Handle number of dice change
  const handleNumberOfDiceChange = (value: string) => {
    setNumberOfDice(parseInt(value));
  };

  // Handle die type change
  const handleDieTypeChange = (value: string) => {
    setDieType(parseInt(value) as DieType);
  };

  // Clear history
  const clearHistory = () => {
    setRollHistory([]);
  };

  // Die face renderer
  const renderDieFace = (value: number, dieType: DieType, index: number) => {
    const style = isRolling ? "animate-dice-roll" : "";
    
    let dots = [];
    if (dieType === 6) {
      // For D6, we can show dots like on traditional dice
      switch(value) {
        case 1:
          dots = ['center'];
          break;
        case 2:
          dots = ['top-right', 'bottom-left'];
          break;
        case 3:
          dots = ['top-right', 'center', 'bottom-left'];
          break;
        case 4:
          dots = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
          break;
        case 5:
          dots = ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'];
          break;
        case 6:
          dots = ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'];
          break;
      }
      
      return (
        <div 
          key={index}
          className={`w-20 h-20 bg-white rounded-lg shadow-lg flex items-center justify-center p-2 relative ${style}`}
          style={{transform: `rotate(${Math.random() * 360}deg)`}}
        >
          {dots.map((position, i) => (
            <span
              key={i}
              className={`absolute w-3 h-3 bg-black rounded-full ${getPositionClass(position)}`}
            ></span>
          ))}
        </div>
      );
    } else {
      // For other dice, we show the number
      return (
        <div 
          key={index}
          className={`dice ${style} ${getDieShapeClass(dieType)}`}
          style={{transform: `rotate(${Math.random() * 360}deg)`}}
        >
          {value}
        </div>
      );
    }
  };

  // Helper function to get dot position class
  const getPositionClass = (position: string): string => {
    switch(position) {
      case 'top-left': return 'top-2 left-2';
      case 'top-right': return 'top-2 right-2';
      case 'middle-left': return 'top-1/2 -translate-y-1/2 left-2';
      case 'middle-right': return 'top-1/2 -translate-y-1/2 right-2';
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      case 'bottom-left': return 'bottom-2 left-2';
      case 'bottom-right': return 'bottom-2 right-2';
      default: return '';
    }
  };

  // Helper function to get die shape class based on type
  const getDieShapeClass = (type: DieType): string => {
    switch(type) {
      case 4: return 'bg-red-500 text-white clip-triangle';
      case 8: return 'bg-green-500 text-white clip-diamond';
      case 10: return 'bg-blue-500 text-white rounded-full';
      case 12: return 'bg-yellow-500 text-white rounded-xl';
      case 20: return 'bg-purple-500 text-white clip-pentagon';
      default: return 'bg-white'; // D6
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Dice Roller</h1>
        
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Controls */}
          <div className="bg-game-primary text-white p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-32">
                  <Select
                    onValueChange={handleNumberOfDiceChange}
                    defaultValue="1"
                  >
                    <SelectTrigger id="number-of-dice">
                      <SelectValue placeholder="# of Dice" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'die' : 'dice'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-32">
                  <Select
                    onValueChange={handleDieTypeChange}
                    defaultValue="6"
                  >
                    <SelectTrigger id="die-type">
                      <SelectValue placeholder="Die Type" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {diceTypes.map((type) => (
                        <SelectItem key={type} value={type.toString()}>
                          D{type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                onClick={rollDice} 
                disabled={isRolling}
                size="lg"
                className="bg-white text-game-primary hover:bg-gray-100 hover:text-game-secondary"
              >
                {isRolling ? 'Rolling...' : `Roll ${numberOfDice}d${dieType}`}
              </Button>
            </div>
          </div>
          
          {/* Dice Display */}
          <div className="p-6">
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {results.length > 0 ? (
                results.map((result, index) => renderDieFace(result, dieType, index))
              ) : (
                <div className="dice bg-gray-200 flex items-center justify-center">
                  ?
                </div>
              )}
            </div>
            
            {/* Result */}
            {results.length > 0 && (
              <div className="text-center mb-6">
                <div className="text-2xl font-bold">
                  Total: {total}
                </div>
                <div className="text-sm text-gray-500">
                  {results.join(' + ')} = {total}
                </div>
              </div>
            )}
            
            {/* History */}
            {rollHistory.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Roll History</h3>
                  <Button 
                    onClick={clearHistory} 
                    variant="outline" 
                    size="sm"
                  >
                    Clear
                  </Button>
                </div>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Roll</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Dice</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Results</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rollHistory.map((roll, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-4 py-2 text-sm">#{rollHistory.length - index}</td>
                          <td className="px-4 py-2 text-sm">{roll.dice}d{roll.type}</td>
                          <td className="px-4 py-2 text-sm">{roll.results.join(', ')}</td>
                          <td className="px-4 py-2 text-sm font-medium">{roll.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Instructions */}
        <div className="max-w-4xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">How to Use the Dice Roller</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Select the number of dice you want to roll (1-5)</li>
            <li>Choose the type of die (D4, D6, D8, D10, D12, D20)</li>
            <li>Click the "Roll" button to roll the dice</li>
            <li>See the results and total sum of your roll</li>
            <li>View your roll history at the bottom</li>
          </ul>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DiceRoller;
