import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Roulette.module.css"; // Use a module for styling
import FireBaseAuth from "./FireBaseAuth";

const numbers = [
  { number: "0", color: "green" },
  { number: "28", color: "black" },
  { number: "9", color: "red" },
  { number: "26", color: "black" },
  { number: "30", color: "red" },
  { number: "11", color: "black" },
  { number: "7", color: "red" },
  { number: "20", color: "black" },
  { number: "32", color: "red" },
  { number: "17", color: "black" },
  { number: "5", color: "red" },
  { number: "22", color: "black" },
  { number: "34", color: "red" },
  { number: "15", color: "black" },
  { number: "3", color: "red" },
  { number: "24", color: "black" },
  { number: "36", color: "red" },
  { number: "13", color: "black" },
  { number: "1", color: "red" },
  { number: "00", color: "green" },
  { number: "27", color: "red" },
  { number: "10", color: "black" },
  { number: "25", color: "red" },
  { number: "29", color: "black" },
  { number: "12", color: "red" },
  { number: "8", color: "black" },
  { number: "19", color: "red" },
  { number: "31", color: "black" },
  { number: "18", color: "red" },
  { number: "6", color: "black" },
  { number: "21", color: "red" },
  { number: "33", color: "black" },
  { number: "16", color: "red" },
  { number: "4", color: "black" },
  { number: "23", color: "red" },
  { number: "35", color: "black" },
  { number: "14", color: "red" },
  { number: "2", color: "black" },
];

