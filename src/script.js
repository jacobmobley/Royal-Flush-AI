// script.js
document.addEventListener('DOMContentLoaded', () => {
    const dealButton = document.getElementById('deal-btn');
    const foldButton = document.getElementById('fold-btn');
    const playerCardsDiv = document.getElementById('player-cards');
    const communityCardsDiv = document.getElementById('community-cards');
    const handResultDiv = document.getElementById('hand-result');

    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    let deck = [];

    function createDeck() {
        deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value });
            }
        }
        deck = shuffle(deck);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function dealCards() {
        playerCardsDiv.innerHTML = '';
        communityCardsDiv.innerHTML = '';
        handResultDiv.textContent = 'Hand: N/A';

        // Deal two cards to the player
        const playerHand = [];
        for (let i = 0; i < 2; i++) {
            const card = deck.pop();
            playerHand.push(card);
            playerCardsDiv.appendChild(createCardElement(card));
        }

        // Deal five community cards
        const communityHand = [];
        for (let i = 0; i < 5; i++) {
            const card = deck.pop();
            communityHand.push(card);
            communityCardsDiv.appendChild(createCardElement(card));
        }

        // Combine player and community cards
        const allCards = playerHand.concat(communityHand);
        evaluateHand(allCards);
    }

    function createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.textContent = `${card.value}${card.suit}`;
        return cardDiv;
    }

    function evaluateHand(cards) {
        const ranks = cards.map(card => card.value);
        const suits = cards.map(card => card.suit);
        const rankCounts = countOccurrences(ranks);
        const suitCounts = countOccurrences(suits);

        const isFlush = Object.values(suitCounts).some(count => count >= 5);
        const isStraight = checkStraight(ranks);

        let handRank = 'High Card';

        if (isFlush && isStraight) {
            handRank = 'Straight Flush';
        } else if (Object.values(rankCounts).includes(4)) {
            handRank = 'Four of a Kind';
        } else if (Object.values(rankCounts).includes(3) && Object.values(rankCounts).includes(2)) {
            handRank = 'Full House';
        } else if (isFlush) {
            handRank = 'Flush';
        } else if (isStraight) {
            handRank = 'Straight';
        } else if (Object.values(rankCounts).includes(3)) {
            handRank = 'Three of a Kind';
        } else if (Object.values(rankCounts).filter(count => count === 2).length === 2) {
            handRank = 'Two Pair';
        } else if (Object.values(rankCounts).includes(2)) {
            handRank = 'One Pair';
        }

        // Display the hand rank on the screen
        handResultDiv.textContent = `Hand: ${handRank}`;
    }

    function countOccurrences(array) {
        return array.reduce((acc, val) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
        }, {});
    }

    function checkStraight(ranks) {
        const rankOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const rankSet = new Set(ranks.map(rank => rankOrder.indexOf(rank)).sort((a, b) => a - b));

        let consecutiveCount = 0;
        let lastIndex = -1;

        for (let index of rankSet) {
            if (lastIndex !== -1 && index === lastIndex + 1) {
                consecutiveCount++;
                if (consecutiveCount >= 4) return true;
            } else {
                consecutiveCount = 0;
            }
            lastIndex = index;
        }

        // Special case: Ace-low straight (A, 2, 3, 4, 5)
        if (rankSet.has(rankOrder.indexOf('A')) && rankSet.has(rankOrder.indexOf('2')) &&
            rankSet.has(rankOrder.indexOf('3')) && rankSet.has(rankOrder.indexOf('4')) &&
            rankSet.has(rankOrder.indexOf('5'))) {
            return true;
        }

        return false;
    }

    dealButton.addEventListener('click', () => {
        createDeck();
        dealCards();
    });

    foldButton.addEventListener('click', () => {
        playerCardsDiv.innerHTML = '';
        communityCardsDiv.innerHTML = '';
        handResultDiv.textContent = 'Hand: N/A';
    });
});
