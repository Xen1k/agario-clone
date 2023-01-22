import { useEffect, useRef } from 'react';
import Sketch from 'react-p5';
import { PlayerBubble } from './bubble';
import Eatable, { Drawable } from './eatable';
import {
  checkIfPlayerIsAliveOnServer,
  getServerPlayersWithoutCurrent,
  updatePlayersCoordiatesFromServer,
  getAllPlayersFromServer,
  initliaizePlayerOnServer,
  removePlayerFromServer,
} from '../networking/playerServerSync';

import { gameState, GameStates, setGameState } from '../gameStateManager';
import { getFoodArrayFromServer, supplementMapOnServer } from '../networking/mapServerSync';

export let canvasSettings = {
  canvasSizeX: window.innerWidth / 1.4,
  canvasSizeY: window.innerHeight / 1.4,
};

const drawGameOverScreen = (p5) => {
  p5.background(80);
  p5.fill(255);
  p5.textSize(30);
  p5.textAlign(p5.CENTER);
  p5.text('Reload the page to try again', 0, 300, 900);
};

const GameContainer = () => {
  let currentPlayer = useRef();
  let enemyPlayers = useRef([]);
  let food = useRef([]);

  let onBeforeUnload = (e) => {
    removePlayerFromServer(PlayerBubble._instance.id);
  };

  useEffect(() => {
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  const setup = async (p5, canvasParentRef) => {
    p5.createCanvas(canvasSettings.canvasSizeX, canvasSettings.canvasSizeY).parent(canvasParentRef);
    p5.background(150);
    Drawable.p5 = p5;

    food.current = await supplementMapOnServer()
    food.current = await getFoodArrayFromServer();

    let initCode = await initliaizePlayerOnServer();
    currentPlayer.current = new PlayerBubble(initCode, 10, 10);
  };

  const draw = (p5) => {
    p5.clear();
    if (gameState !== GameStates.RUNNING) {
      drawGameOverScreen(p5);
      return;
    }
    p5.background(150);

    if (!PlayerBubble._instance) return;

    checkIfPlayerIsAliveOnServer().then((isAlive) => {
      if (isAlive) return;
      setGameState(GameStates.OVER);
      PlayerBubble._instance.isAlive = false;
    });

    getAllPlayersFromServer().then((serverPlayers) => {
      enemyPlayers.current = [];
      serverPlayers = getServerPlayersWithoutCurrent(serverPlayers);
      updatePlayersCoordiatesFromServer(serverPlayers, enemyPlayers.current);
    });

    Eatable.renderArrayDisplaced(enemyPlayers.current, currentPlayer.current);
    Eatable.renderArrayDisplaced(food.current, currentPlayer.current);

    food.current = Eatable.checkCollisionsAndRemoveEated(food.current, currentPlayer.current);
    enemyPlayers.current = Eatable.checkCollisionsAndRemoveEated(enemyPlayers.current, currentPlayer.current);
    currentPlayer.current.moveInCursorDirection();
    currentPlayer.current.render();
    getFoodArrayFromServer().then(foodArray => food.current = foodArray);
    PlayerBubble._instance.updateServerState();
  };

  return <Sketch setup={setup} draw={draw} />;
};

export default GameContainer;
