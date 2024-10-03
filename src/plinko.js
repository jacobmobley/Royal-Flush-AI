document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('plinko-canvas');
    const ctx = canvas.getContext('2d');
    const boardWidth = 1000; // Increase the width for a wider board
    const boardHeight = 1000;
    const pegRadius = 4;
    const ballRadius = 10;
    const pegRows = 20;
    const gravity = 0.1;
    const damping = 0.6; // Increased damping to 0.6
    let balls = [];
    let pegs = [];
    const multipliers = [];
    let totalPoints = 1000; // Initial points to start with

    canvas.width = boardWidth;
    canvas.height = boardHeight;

    // Initialize pegs in a triangular pattern
    function createPegs() {
        pegs = [];
        const pegSpacingX = boardWidth / (pegRows + 1); // Adjust horizontal spacing
        const pegSpacingY = boardHeight / (pegRows + 1.5); // Adjust vertical spacing

        for (let row = 0; row < pegRows; row++) {
            const numPegsInRow = row + 3;
            for (let col = 0; col < numPegsInRow; col++) {
                const offsetX = (boardWidth - numPegsInRow * pegSpacingX) / 2;
                const x = col * pegSpacingX + offsetX + pegSpacingX / 2;
                const y = row * pegSpacingY + pegSpacingY / 2;
                pegs.push({ x, y });
            }
        }
    }

    // Create multiplier boxes at the bottom
    function createMultipliers() {
        multipliers.length = 0;
        const multiplierValues = [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110]; // Fixed multipliers
        const numBoxes = multiplierValues.length;
        const boxWidth = boardWidth / numBoxes;

        for (let i = 0; i < numBoxes; i++) {
            const x = i * boxWidth;
            const y = boardHeight - 50;
            multipliers.push({ x, y, width: boxWidth, height: 50, multiplier: multiplierValues[i] });
        }
    }

    // Draw the multiplier boxes
    function drawMultipliers() {
        multipliers.forEach(box => {
            // Set colors based on multiplier
            if (box.multiplier >= 10) {
                ctx.fillStyle = '#FF3B3B'; // Red
            } else if (box.multiplier >= 2) {
                ctx.fillStyle = '#FFA500'; // Orange
            } else if (box.multiplier >= 1) {
                ctx.fillStyle = '#FFD700'; // Yellow
            } else {
                ctx.fillStyle = '#00BFFF'; // Blue
            }

            ctx.fillRect(box.x, box.y, box.width, box.height);
            ctx.strokeStyle = '#000';
            ctx.strokeRect(box.x, box.y, box.width, box.height);
            
            // Set text color to a light gray/white
            ctx.fillStyle = '#E0E0E0';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`x${box.multiplier}`, box.x + box.width / 2, box.y + box.height / 2 + 7);
        });
    }

    // Draw the pegs
    function drawPegs() {
        ctx.fillStyle = '#fff';
        pegs.forEach(peg => {
            ctx.beginPath();
            ctx.arc(peg.x, peg.y, pegRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        });
    }

    // Draw all balls
    function drawBalls() {
        balls.forEach(ball => {
            ctx.fillStyle = '#f00';
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        });
    }

    // Update all balls
    function updateBalls() {
        balls = balls.filter(ball => {
            if (ball.y >= boardHeight - ballRadius) {
                multipliers.forEach(box => {
                    if (ball.x > box.x && ball.x < box.x + box.width) {
                        totalPoints += ball.bet * box.multiplier;
                        updatePointsDisplay();
                    }
                });
                return false;
            }
            return true;
        });

        balls.forEach(ball => {
            ball.speedY += gravity;
            ball.y += ball.speedY;
            ball.x += ball.speedX;

            // Check for collisions with pegs
            pegs.forEach(peg => {
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

            if (ball.x < ballRadius || ball.x > boardWidth - ballRadius) {
                ball.speedX *= -1;
            }
        });
    }

    // Draw the game board
    function draw() {
        ctx.clearRect(0, 0, boardWidth, boardHeight);
        drawPegs();
        drawBalls();
        drawMultipliers();
    }

    // Update points display
    function updatePointsDisplay() {
        document.getElementById('total-points').textContent = totalPoints;
    }

    // Main game loop
    function gameLoop() {
        updateBalls();
        draw();
        requestAnimationFrame(gameLoop);
    }

    // Start the game
    function startGame() {
        createPegs();
        createMultipliers();
        drawPegs();
        drawMultipliers();
        gameLoop();
    }

    // Drop a new ball with the current bet
    document.getElementById('place-bet').addEventListener('click', () => {
        const betAmount = parseInt(document.getElementById('bet-amount').value, 10) || 0;

        if (betAmount > totalPoints) {
            alert('Not enough points to make this bet!');
            return;
        }

        totalPoints -= betAmount;
        updatePointsDisplay();

        const firstRowPegs = pegs.slice(0, 3);
        const minX = firstRowPegs[0].x;
        const maxX = firstRowPegs[2].x;

        balls.push({
            x: Math.random() * (maxX - minX) + minX,
            y: ballRadius,
            speedX: 0,
            speedY: 0,
            bet: betAmount
        });
    });

    startGame();
});