const RouletteA = () => {
  const [curUser] = useState(new FireBaseAuth());
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [totalPoints, setTotalPoints] = useState(1000);
  const [betAmount, setBetAmount] = useState(100);
  const [placedBet, setPlacedBet] = useState(null); // Tracks the user's bet
  const [message, setMessage] = useState("");
  const [winningIndex, setWinningIndex] = useState(null); // Winning number index
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(null); // Track the current highlighted number during the spin
  const canvasRef = useRef(null);

  const [betHistory, setBetHistory] = useState([]);

  const centerX = 200;
  const centerY = 200;
  const wheelRadius = 150;

  const setTotalPointsWithUpdate = (newPoints) => {
    setTotalPoints(newPoints); // Set the local state
    curUser.updateCurrency(newPoints); // Call the function to update Firebase
  };

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
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
      ctx.fillStyle = "white";
      ctx.font = "16px Arial";
      ctx.fillText(segment.number, textX - 10, textY + 5);
    });

    if (currentHighlightIndex !== null) {
      highlightSegment(currentHighlightIndex, "yellow", "black");
    } else if (winningIndex !== null) {
      highlightSegment(winningIndex, "yellow", "black");
    }
  }, [currentHighlightIndex, winningIndex]);

  const highlightSegment = (index, highlightColor, textColor) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
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
    ctx.font = "16px Arial";
    ctx.fillText(numbers[index].number, textX - 10, textY + 5);
  };

  // Effect to re-draw the wheel whenever there's a change in the winning number or the spinning index
  useEffect(() => {
    const unsubscribe = curUser.getUnsubscribe();
    const checkLoadingStatus = setInterval(() => {
      if (!curUser.loading) {
        setLoading(false);
        setUserData(curUser.userData); // Sync userData from FireBaseAuth
        const initialPoints = curUser.userData?.currency || 0;
        clearInterval(checkLoadingStatus); // Stop checking once data is available
        setTotalPoints(initialPoints);
      }
    }, 100);
    return () => {
      unsubscribe();
      clearInterval(checkLoadingStatus);
    };
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
      setMessage("Not enough points to place this bet.");
      return;
    }

    setTotalPoints((prev) => {
      const newTotal = prev - betAmt;
      console.log("Updated totalPoints:", newTotal);

      // After calculating, update both local state and Firebase
      setTotalPointsWithUpdate(newTotal); // Call the custom setter with the new total points
      return newTotal; // Update local state with the new total
    });
    setMessage("Spinning...");
    setWinningIndex(null);
    setCurrentHighlightIndex(null);
    setIsSpinning(true);

    const winIndex = Math.floor(Math.random() * numbers.length);
    let currentIndex = 0;
    let spinSpeed = 50;
    const spinRounds = 5;
    let totalSpins = numbers.length * spinRounds + winIndex;

    const spinAnimation = setInterval(() => {
      setCurrentHighlightIndex(currentIndex);
      currentIndex = (currentIndex + 1) % numbers.length;

      if (totalSpins < 20) {
        spinSpeed += 10;
      }

      totalSpins--;

      if (totalSpins <= 0) {
        clearInterval(spinAnimation);
        setWinningIndex(winIndex);
        setCurrentHighlightIndex(null);
        checkWin(numbers[winIndex].number, winIndex);
        setIsSpinning(false);
      }
    }, spinSpeed);
  };

  const checkWin = (winningNumber, winIndex) => {
    console.log(winningNumber, winIndex, numbers[winIndex].color);
    if (!placedBet) return;

    let win = false;

    if (placedBet.type === "number" && placedBet.value === winningNumber) {
      setMessage(`You win! The winning number is ${winningNumber}.`);
      win = true;
      setTotalPoints((prev) => {
        const newTotal = prev + betAmount * 36;
        console.log("Updated totalPoints:", newTotal);

        // After calculating, update both local state and Firebase
        setTotalPointsWithUpdate(newTotal); // Call the custom setter with the new total points
        return newTotal; // Update local state with the new total
      });
    } else if (
      placedBet.type === "color" &&
      numbers[winIndex].color === placedBet.value
    ) {
      setMessage(`You win! The winning color is ${numbers[winIndex].color}.`);
      win = true;
      setTotalPoints((prev) => {
        const newTotal = prev + betAmount * 2;
        console.log("Updated totalPoints:", newTotal);

        // After calculating, update both local state and Firebase
        setTotalPointsWithUpdate(newTotal); // Call the custom setter with the new total points
        return newTotal; // Update local state with the new total
      });
    } else if (
      placedBet.type === "parity" &&
      (placedBet.value === "even"
        ? winningNumber % 2 === 0
        : winningNumber % 2 !== 0)
    ) {
      setMessage(`You win! The winning number is ${winningNumber}.`);
      win = true;
      setTotalPoints((prev) => {
        const newTotal = prev + betAmount * 2;
        console.log("Updated totalPoints:", newTotal);

        // After calculating, update both local state and Firebase
        setTotalPointsWithUpdate(newTotal); // Call the custom setter with the new total points
        return newTotal; // Update local state with the new total
      });
    } else if (
      placedBet.type === "range" &&
      ((placedBet.value === "1-18" &&
        winningNumber >= 1 &&
        winningNumber <= 18) ||
        (placedBet.value === "19-36" &&
          winningNumber >= 19 &&
          winningNumber <= 36))
    ) {
      setMessage(`You win! The winning number is ${winningNumber}.`);
      win = true;
      setTotalPoints((prev) => {
        const newTotal = prev + betAmount * 2;
        console.log("Updated totalPoints:", newTotal);

        // After calculating, update both local state and Firebase
        setTotalPointsWithUpdate(newTotal); // Call the custom setter with the new total points
        return newTotal; // Update local state with the new total
      });
    } else if (
      placedBet.type === "dozen" &&
      ((placedBet.value === "1st12" &&
        winningNumber >= 1 &&
        winningNumber <= 12) ||
        (placedBet.value === "2nd12" &&
          winningNumber >= 13 &&
          winningNumber <= 24) ||
        (placedBet.value === "3rd12" &&
          winningNumber >= 25 &&
          winningNumber <= 36))
    ) {
      setMessage(`You win! The winning number is ${winningNumber}.`);
      win = true;
      setTotalPoints((prev) => {
        const newTotal = prev + betAmount * 3;
        console.log("Updated totalPoints:", newTotal);

        // After calculating, update both local state and Firebase
        setTotalPointsWithUpdate(newTotal); // Call the custom setter with the new total points
        return newTotal; // Update local state with the new total
      });
    } else {
      setMessage(`You lose! The winning number is ${winningNumber}.`);
    }

    const result = win ? "Win" : "Lose";
    setBetHistory((prevResults) => {
      const updatedResults = [
        ...prevResults,
        {
          betAmount, // What the user bet
          betOn: `${placedBet.type} (${placedBet.value})`, // What they bet on
          result, // Win or Lose
        },
      ];

      // Slice to keep only the last 10 entries
      return updatedResults.slice(-10);
    });
  };

  return (
    <div>
      <div className={styles.pageBody}>
        <div className={styles.historyTable}>
          <h3>Bet History</h3>
          <table>
            <thead>
              <tr>
                <th>Bet</th>
                <th>Value</th>
                <th>Win/Lose</th>
              </tr>
            </thead>
            <tbody>
              {betHistory.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.betAmount}</td> {/* Displays the bet amount */}
                  <td>{entry.betOn}</td> {/* Displays the bet value */}
                  <td>{entry.result}</td> {/* Displays Win or Lose */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <canvas ref={canvasRef} width="400" height="400"></canvas>
        <div className={styles.controls}>
          <h3>Total Points: {totalPoints}</h3>
          <label className={styles.betLabel}>Bet Amount:</label>{" "}
          {/* Now styled in yellow */}
          <input
            type="number"
            value={betAmount}
            className={styles.betInput}
            onChange={(e) => setBetAmount(parseInt(e.target.value))}
          />
          <button
            className={styles.spinButton}
            onClick={spinWheel}
            disabled={isSpinning || !placedBet}
          >
            Spin
          </button>
          <p>{message}</p>
        </div>

        <RouletteTable onPlaceBet={placeBet} />
      </div>
    </div>
  );
};

