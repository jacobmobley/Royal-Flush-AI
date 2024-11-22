import clubs2 from "../../assets/cards/2_of_clubs.png";
import clubs3 from "../../assets/cards/3_of_clubs.png";
import clubs4 from "../../assets/cards/4_of_clubs.png";
import clubs5 from "../../assets/cards/5_of_clubs.png";
import clubs6 from "../../assets/cards/6_of_clubs.png";
import clubs7 from "../../assets/cards/7_of_clubs.png";
import clubs8 from "../../assets/cards/8_of_clubs.png";
import clubs9 from "../../assets/cards/9_of_clubs.png";
import clubs10 from "../../assets/cards/10_of_clubs.png";
import clubsjack from "../../assets/cards/jack_of_clubs.png";
import clubsqueen from "../../assets/cards/queen_of_clubs.png";
import clubsking from "../../assets/cards/king_of_clubs.png";
import clubsace from "../../assets/cards/ace_of_clubs.png";

import diamonds2 from "../../assets/cards/2_of_diamonds.png";
import diamonds3 from "../../assets/cards/3_of_diamonds.png";
import diamonds4 from "../../assets/cards/4_of_diamonds.png";
import diamonds5 from "../../assets/cards/5_of_diamonds.png";
import diamonds6 from "../../assets/cards/6_of_diamonds.png";
import diamonds7 from "../../assets/cards/7_of_diamonds.png";
import diamonds8 from "../../assets/cards/8_of_diamonds.png";
import diamonds9 from "../../assets/cards/9_of_diamonds.png";
import diamonds10 from "../../assets/cards/10_of_diamonds.png";
import diamondsjack from "../../assets/cards/jack_of_diamonds.png";
import diamondsqueen from "../../assets/cards/queen_of_diamonds.png";
import diamondsking from "../../assets/cards/king_of_diamonds.png";
import diamondsace from "../../assets/cards/ace_of_diamonds.png";

import hearts2 from "../../assets/cards/2_of_hearts.png";
import hearts3 from "../../assets/cards/3_of_hearts.png";
import hearts4 from "../../assets/cards/4_of_hearts.png";
import hearts5 from "../../assets/cards/5_of_hearts.png";
import hearts6 from "../../assets/cards/6_of_hearts.png";
import hearts7 from "../../assets/cards/7_of_hearts.png";
import hearts8 from "../../assets/cards/8_of_hearts.png";
import hearts9 from "../../assets/cards/9_of_hearts.png";
import hearts10 from "../../assets/cards/10_of_hearts.png";
import heartsjack from "../../assets/cards/jack_of_hearts.png";
import heartsqueen from "../../assets/cards/queen_of_hearts.png";
import heartsking from "../../assets/cards/king_of_hearts.png";
import heartsace from "../../assets/cards/ace_of_hearts.png";

import spades2 from "../../assets/cards/2_of_spades.png";
import spades3 from "../../assets/cards/3_of_spades.png";
import spades4 from "../../assets/cards/4_of_spades.png";
import spades5 from "../../assets/cards/5_of_spades.png";
import spades6 from "../../assets/cards/6_of_spades.png";
import spades7 from "../../assets/cards/7_of_spades.png";
import spades8 from "../../assets/cards/8_of_spades.png";
import spades9 from "../../assets/cards/9_of_spades.png";
import spades10 from "../../assets/cards/10_of_spades.png";
import spadesjack from "../../assets/cards/jack_of_spades.png";
import spadesqueen from "../../assets/cards/queen_of_spades.png";
import spadesking from "../../assets/cards/king_of_spades.png";
import spadesace from "../../assets/cards/ace_of_spades.png";

const cardImageMap = {
    clubs2,
    clubs3,
    clubs4,
    clubs5,
    clubs6,
    clubs7,
    clubs8,
    clubs9,
    clubs10,
    clubsjack,
    clubsqueen,
    clubsking,
    clubsace,
    diamonds2,
    diamonds3,
    diamonds4,
    diamonds5,
    diamonds6,
    diamonds7,
    diamonds8,
    diamonds9,
    diamonds10,
    diamondsjack,
    diamondsqueen,
    diamondsking,
    diamondsace,
    hearts2,
    hearts3,
    hearts4,
    hearts5,
    hearts6,
    hearts7,
    hearts8,
    hearts9,
    hearts10,
    heartsjack,
    heartsqueen,
    heartsking,
    heartsace,
    spades2,
    spades3,
    spades4,
    spades5,
    spades6,
    spades7,
    spades8,
    spades9,
    spades10,
    spadesjack,
    spadesqueen,
    spadesking,
    spadesace,
  };

  const royaltyMap = {
    11: "jack",
    12: "queen",
    13: "king",
    14: "ace",
  };
  
  export const getCardImage = (value, suit) => {
    const cardValue = royaltyMap[value] || value; // Convert to royalty or keep numeric value
    const key = `${suit}${cardValue}`; // Construct the key
    return cardImageMap[key];
  };