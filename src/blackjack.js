document.addEventListener('DOMContentLoaded', () => {
    const deck = [];
    const suits = ['♠', '♣', '♦', '♥'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    let playerHand = [];
    let dealerHand = [];
    let isGameOver = false;
    let totalPoints = 1000;
    let currentBet = 0;

    const playerCardsElement = document.getElementById('player-cards');
    const dealerCardsElement = document.getElementById('dealer-cards');
    const playerScoreElement = document.getElementById('player-score');
    const dealerScoreElement = document.getElementById('dealer-score');
    const messageElement = document.getElementById('message');
    const totalPointsElement = document.getElementById('total-points');
    const betAmountElement = document.getElementById('bet-amount');

    const hitButton = document.getElementById('hit-button');
    const standButton = document.getElementById('stand-button');
    const restartButton = document.getElementById('restart-button');

    function initGame() {
        createDeck();
        shuffleDeck();
        playerHand = [drawCard(), drawCard()];
        dealerHand = [drawCard(), drawCard()];
        isGameOver = false;
        currentBet = parseInt(betAmountElement.value) || 0;

        if (currentBet > totalPoints) {
            messageElement.textContent = 'Not enough points to place this bet.';
            isGameOver = true;
            return;
        }

        totalPoints -= currentBet;
        updatePointsDisplay();

        updateGameArea();
        messageElement.textContent = '';
    }

    function createDeck() {
        deck.length = 0;
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ value, suit });
            }
        }
    }

    function shuffleDeck() {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function drawCard() {
        return deck.pop();
    }

    function calculateScore(hand) {
        let score = 0;
        let aceCount = 0;

        hand.forEach(card => {
            if (['J', 'Q', 'K'].includes(card.value)) {
                score += 10;
            } else if (card.value === 'A') {
                score += 11;
                aceCount++;
            } else {
                score += parseInt(card.value);
            }
        });

        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount--;
        }

        return score;
    }

    function updateGameArea() {
        playerCardsElement.innerHTML = '';
        dealerCardsElement.innerHTML = '';

        playerHand.forEach(card => {
            playerCardsElement.innerHTML += `<span>${card.value}${card.suit}</span> `;
        });

        dealerHand.forEach(card => {
            dealerCardsElement.innerHTML += `<span>${card.value}${card.suit}</span> `;
        });

        playerScoreElement.textContent = `Score: ${calculateScore(playerHand)}`;
        dealerScoreElement.textContent = `Score: ${calculateScore(dealerHand)}`;
    }

    hitButton.addEventListener('click', () => {
        if (isGameOver) return;

        playerHand.push(drawCard());
        updateGameArea();

        if (calculateScore(playerHand) > 21) {
            messageElement.textContent = 'Bust! You lose.';
            isGameOver = true;
        }
    });

    standButton.addEventListener('click', () => {
        if (isGameOver) return;

        while (calculateScore(dealerHand) < 17) {
            dealerHand.push(drawCard());
        }

        updateGameArea();
        checkWinner();
        isGameOver = true;
    });

    function checkWinner() {
        const playerScore = calculateScore(playerHand);
        const dealerScore = calculateScore(dealerHand);

        if (dealerScore > 21 || playerScore > dealerScore) {
            messageElement.textContent = 'You win!';
            totalPoints += currentBet * 2;
        } else if (dealerScore === playerScore) {
            messageElement.textContent = 'It\'s a tie!';
            totalPoints += currentBet;
        } else {
            messageElement.textContent = 'Dealer wins!';

        }
        updatePointsDisplay();
    }

    function updatePointsDisplay() {
        totalPointsElement.textContent = totalPoints;
    }

    restartButton.addEventListener('click', () => {
        initGame();
    });
    initGame();
});