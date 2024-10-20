# Helper to define card ranks in order
RANK_ORDER = "23456789TJQKA"

# Function to evaluate the hand strength
def evaluate_hand(player_hand, river_cards):
    full_hand = player_hand + river_cards

    hand_ranks = [card[0] for card in full_hand]  # Get ranks
    hand_suits = [card[1] for card in full_hand]  # Get suits

    # Count the occurrences of each rank
    rank_count = {}
    for rank in hand_ranks:
        rank_count[rank] = rank_count.get(rank, 0) + 1

    # Check for different hands
    flush = check_flush(hand_suits)
    straight = check_straight(hand_ranks)
    four_of_a_kind = check_of_a_kind(rank_count, 4)
    full_house = check_full_house(rank_count)
    three_of_a_kind = check_of_a_kind(rank_count, 3)
    two_pair = check_two_pair(rank_count)
    one_pair = check_of_a_kind(rank_count, 2)

    # Evaluate the best possible hand
    if flush and straight:
        return 'Straight Flush'
    if four_of_a_kind:
        return 'Four of a Kind'
    if full_house:
        return 'Full House'
    if flush:
        return 'Flush'
    if straight:
        return 'Straight'
    if three_of_a_kind:
        return 'Three of a Kind'
    if two_pair:
        return 'Two Pair'
    if one_pair:
        return 'One Pair'
    
    return 'High Card'

# Function to check for flush (5 cards of the same suit)
def check_flush(suits):
    suit_count = {}
    for suit in suits:
        suit_count[suit] = suit_count.get(suit, 0) + 1
    return any(count >= 5 for count in suit_count.values())

# Function to check for straight (5 consecutive cards)
def check_straight(ranks):
    sorted_ranks = sorted(set(RANK_ORDER.index(rank) for rank in ranks))
    consecutive = 1
    for i in range(1, len(sorted_ranks)):
        if sorted_ranks[i] == sorted_ranks[i - 1] + 1:
            consecutive += 1
        else:
            consecutive = 1
        if consecutive == 5:
            return True
    return False

# Function to check for Four of a Kind, Three of a Kind, or One Pair
def check_of_a_kind(rank_count, kind):
    return any(count == kind for count in rank_count.values())

# Function to check for Full House (Three of a Kind + One Pair)
def check_full_house(rank_count):
    counts = list(rank_count.values())
    return 3 in counts and 2 in counts

# Function to check for Two Pair
def check_two_pair(rank_count):
    pairs = [count for count in rank_count.values() if count == 2]
    return len(pairs) >= 2

# Function to read user input and display the result
def evaluate_user_hand():
    player_hand = input("Enter your 2 card hand (e.g., 'AS KH'): ").upper().split()
    river_cards = input("Enter 3 to 5 river cards (e.g., '2D 3H 4S'): ").upper().split()

    if len(player_hand) != 2 or not (3 <= len(river_cards) <= 5):
        print("Invalid input. You need exactly 2 hand cards and between 3 and 5 river cards.")
        return

    result = evaluate_hand(player_hand, river_cards)
    print(f"Your best hand is: {result}")

# Run the function to evaluate the user's hand
evaluate_user_hand()
