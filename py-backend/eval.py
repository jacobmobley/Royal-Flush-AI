import eval7
from pprint import pprint

def evaluate_hand(hand, community_cards):
    cards = [card for card in hand + community_cards]
    hand_value = eval7.evaluate(cards)
    return hand_value


deck = eval7.Deck()

deck.shuffle()

hand = deck.deal(2)
community_cards = deck.deal(3)

pprint(hand)
pprint(community_cards)
