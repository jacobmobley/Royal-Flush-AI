import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Roulette.module.css'; // Use a module for styling
import RouletteTable from './RouletteTable'; // Import the betting table component
import FireBaseAuth from './FireBaseAuth';

const numbers = [
  { number: 0, color: 'green' },
  { number: 32, color: 'red' }, { number: 15, color: 'black' },
  { number: 19, color: 'red' }, { number: 4, color: 'black' },
  { number: 21, color: 'red' }, { number: 2, color: 'black' },
  { number: 25, color: 'red' }, { number: 17, color: 'black' },
  { number: 34, color: 'red' }, { number: 6, color: 'black' },
  { number: 27, color: 'red' }, { number: 13, color: 'black' },
  { number: 36, color: 'red' }, { number: 11, color: 'black' },
  { number: 30, color: 'red' }, { number: 8, color: 'black' },
  { number: 23, color: 'red' }, { number: 10, color: 'black' },
  { number: 5, color: 'red' }, { number: 24, color: 'black' },
  { number: 16, color: 'red' }, { number: 33, color: 'black' },
  { number: 1, color: 'red' }, { number: 20, color: 'black' },
  { number: 14, color: 'red' }, { number: 31, color: 'black' },
  { number: 9, color: 'red' }, { number: 22, color: 'black' },
  { number: 18, color: 'red' }, { number: 29, color: 'black' },
  { number: 7, color: 'red' }, { number: 28, color: 'black' },
  { number: 12, color: 'red' }, { number: 35, color: 'black' },
  { number: 3, color: 'red' }, { number: 26, color: 'black' }
];