const RouletteTable = ({ onPlaceBet }) => {
  const [selectedBet, setSelectedBet] = useState(null);

  const placeBet = (betType, betValue) => {
    setSelectedBet({ type: betType, value: betValue });
    onPlaceBet(betType, betValue);
  };

  return (
    <div className={styles.bettingTable}>
      <h3>Betting Table</h3>
      <div className={styles.zeroRow}>
        <button
          className={styles.greenButton}
          onClick={() => placeBet("number", "0")}
        >
          0
        </button>
        <button
          className={styles.greenButton}
          onClick={() => placeBet("number", "00")}
        >
          00
        </button>
      </div>

      {/* Row 1: Numbers 1-12 */}
      <div className={styles.numberRow}>
        <button
          className={styles.redButton}
          onClick={() => placeBet("number", 1)}
        >
          01
        </button>
        <button
          className={styles.blackButton}
          onClick={() => placeBet("number", 2)}
        >
          02
        </button>
        <button
          className={styles.redButton}
          onClick={() => placeBet("number", 3)}
        >
          03
        </button>
        <button
          className={styles.blackButton}
          onClick={() => placeBet("number", 4)}
        >
          04
        </button>
        <button
          className={styles.redButton}
          onClick={() => placeBet("number", 5)}
        >
          05
        </button>
        <button
          className={styles.blackButton}
          onClick={() => placeBet("number", 6)}
        >
          06
        </button>
        <button
          className={styles.redButton}
          onClick={() => placeBet("number", 7)}
        >
          07
        </button>
        <button
          className={styles.blackButton}
          onClick={() => placeBet("number", 8)}
        >
          08
        </button>
        <button
          className={styles.redButton}
          onClick={() => placeBet("number", 9)}
        >
          09
        </button>
        <button
          className={styles.blackButton}
          onClick={() => placeBet("number", 10)}
        >
          10
        </button>
        <button
          className={styles.blackButton}
          onClick={() => placeBet("number", 11)}
        >
          11
        </button>
        <button
          className={styles.redButton}
          onClick={() => placeBet("number", 12)}
        >
          12
        </button>
      </div>

      {/* Row 2: Numbers 13-24 */}
      <div className={styles.numberRow}>
        <button
          className={styles.blackButton}
          onClick={() => placeBet("number", 13)}
        >
          13
        </button>
        <button
          className={styles.redButton}
          onClick={() => placeBet("number", 14)}
        >
          14
        </button>
        <button
          className={styles.blackButton}
          onClick={() => placeBet("number", 15)}
        >
          15
        </button>
        <button
          className={styles.redButton}
          onClick={() => placeBet("number", 16)}
        >
          16
        </button>
        <button
          className={styles.blackButton}
          onClick={() => placeBet("number", 17)}
        >
          17
        </button>
        <button
          className={styles.redButton}
          onClick={() => placeBet("number", 18)}
        >
          18
        </button>
        <button
          className={styles.redButton}
          onClick={() => placeBet("number", 19)}
        >
          19
        </button>
        <button
          className={styles.blackButton}
          onClick={() => placeBet("number", 20)}
        >
          20
        </button>
        <button
          className={styles.redButton}
          onClick={() => placeBet("number", 21)}
        >
          21
        </button>
        <button
          className={styles.blackButton}
          onClick={() => placeBet("number", 22)}
        >
          22
        </button>
        <button
          className={styles.redButton}
          onClick={() => placeBet("number", 23)}
        >
          23
        </button>
        <button
          className={styles.blackButton}
          onClick={() => placeBet("number", 24)}
        >
          24
        </button>
      </div>

      {/* Row 3: Numbers 25-36 */}
      <div className={styles.numberRow}>
        <button
          className={styles.redButton}
          onClick={() => placeBet("number", 25)}
        >
          25
        </button>
        <button
          className={styles.blackButton}
          onClick={() => placeBet("number", 26)}
        >
          26
        </button>
        <button
          className={styles.redButton}
          onClick={() => placeBet("number", 27)}
        >
          27
        </button>
        <button
          className={styles.blackButton}
          onClick={() => placeBet("number", 28)}
        >
          28
        </button>
        <button
          className={styles.blackButton}
          onClick={() => placeBet("number", 29)}
        >
          29
        </button>
        <button
          className={styles.redButton}
          onClick={() => placeBet("number", 30)}
        >
          30
        </button>
        <button
          className={styles.blackButton}
          onClick={() => placeBet("number", 31)}
        >
          31
        </button>
        <button
          className={styles.redButton}
          onClick={() => placeBet("number", 32)}
        >
          32
        </button>
        <button
          className={styles.blackButton}
          onClick={() => placeBet("number", 33)}
        >
          33
        </button>
        <button
          className={styles.redButton}
          onClick={() => placeBet("number", 34)}
        >
          34
        </button>
        <button
          className={styles.blackButton}
          onClick={() => placeBet("number", 35)}
        >
          35
        </button>
        <button
          className={styles.redButton}
          onClick={() => placeBet("number", 36)}
        >
          36
        </button>
      </div>

      {/* Bet options */}
      <div className={styles.betOptions}>
        <button
          onClick={() => placeBet("color", "red")}
          className={styles.betButton}
        >
          Red
        </button>
        <button
          onClick={() => placeBet("color", "black")}
          className={styles.betButton}
        >
          Black
        </button>
        <button
          onClick={() => placeBet("parity", "even")}
          className={styles.betButton}
        >
          Even
        </button>
        <button
          onClick={() => placeBet("parity", "odd")}
          className={styles.betButton}
        >
          Odd
        </button>
        <button
          onClick={() => placeBet("range", "1-18")}
          className={styles.betButton}
        >
          1 to 18
        </button>
        <button
          onClick={() => placeBet("range", "19-36")}
          className={styles.betButton}
        >
          19 to 36
        </button>
        <button
          onClick={() => placeBet("dozen", "1st12")}
          className={styles.betButton}
        >
          1st 12
        </button>
        <button
          onClick={() => placeBet("dozen", "2nd12")}
          className={styles.betButton}
        >
          2nd 12
        </button>
        <button
          onClick={() => placeBet("dozen", "3rd12")}
          className={styles.betButton}
        >
          3rd 12
        </button>
      </div>
      <p>
        Selected Bet:{" "}
        {selectedBet
          ? `${selectedBet.type} on ${selectedBet.value}`
          : "No bet yet"}
      </p>
    </div>
  );
};

export default RouletteA;
