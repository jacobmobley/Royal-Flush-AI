// script.js
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('roulette-wheel');
    const ctx = canvas.getContext('2d');
    const spinButton = document.getElementById('spin-button');
    const betAmountElement = document.getElementById('bet-amount');
    const betNumberElement = document.getElementById('bet-number');
    const totalPointsElement = document.getElementById('total-points');
    const messageElement = document.getElementById('message');

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const wheelRadius = 150;
    let totalPoints = 1000;
    let isSpinning = false;

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
        { number: 3, color: 'red' }, { number: 26, color: 'black' },
    ];

    function drawWheel() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const segmentAngle = (2 * Math.PI) / numbers.length;

        numbers.forEach((segment, index) => {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, wheelRadius, index * segmentAngle, (index + 1) * segmentAngle);
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
    }

    function spinWheel() {
        if (isSpinning) return;

        const betAmount = parseInt(betAmountElement.value) || 0;
        const betNumber = parseInt(betNumberElement.value);

        if (betAmount > totalPoints) {
            messageElement.textContent = 'Not enough points to place this bet.';
            return;
        }

        if (betNumber < 0 || betNumber > 36) {
            messageElement.textContent = 'Please bet on a number between 0 and 36.';
            return;
        }

        totalPoints -= betAmount;
        updatePointsDisplay();

        isSpinning = true;
        messageElement.textContent = 'Spinning...';

        const winningIndex = Math.floor(Math.random() * 37);
        let currentIndex = 0;
        let spinSpeed = 100;
        let spinRounds = 3;
        let totalSpins = numbers.length * spinRounds + winningIndex;

        const spinAnimation = setInterval(() => {
            drawWheel();
            highlightWinningNumber(currentIndex);
            currentIndex = (currentIndex + 1) % numbers.length;

            if (totalSpins <= 20) {
                spinSpeed += 10;
            }

            if (--totalSpins <= 0) {
                clearInterval(spinAnimation);
                checkWin(betNumber, numbers[winningIndex].number, betAmount);
                isSpinning = false;
            }
        }, spinSpeed);
    }

    function highlightWinningNumber(index) {
        const segmentAngle = (2 * Math.PI) / numbers.length;
        drawWheel();

        const adjustedIndex = (index + 1) % numbers.length;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, wheelRadius, adjustedIndex * segmentAngle, (adjustedIndex + 1) * segmentAngle);
        ctx.closePath();
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.stroke();

        const angle = adjustedIndex * segmentAngle + segmentAngle / 2;
        const textX = centerX + (wheelRadius - 30) * Math.cos(angle);
        const textY = centerY + (wheelRadius - 30) * Math.sin(angle);
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(numbers[adjustedIndex].number, textX - 10, textY + 5);
    }

    function checkWin(betNumber, winningNumber, betAmount) {
        if (betNumber === winningNumber) {
            messageElement.textContent = `You win! The winning number is ${winningNumber}.`;
            totalPoints += betAmount * 36;
        } else {
            messageElement.textContent = `You lose! The winning number is ${winningNumber}.`;
        }
        updatePointsDisplay();
    }

    function updatePointsDisplay() {
        totalPointsElement.textContent = totalPoints;
    }

    spinButton.addEventListener('click', spinWheel);
    drawWheel();
});
