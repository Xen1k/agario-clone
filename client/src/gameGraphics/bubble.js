import { normalizeVector } from '../utils/vectorUtils';
import Eatable, { Drawable } from './eatable';
import { canvasSettings } from './gameContainer';
import { removePlayerFromServer, updatePlayerOnServer } from '../networking/playerServerSync';
import { GameStates, setGameState } from '../gameStateManager';

export class Bubble extends Eatable {
  speed = 2;
  hasOutline = true;
  outlineColor = 'gray';
  isAlive = true;

  constructor(id, xPos = undefined, yPos = undefined, color = 'blue', radius = undefined) {
    super(id, xPos, yPos, color);
    this.radius = radius ?? 35;
  }
}

export class PlayerBubble extends Bubble {
  outlineColor = 'white';
  renderRadius = 35;

  constructor(id, xPos = undefined, yPos = undefined, color = 'green', radius = undefined) {
    super(id, xPos, yPos, color, radius);
    if (!PlayerBubble._instance) PlayerBubble._instance = this;
  }

  static getCameraZoomRatio = () => parseFloat(PlayerBubble._instance.renderRadius) / PlayerBubble._instance.radius;

  render() {
    super.render(canvasSettings.canvasSizeX / 2, canvasSettings.canvasSizeY / 2);
  }

  onDeath() {
    this.wasEated = true;
    removePlayerFromServer(this.id)
    setGameState(GameStates.OVER);
    this.isAlive = false;
  }

  updateServerState = async () => {
    await updatePlayerOnServer(this);
  };

  moveInCursorDirection() {
    // Get mouse coords offsetted from canvas center
    let offsettedMouseX = Drawable.p5.pmouseX - canvasSettings.canvasSizeX / 2;
    let offsettedMouseY = Drawable.p5.pmouseY - canvasSettings.canvasSizeY / 2;
    let moveVector = normalizeVector(offsettedMouseX, offsettedMouseY);
    this.xPos += moveVector[0] * this.speed;
    this.yPos += moveVector[1] * this.speed;
  }
}
