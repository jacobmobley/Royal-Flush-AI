document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('plinko-canvas');
    const ctx = canvas.getContext('2d');
    const boardWidth = 800;
    const boardHeight = 1000;
    const pegRadius = 4;
    const ballRadius = 8;
    const pegRows = 20;
    const gravity = 0.1;
    const damping = 0.5;
    let balls = [];
    let pegs = [];

    canvas.width = boardWidth;
    canvas.height = boardHeight;

    function createPegs() {
        pegs = [];
        const pegSpacingX = boardWidth / (pegRows + 2);
        const pegSpacingY = boardHeight / (pegRows + 1);

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

    function drawPegs() {
        ctx.fillStyle = '#fff';
        pegs.forEach(peg => {
            ctx.beginPath();
            ctx.arc(peg.x, peg.y, pegRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        });
    }

    function drawBalls() {
        balls.forEach(ball => {
            ctx.fillStyle = '#f00';
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        });
    }

    function updateBalls() {
        balls = balls.filter(ball => ball.y <= boardHeight - ballRadius);

        balls.forEach(ball => {
            ball.speedY += gravity;

            ball.y += ball.speedY;
            ball.x += ball.speedX;

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

                    const overlap = pegRadius + ballRadius - distance+0.5;
                    ball.x += normalX * overlap;
                    ball.y += normalY * overlap;
                }
            });

            if (ball.x < ballRadius || ball.x > boardWidth - ballRadius) {
                ball.speedX *= -1;
            }
        });
    }

    function draw() {
        ctx.clearRect(0, 0, boardWidth, boardHeight);
        drawPegs();
        drawBalls();
    }

    function gameLoop() {
        updateBalls();
        draw();
        requestAnimationFrame(gameLoop);
    }

    function startGame() {
        createPegs();
        drawPegs();
        gameLoop();
    }

    document.getElementById('drop-ball').addEventListener('click', () => {
        const firstRowPegs = pegs.slice(0, 3);
        const minX = firstRowPegs[0].x;
        const maxX = firstRowPegs[2].x;

        balls.push({
            x: Math.random() * (maxX - minX) + minX,
            y: ballRadius,
            speedX: 0,
            speedY: 0
        });
    });

    startGame();
});
