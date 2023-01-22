export const GameStates = { RUNNING: 0, OVER: 1 };

export let setGameState = (state) => { gameState = state; }

export let gameState = GameStates.RUNNING;
