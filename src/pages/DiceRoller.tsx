
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Dices, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

type DieType = 4 | 6 | 8 | 10 | 12 | 20;

interface DiceRoll {
  dice: number;
  type: DieType;
  results: number[];
  total: number;
  timestamp: Date;
}

const DiceRoller = () => {
  const [numberOfDice, setNumberOfDice] = useState<number>(1);
  const [dieType, setDieType] = useState<DieType>(6);
  const [results, setResults] = useState<number[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [rollHistory, setRollHistory] = useState<DiceRoll[]>([]);
  const [showRules, setShowRules] = useState<boolean>(false);
  
  const diceTypes: DieType[] = [4, 6, 8, 10, 12, 20];

  // Roll the dice
  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    
    // Sound effect
    const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/10/audio_81cea8b060.mp3?filename=dice-roll-41072.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play failed:", e));
    
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
        const newRoll: DiceRoll = {
          dice: numberOfDice,
          type: dieType,
          results: finalResults,
          total: finalTotal,
          timestamp: new Date()
        };
        
        setRollHistory(prev => [newRoll, ...prev.slice(0, 9)]);
        
        // Show toast for good rolls
        if (finalTotal >= dieType * numberOfDice * 0.8) {
          toast({
            title: "Excellent Roll!",
            description: `You rolled a total of ${finalTotal}`,
            variant: "default",
          });
        }
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
    toast({
      title: "History Cleared",
      description: "All previous rolls have been cleared.",
      variant: "default",
    });
  };

  // Format time for history
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Get die icon based on value for d6
  const getDieIcon = (value: number) => {
    if (dieType !== 6) return null;
    
    switch(value) {
      case 1: return <Dice1 className="w-8 h-8" />;
      case 2: return <Dice2 className="w-8 h-8" />;
      case 3: return <Dice3 className="w-8 h-8" />;
      case 4: return <Dice4 className="w-8 h-8" />;
      case 5: return <Dice5 className="w-8 h-8" />;
      case 6: return <Dice6 className="w-8 h-8" />;
      default: return null;
    }
  };

  // Die face renderer
  const renderDieFace = (value: number, dieType: DieType, index: number) => {
    const dieIcon = getDieIcon(value);
    const style = isRolling ? "animate-dice-roll" : "";
    
    // For D6, we can show dots or icons
    if (dieType === 6 && dieIcon) {
      return (
        <div 
          key={index}
          className={`w-20 h-20 bg-white rounded-lg shadow-lg flex items-center justify-center ${style} transform transition-transform hover:rotate-12`}
          style={isRolling ? { animation: "spin 0.5s ease-in-out" } : {}}
        >
          {dieIcon}
        </div>
      );
    }
    
    // Different colors for different dice types
    const colors: Record<DieType, string> = {
      4: 'bg-red-500 text-white',
      6: 'bg-blue-500 text-white',
      8: 'bg-green-500 text-white',
      10: 'bg-yellow-500 text-black',
      12: 'bg-purple-500 text-white',
      20: 'bg-pink-500 text-white'
    };

    return (
      <div 
        key={index}
        className={`w-20 h-20 ${colors[dieType]} rounded-lg shadow-lg flex items-center justify-center font-bold text-3xl ${style} transform transition-transform hover:scale-110`}
        style={isRolling ? { animation: "spin 0.5s ease-in-out" } : {}}
      >
        {value}
      </div>
    );
  };

  // Add CSS for animation
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg) translateY(0); }
        25% { transform: rotate(90deg) translateY(-20px); }
        50% { transform: rotate(180deg) translateY(0); }
        75% { transform: rotate(270deg) translateY(-10px); }
        100% { transform: rotate(360deg) translateY(0); }
      }
      .animate-dice-roll {
        animation: spin 0.5s ease-in-out;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-purple-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-game-primary">Virtual Dice Roller</h1>
        
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Controls */}
          <div className="bg-game-primary text-white p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <div className="w-full sm:w-32">
                  <Select
                    onValueChange={handleNumberOfDiceChange}
                    defaultValue="1"
                  >
                    <SelectTrigger id="number-of-dice" className="bg-white text-game-primary">
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
                
                <div className="w-full sm:w-32">
                  <Select
                    onValueChange={handleDieTypeChange}
                    defaultValue="6"
                  >
                    <SelectTrigger id="die-type" className="bg-white text-game-primary">
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
                className="w-full sm:w-auto bg-white text-game-primary hover:bg-gray-100 hover:text-game-secondary flex items-center gap-2"
              >
                <Dices className="h-5 w-5" />
                {isRolling ? 'Rolling...' : `Roll ${numberOfDice}d${dieType}`}
              </Button>
            </div>
          </div>
          
          {/* Dice Display */}
          <div className="p-6">
            <div className="flex flex-wrap justify-center gap-6 mb-8 min-h-[100px]">
              {results.length > 0 ? (
                results.map((result, index) => renderDieFace(result, dieType, index))
              ) : (
                <div className="flex items-center justify-center text-gray-400">
                  <Dices className="h-16 w-16 mr-2" />
                  <span className="text-xl">Click Roll to start</span>
                </div>
              )}
            </div>
            
            {/* Result */}
            {results.length > 0 && (
              <div className="text-center mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-game-primary">
                  Total: {total}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {results.join(' + ')} = {total}
                </div>
              </div>
            )}
            
            {/* History */}
            {rollHistory.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-700">Roll History</h3>
                  <Button 
                    onClick={clearHistory} 
                    variant="outline" 
                    size="sm"
                    className="border-red-300 text-red-500 hover:bg-red-50"
                  >
                    Clear History
                  </Button>
                </div>
                <div className="border rounded-md overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Roll #</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Time</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Dice</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Results</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rollHistory.map((roll, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-blue-50'}>
                          <td className="px-4 py-3 text-sm">#{rollHistory.length - index}</td>
                          <td className="px-4 py-3 text-sm">{formatTime(roll.timestamp)}</td>
                          <td className="px-4 py-3 text-sm">{roll.dice}d{roll.type}</td>
                          <td className="px-4 py-3 text-sm">{roll.results.join(', ')}</td>
                          <td className="px-4 py-3 text-sm font-medium text-game-primary">{roll.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Rules & Instructions */}
        <div className="max-w-4xl mx-auto mt-8 bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">How to Use the Dice Roller</h2>
            <Button 
              variant="ghost" 
              onClick={() => setShowRules(!showRules)}
              className="text-game-primary"
            >
              {showRules ? "Hide Details" : "Show Details"}
            </Button>
          </div>
          
          {showRules ? (
            <div className="space-y-4 animate-fade-in">
              <p className="text-gray-600">
                This virtual dice roller simulates rolling physical dice for tabletop games, 
                role-playing games, or any other game that requires dice.
              </p>
              
              <h3 className="text-xl font-medium text-gray-700 mt-4">Instructions:</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Select the number of dice you want to roll (1-5)</li>
                <li>Choose the type of die (D4, D6, D8, D10, D12, D20)</li>
                <li>Click the "Roll" button to roll the dice</li>
                <li>Watch the animation and see your results</li>
                <li>View your roll history at the bottom</li>
              </ul>
              
              <h3 className="text-xl font-medium text-gray-700 mt-4">Dice Types:</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>D4:</strong> 4-sided die (tetrahedron) - values 1-4</li>
                <li><strong>D6:</strong> 6-sided die (cube) - values 1-6</li>
                <li><strong>D8:</strong> 8-sided die (octahedron) - values 1-8</li>
                <li><strong>D10:</strong> 10-sided die (pentagonal trapezohedron) - values 1-10</li>
                <li><strong>D12:</strong> 12-sided die (dodecahedron) - values 1-12</li>
                <li><strong>D20:</strong> 20-sided die (icosahedron) - values 1-20</li>
              </ul>
              
              <div className="bg-purple-50 p-4 rounded-lg mt-4">
                <p className="text-purple-800 font-medium">Tip: You can roll multiple dice at once for more complex game mechanics!</p>
              </div>
            </div>
          ) : (
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Select the number of dice (1-5) and the die type (D4-D20)</li>
              <li>Click "Roll" to see your results</li>
              <li>View your roll history below</li>
            </ul>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DiceRoller;
