total_pot = 0

class Player():
    def __init__(self, buy_in, human=False):
        self.next = None
        self.amount_left = buy_in
        self.big_blind = False
        self.small_blind = False
        self.hand = []
        self.in_game = True
        if (human): self.human = True
        else: self.human = False
    
    def bet(self, amount):
        if (amount > self.amount_left):
            return "Not enough currency left"
        self.amount_left -= amount
        total_pot += amount

    def check(self):
        pass

    def fold(self):
        self.in_game = False


class PlayerList():
    def __init__(self, p1, p2, p3, p4, p5, p6):
        p1.next = p2
        p2.next = p3
        p3.next = p4
        p4.next = p5
        p5.next = p6
        p6.next = p1
        self.head = p1

    def next_turn(self):
        self.head = self.head.next
