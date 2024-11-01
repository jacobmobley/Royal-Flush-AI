import eval7

def evaluate_hand(hand, community_cards):
    cards = [card for card in hand + community_cards]
    hand_value = eval7.evaluate(cards)
    return hand_value