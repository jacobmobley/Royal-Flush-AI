import React, { useState, useRef, useEffect } from "react";
import "./plinko.module.css";

const PlinkoGame = () => {
  const canvasRef = useRef(null);
  const [totalPoints, setTotalPoints] = useState(1000); // Initial points
  const [balls, setBalls] = useState([]);
  const [pegs, setPegs] = useState([]);
  const [multipliers, setMultipliers] = useState([]);
  const [betAmount, setBetAmount] = useState(500); // Default bet amount
  const boardWidth = 1000;
  const boardHeight = 1000;
  const pegRadius = 4;
  const ballRadius = 10;
  const pegRows = 20;
  const gravity = 0.1;
  const damping = 0.6;

  // Initialize canvas and game objects once on component mount
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = boardWidth;
    canvas.height = boardHeight;

    // Create pegs and multipliers when the game starts
    createPegs();
    createMultipliers();

    // Start the game loop
    const gameLoop = () => {
      updateBalls();
      draw(ctx);
      requestAnimationFrame(gameLoop);
    };
    gameLoop();
  }, []);

  // Function to create pegs
  const createPegs = () => {
    const newPegs = [];
    const pegSpacingX = boardWidth / (pegRows + 1);
    const pegSpacingY = boardHeight / (pegRows + 1.5);

    for (let row = 0; row < pegRows; row++) {
      const numPegsInRow = row + 3;
      for (let col = 0; col < numPegsInRow; col++) {
        const offsetX = (boardWidth - numPegsInRow * pegSpacingX) / 2;
        const x = col * pegSpacingX + offsetX + pegSpacingX / 2;
        const y = row * pegSpacingY + pegSpacingY / 2;
        newPegs.push({ x, y });
      }
    }
    setPegs(newPegs);
  };

  // Function to create multiplier boxes at the bottom
  const createMultipliers = () => {
    const multiplierValues = [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110];
    const boxWidth = boardWidth / multiplierValues.length;
    const newMultipliers = multiplierValues.map((multiplier, i) => ({
      x: i * boxWidth,
      y: boardHeight - 50,
      width: boxWidth,
      height: 50,
      multiplier,
    }));
    setMultipliers(newMultipliers);
  };

  // Function to draw pegs
  const drawPegs = (ctx) => {
    ctx.fillStyle = "#fff";
    pegs.forEach((peg) => {
      ctx.beginPath();
      ctx.arc(peg.x, peg.y, pegRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    });
  };

  // Function to draw multiplier boxes
  const drawMultipliers = (ctx) => {
    multipliers.forEach((box) => {
      if (box.multiplier >= 10) {
        ctx.fillStyle = "#FF3B3B"; // Red
      } else if (box.multiplier >= 2) {
        ctx.fillStyle = "#FFA500"; // Orange
      } else if (box.multiplier >= 1) {
        ctx.fillStyle = "#FFD700"; // Yellow
      } else {
        ctx.fillStyle = "#00BFFF"; // Blue
      }

      ctx.fillRect(box.x, box.y, box.width, box.height);
      ctx.strokeStyle = "#000";
      ctx.strokeRect(box.x, box.y, box.width, box.height);
      ctx.fillStyle = "#E0E0E0";
      ctx.font = "20px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`x${box.multiplier}`, box.x + box.width / 2, box.y + box.height / 2 + 7);
    });
  };

  // Function to draw balls
  const drawBalls = (ctx) => {
    balls.forEach((ball) => {
      ctx.fillStyle = "#f00";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    });
  };

  // Update all balls
  const updateBalls = () => {
    setBalls((prevBalls) =>
      prevBalls
        .map((ball) => {
          ball.speedY += gravity;
          ball.y += ball.speedY;
          ball.x += ball.speedX;

          // Check for collisions with pegs
          pegs.forEach((peg) => {
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
            }
          });

          if (ball.x < ballRadius || ball.x > boardWidth - ballRadius) {
            ball.speedX *= -1;
          }

          // Remove ball if it goes off the screen
          return ball.y >= boardHeight - ballRadius ? null : ball;
        })
        .filter(Boolean)
    );
  };

  // Main draw function
  const draw = (ctx) => {
    ctx.clearRect(0, 0, boardWidth, boardHeight);
    drawPegs(ctx);
    drawBalls(ctx);
    drawMultipliers(ctx);
  };

  // Function to handle placing a bet and dropping a ball
  const handlePlaceBet = () => {
    if (betAmount > totalPoints) {
      alert("Not enough points to make this bet!");
      return;
    }

    setTotalPoints((prevPoints) => prevPoints - betAmount);

    const firstRowPegs = pegs.slice(0, 3);
    const minX = firstRowPegs[0].x;
    const maxX = firstRowPegs[2].x;

    setBalls((prevBalls) => [
      ...prevBalls,
      {
        x: Math.random() * (maxX - minX) + minX,
        y: ballRadius,
        speedX: 0,
        speedY: 0,
        bet: betAmount,
      },
    ]);
  };

  return (
    <div id="plinko-game">
      <canvas ref={canvasRef} id="plinko-canvas"></canvas>
      <div id="controls">
        <h3>Betting Panel</h3>
        <label htmlFor="bet-amount">Set Bet Amount:</label>
        <input
          type="number"
          id="bet-amount"
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          min="0"
        />
        <button onClick={handlePlaceBet}>Place Bet & Drop Ball</button>
        <h3>Total Points: <span>{totalPoints}</span></h3>
      </div>
    </div>
  );
};

export default PlinkoGame;
