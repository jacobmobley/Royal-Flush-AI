import eval7


def getPng(card: eval7.Card):
    val = str(card)[0]
    suit = str(card)[1]

    img = '../react-frontend/assets/'
    if val == 'T': 
        img_app = '10'
    elif val == 'J':
        img_app = 'jack'
    elif val == 'Q':
        img_app = 'queen'
    elif val == 'K':
        img_app = 'king'
    elif val == 'A':
        img_app = 'ace'
    else:
        img_app = val

    img_app += '_of_'

    match(suit):
        case 'h':
            img_app += 'hearts'
        case 's':
            img_app += 'spades'
        case 'c':
            img_app += 'clubs'
        case 'd':
            img_app += 'diamonds'
    
    img_app += '.png'

    img += img_app

    return img