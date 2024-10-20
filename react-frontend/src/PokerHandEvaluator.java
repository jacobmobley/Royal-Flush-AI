import java.util.*;

public class PokerHandEvaluator {

    // Helper to define card ranks in order
    private static final String RANK_ORDER = "23456789TJQKA";

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        boolean loop = true;
        while (loop) {
            // Input player's hand (2 cards)
            System.out.println("Enter your 2 card hand (e.g., 'AS KH'):");
            String[] playerHand = scanner.nextLine().toUpperCase().split(" ");

            // Input river cards (3 to 5 cards)
            System.out.println("Enter 3 to 5 river cards (e.g., '2D 3H 4S'):");
            String[] riverCards = scanner.nextLine().toUpperCase().split(" ");

            if (playerHand.length != 2 || riverCards.length < 3 || riverCards.length > 5) {
                System.out.println("Invalid input. You need exactly 2 hand cards and between 3 and 5 river cards.");
                return;
            }

            // Combine player's hand and river cards
            List<String> fullHand = new ArrayList<>();
            fullHand.addAll(Arrays.asList(playerHand));
            fullHand.addAll(Arrays.asList(riverCards));

            // Evaluate the best hand
            String bestHand = evaluateHand(fullHand);
            System.out.println("Your best hand is: " + bestHand);

            System.out.println("Would you like to try again? (y/n)");
            String response = scanner.nextLine();
            if (!response.equals("y")) {
                loop = false;
            }
        }
    }

    // Function to evaluate the hand strength
    public static String evaluateHand(List<String> hand) {
        List<Character> handRanks = new ArrayList<>();
        List<Character> handSuits = new ArrayList<>();

        // Extract ranks and suits from each card
        for (String card : hand) {
            handRanks.add(card.charAt(0)); // Rank
            handSuits.add(card.charAt(1)); // Suit
        }

        // Count the occurrences of each rank
        Map<Character, Integer> rankCount = new HashMap<>();
        for (char rank : handRanks) {
            rankCount.put(rank, rankCount.getOrDefault(rank, 0) + 1);
        }

        // Check for different hands
        boolean flush = checkFlush(handSuits);
        boolean straight = checkStraight(handRanks);
        boolean fourOfAKind = checkOfAKind(rankCount, 4);
        boolean fullHouse = checkFullHouse(rankCount);
        boolean threeOfAKind = checkOfAKind(rankCount, 3);
        boolean twoPair = checkTwoPair(rankCount);
        boolean onePair = checkOfAKind(rankCount, 2);

        // Evaluate the best possible hand
        if (flush && straight) return "Straight Flush";
        if (fourOfAKind) return "Four of a Kind";
        if (fullHouse) return "Full House";
        if (flush) return "Flush";
        if (straight) return "Straight";
        if (threeOfAKind) return "Three of a Kind";
        if (twoPair) return "Two Pair";
        if (onePair) return "One Pair";

        return "High Card";
    }

    // Function to check for Flush (5 cards of the same suit)
    public static boolean checkFlush(List<Character> suits) {
        Map<Character, Integer> suitCount = new HashMap<>();
        for (char suit : suits) {
            suitCount.put(suit, suitCount.getOrDefault(suit, 0) + 1);
        }
        return suitCount.values().stream().anyMatch(count -> count >= 5);
    }

    // Function to check for Straight (5 consecutive cards)
    public static boolean checkStraight(List<Character> ranks) {
        List<Integer> sortedRanks = new ArrayList<>();

        // Convert ranks to their corresponding indices in RANK_ORDER
        for (char rank : ranks) {
            sortedRanks.add(RANK_ORDER.indexOf(rank));
        }

        // Remove duplicates and sort the ranks
        Set<Integer> rankSet = new HashSet<>(sortedRanks);
        sortedRanks = new ArrayList<>(rankSet);
        Collections.sort(sortedRanks);

        // Check for consecutive sequence
        int consecutive = 1;
        for (int i = 1; i < sortedRanks.size(); i++) {
            if (sortedRanks.get(i) == sortedRanks.get(i - 1) + 1) {
                consecutive++;
            } else {
                consecutive = 1;
            }
            if (consecutive == 5) return true;
        }
        return false;
    }

    // Function to check for Four of a Kind, Three of a Kind, or One Pair
    public static boolean checkOfAKind(Map<Character, Integer> rankCount, int kind) {
        return rankCount.values().stream().anyMatch(count -> count == kind);
    }

    // Function to check for Full House (Three of a Kind + One Pair)
    public static boolean checkFullHouse(Map<Character, Integer> rankCount) {
        boolean hasThree = false, hasTwo = false;
        for (int count : rankCount.values()) {
            if (count == 3) hasThree = true;
            if (count == 2) hasTwo = true;
        }
        return hasThree && hasTwo;
    }

    // Function to check for Two Pair
    public static boolean checkTwoPair(Map<Character, Integer> rankCount) {
        int pairCount = 0;
        for (int count : rankCount.values()) {
            if (count == 2) pairCount++;
        }
        return pairCount >= 2;
    }
}
