document.addEventListener('DOMContentLoaded', () => {
    const dealButton = document.getElementById('deal-btn');
    const foldButton = document.getElementById('fold-btn');
    const playerCardsDiv = document.getElementById('player-cards');
    const communityCardsDiv = document.getElementById('community-cards');

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

        for (let i = 0; i < 2; i++) {
            const card = deck.pop();
            playerCardsDiv.appendChild(createCardElement(card));
        }

        for (let i = 0; i < 5; i++) {
            const card = deck.pop();
            communityCardsDiv.appendChild(createCardElement(card));
        }
    }

    function createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.textContent = `${card.value}${card.suit}`;
        return cardDiv;
    }

    dealButton.addEventListener('click', () => {
        createDeck();
        dealCards();
    });

    foldButton.addEventListener('click', () => {
        playerCardsDiv.innerHTML = '';
        communityCardsDiv.innerHTML = '';
    });
});