const Roulette = () => {
  const [curUser] = useState(new FireBaseAuth());
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const canvasRef = useRef(null);
  const [totalPoints, setTotalPoints] = useState(1000);
  const [betAmount, setBetAmount] = useState(100);
  const [placedBet, setPlacedBet] = useState(null); // Tracks the user's bet
  const [message, setMessage] = useState('');
  const [winningIndex, setWinningIndex] = useState(null); // Winning number index
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(null); // Track the current highlighted number during the spin

  const centerX = 200;
  const centerY = 200;
  const wheelRadius = 150;

  const setTotalPointsWithUpdate = (newPoints) => {
    setTotalPoints(newPoints); // Set the local state
    curUser.updateCurrency(newPoints); // Call the function to update Firebase
  };



  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;  // Ensure the canvas is available
    const ctx = canvas.getContext('2d');
    const segmentAngle = (2 * Math.PI) / numbers.length;
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    numbers.forEach((segment, index) => {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(
        centerX,
        centerY,
        wheelRadius,
        index * segmentAngle,
        (index + 1) * segmentAngle
      );
      ctx.closePath();
      ctx.fillStyle = segment.color;
      ctx.fill();
      ctx.stroke();
  
      const angle = index * segmentAngle + segmentAngle / 2;
      const textX = centerX + (wheelRadius - 30) * Math.cos(angle);
      const textY = centerY + (wheelRadius - 30) * Math.sin(angle);
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.fillText(segment.number, textX - 10, textY + 5);
    });
  
    // Highlight current or winning segment
    if (currentHighlightIndex !== null) {
      highlightSegment(currentHighlightIndex, 'yellow', 'black');
    } else if (winningIndex !== null) {
      highlightSegment(winningIndex, 'yellow', 'black');
    }
  }, [currentHighlightIndex, winningIndex]);


  const highlightSegment = (index, highlightColor, textColor) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const segmentAngle = (2 * Math.PI) / numbers.length;
  
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(
      centerX,
      centerY,
      wheelRadius,
      index * segmentAngle,
      (index + 1) * segmentAngle
    );
    ctx.closePath();
    ctx.fillStyle = highlightColor;
    ctx.fill();
    ctx.stroke();
  
    const angle = index * segmentAngle + segmentAngle / 2;
    const textX = centerX + (wheelRadius - 30) * Math.cos(angle);
    const textY = centerY + (wheelRadius - 30) * Math.sin(angle);
    ctx.fillStyle = textColor;
    ctx.font = '16px Arial';
    ctx.fillText(numbers[index].number, textX - 10, textY + 5);
  };



  // Effect to re-draw the wheel whenever there's a change in the winning number or the spinning index
  useEffect(() => {
    const unsubscribe = curUser.getUnsubscribe();
    const checkLoadingStatus = setInterval(() => {
      if (!curUser.loading) {
        setLoading(false);
        setUserData(curUser.userData);  // Sync userData from FireBaseAuth
        const initialPoints = curUser.userData?.currency || 0;
        clearInterval(checkLoadingStatus);   // Stop checking once data is available
        setTotalPoints(initialPoints)
      }
    }, 100);
    return () => {
      unsubscribe();
      clearInterval(checkLoadingStatus);
    }
    
  }, [curUser]);

  useEffect(() => {
    drawWheel();
  }, [loading, drawWheel]);


  useEffect(() => {
    drawWheel();
  }, [currentHighlightIndex, winningIndex, drawWheel]);

  if (loading) {
    return <div>Loading user data...</div>;
  }

  const placeBet = (type, value) => {
    setPlacedBet({ type, value });
  };

  const spinWheel = () => {
    if (isSpinning || !placedBet) return;

    const betAmt = parseInt(betAmount, 10) || 0;
    if (betAmt > totalPoints) {
      setMessage('Not enough points to place this bet.');
      return;
    }

    setTotalPoints(prev => {
      const newTotal = prev - betAmt;
      console.log("Updated totalPoints:", newTotal);
  
      // After calculating, update both local state and Firebase
      setTotalPointsWithUpdate(newTotal);  // Call the custom setter with the new total points
      return newTotal;  // Update local state with the new total
    });
    setMessage('Spinning...');
    setWinningIndex(null); // Reset previous winning highlight
    setCurrentHighlightIndex(null); // Reset spinning highlight
    setIsSpinning(true);

    const winIndex = Math.floor(Math.random() * numbers.length); // Random winning index
    let currentIndex = 0;
    let spinSpeed = 50;
    const spinRounds = 5;
    let totalSpins = numbers.length * spinRounds + winIndex;

    const spinAnimation = setInterval(() => {
      setCurrentHighlightIndex(currentIndex);
      currentIndex = (currentIndex + 1) % numbers.length;

      if (totalSpins < 20) {
        spinSpeed += 10; // Slow down spin near the end
      }

      totalSpins--;

      if (totalSpins <= 0) {
        clearInterval(spinAnimation);
        setWinningIndex(winIndex);
        setCurrentHighlightIndex(null); // Stop spinning highlight
        checkWin(numbers[winIndex].number); // Check if the player won
        setIsSpinning(false);
      }
    }, spinSpeed);
  };

  const checkWin = (winningNumber) => {
    if (!placedBet) return;

    let win = false;

    if (placedBet.type === 'number' && placedBet.value === winningNumber) {
      win = true;
    } else if (placedBet.type === 'color' && numbers[winningIndex].color === placedBet.value) {
      win = true;
    } else if (placedBet.type === 'parity' && (placedBet.value === 'even' ? winningNumber % 2 === 0 : winningNumber % 2 !== 0)) {
      win = true;
    } else if (placedBet.type === 'range' && (
      (placedBet.value === '1-18' && winningNumber >= 1 && winningNumber <= 18) ||
      (placedBet.value === '19-36' && winningNumber >= 19 && winningNumber <= 36)
    )) {
      win = true;
    } else if (placedBet.type === 'dozen' && (
      (placedBet.value === '1st12' && winningNumber >= 1 && winningNumber <= 12) ||
      (placedBet.value === '2nd12' && winningNumber >= 13 && winningNumber <= 24) ||
      (placedBet.value === '3rd12' && winningNumber >= 25 && winningNumber <= 36)
    )) {
      win = true;
    }

    if (win) {
      setMessage(`You win! The winning number is ${winningNumber}.`);
      setTotalPoints(prev => {
        const newTotal = prev + betAmount*2;
        console.log("Updated totalPoints:", newTotal);
    
        // After calculating, update both local state and Firebase
        setTotalPointsWithUpdate(newTotal);  // Call the custom setter with the new total points
        return newTotal;  // Update local state with the new total
      });
    } else {
      setMessage(`You lose! The winning number is ${winningNumber}.`);
    }
  };

  return (
    <div>
    <div className="page-body" style={{ backgroundColor: '#0D1B2A', color: '#E0E0E0', minHeight: '100vh' }}>

      <canvas ref={canvasRef} width="400" height="400"></canvas>
      <div className="controls">
        <h3>Total Points: {totalPoints}</h3>
        <label>Bet Amount:</label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(parseInt(e.target.value))}
        />
        <button onClick={spinWheel} disabled={isSpinning || !placedBet}>Spin</button>
        <p>{message}</p>
      </div>

      <RouletteTable onPlaceBet={placeBet} />
    </div>
    </div>
  );
};

export default Roulette;
