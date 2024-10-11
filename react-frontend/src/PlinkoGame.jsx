import React, { useRef, useEffect, useState } from 'react';
import styles from "./PlinkoGame.module.css";
const PlinkoGame = () => {
  const canvasRef = useRef(null);
  const [totalPoints, setTotalPoints] = useState(curUser.userData.currency);
  const [balls, setBalls] = useState([]);
  const [betAmount, setBetAmount] = useState(500);
  const pegs = useRef([]);
  const multipliers = useRef([]);
  const ballRadius = 9;
  const pegRadius = 4;
  const boardWidth = 1000;
  const boardHeight = 1000;
  const pegRows = 20;
  const gravity = 0.1;
  const damping = 0.4;
  

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const createPegs = () => {
      pegs.current = [];
      const pegSpacingX = boardWidth / (pegRows + 1);
      const pegSpacingY = boardHeight / (pegRows + 1.5);

      for (let row = 0; row < pegRows; row++) {
        const numPegsInRow = row + 3;
        for (let col = 0; col < numPegsInRow; col++) {
          const offsetX = (boardWidth - numPegsInRow * pegSpacingX) / 2;
          const x = col * pegSpacingX + offsetX + pegSpacingX / 2;
          const y = row * pegSpacingY + pegSpacingY / 2;
          pegs.current.push({ x, y });
        }
      }
    };

    const createMultipliers = () => {
      multipliers.current.length = 0;
      const multiplierValues = [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110];
      const numBoxes = multiplierValues.length;
      const boxWidth = boardWidth / numBoxes;

      for (let i = 0; i < numBoxes; i++) {
        const x = i * boxWidth;
        const y = boardHeight - 50;
        multipliers.current.push({ x, y, width: boxWidth, height: 50, multiplier: multiplierValues[i] });
      }
    };

    const drawMultipliers = () => {
      multipliers.current.forEach(box => {
        if (box.multiplier >= 10) ctx.fillStyle = '#FF3B3B';
        else if (box.multiplier >= 2) ctx.fillStyle = '#FFA500';
        else if (box.multiplier >= 1) ctx.fillStyle = '#FFD700';
        else ctx.fillStyle = '#00BFFF';

        ctx.fillRect(box.x, box.y, box.width, box.height);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.fillStyle = '#E0E0E0';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`x${box.multiplier}`, box.x + box.width / 2, box.y + box.height / 2 + 7);
      });
    };

    const drawPegs = () => {
      ctx.fillStyle = '#fff';
      pegs.current.forEach(peg => {
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, pegRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });
    };

    const drawBalls = () => {
      balls.forEach(ball => {
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      });
    };

    const updateBalls = () => {
      setBalls(prevBalls =>
        prevBalls
          .map(ball => {
            ball.speedY += gravity;
            ball.y += ball.speedY;
            ball.x += ball.speedX;

            pegs.current.forEach(peg => {
              const distX = ball.x - peg.x;
              const distY = ball.y - peg.y;
              const distance = Math.sqrt(distX * distX + distY * distY);

              if (distance < pegRadius + ballRadius) {
                const normalX = distX / distance;
                const normalY = distY / distance;
                const dotProduct = ball.speedX * normalX + ball.speedY * normalY;

                ball.speedX -= 2 * dotProduct * normalX;
                ball.speedY -= 2 * dotProduct * normalY;
                ball.speedX *= damping;
                ball.speedY *= damping;

                const overlap = pegRadius + ballRadius - distance + 1;
                ball.x += normalX * overlap;
                ball.y += normalY * overlap;
              }
            });

            if (ball.x < ballRadius || ball.x > boardWidth - ballRadius) ball.speedX *= -1;
            console.log(ball.y)
            if (ball.y >= boardHeight - ballRadius) {
              multipliers.current.forEach(box => {
                if (ball.x > box.x && ball.x < box.x + box.width) {
                  setTotalPoints(prevPoints => prevPoints + ball.bet * box.multiplier);
                }
              });
              return null; // Remove ball after it hits bottom
            }
            return ball;
          })
          .filter(Boolean) // Remove nulls
      );
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, boardWidth, boardHeight);
      drawPegs();
      drawBalls();
      drawMultipliers();
      updateBalls();
      requestAnimationFrame(gameLoop);
    };

    createPegs();
    createMultipliers();
    gameLoop();
  }, [balls]);

  const handleBet = () => {
    if (betAmount > totalPoints) {
      alert('Not enough points to make this bet!');
      return;
    }
    setTotalPoints(prevPoints => prevPoints - betAmount);

    const firstRowPegs = pegs.current.slice(0, 3);
    const minX = firstRowPegs[0].x;
    const maxX = firstRowPegs[2].x;

    setBalls(prevBalls => [
      ...prevBalls,
      {
        x: Math.random() * (maxX - minX) + minX,
        y: ballRadius,
        speedX: 0,
        speedY: 0,
        bet: betAmount
      }
    ]);
  };

  if (curUser.loading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className={styles.plinkoGame}>
      <canvas ref={canvasRef} className={styles.plinkoCanvas} width="1000" height="1000"></canvas>
      <div className={styles.controls}>
        <h3>Betting Panel</h3>
        <label htmlFor="bet-amount">Set Bet Amount:</label>
        <input
          type="number"
          id="bet-amount"
          value={betAmount}
          onChange={e => setBetAmount(Number(e.target.value))}
          min="0"
        />
        <button className={styles.placeBetButton} onClick={handleBet}>Place Bet & Drop Ball</button>
        <h3>Total Points: <span>{totalPoints}</span></h3>
      </div>
    </div>
  );
};

export default PlinkoGame;
