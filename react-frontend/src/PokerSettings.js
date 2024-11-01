export const gameSettings = {
    buyIn: 0,
  };
  
  export const setBuyIn = (value) => {
    gameSettings.buyIn = value;
  };
  
  export const getBuyIn = () => {
    return gameSettings.buyIn;
  };
  
  export default { gameSettings, setBuyIn, getBuyIn };