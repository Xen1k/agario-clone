import { removeMapPieceOnRerver } from '../networking/mapServerSync';
import { removePlayerFromServer } from '../networking/playerServerSync';
import { getRandomInt } from '../utils/randUtils';
import { Bubble, PlayerBubble } from './bubble';
import { canvasSettings } from './gameContainer';

export class Drawable {
  static p5;
}

class Eatable extends Drawable {
  id = -1;
  hasOutline = false;

  constructor(id, xPos = undefined, yPos = undefined, color = 'red', radius = undefined) {
    super();
    this.xPos = xPos ?? getRandomInt(0, canvasSettings.canvasSizeX);
    this.yPos = yPos ?? getRandomInt(0, canvasSettings.canvasSizeY);
    this.color = color;
    this.radius = radius ?? 10;
    this.id = id;
  }

  render(x, y) {
    let getRenderDiameter = () =>
      this instanceof PlayerBubble
        ? PlayerBubble._instance.renderRadius * 2
        : PlayerBubble.getCameraZoomRatio() * this.radius * 2;

    if (this.hasOutline) {
      let outlineWidth = 1.1;
      Drawable.p5.fill(this.outlineColor);
      Drawable.p5.circle(x ?? this.xPos, y ?? this.yPos, getRenderDiameter() * outlineWidth);
    }
    Drawable.p5.fill(this.color);
    Drawable.p5.circle(x ?? this.xPos, y ?? this.yPos, getRenderDiameter());
  }

  renderDisplaced(displaceOrigin) {
    this.render(
      this.xPos - displaceOrigin.xPos + canvasSettings.canvasSizeX / 2,
      this.yPos - displaceOrigin.yPos + canvasSettings.canvasSizeY / 2
    );
  }

  checkCollision(collisionSuspect) {
    let rangeBetweenCenters = Math.sqrt(
      Math.pow(collisionSuspect.xPos - this.xPos, 2) + Math.pow(collisionSuspect.yPos - this.yPos, 2)
    );
    if (rangeBetweenCenters < (this.radius + collisionSuspect.radius) * PlayerBubble.getCameraZoomRatio()) {
      this.onCollision(collisionSuspect);
      return true;
    }
    return false;
  }

  onCollision(collisionObject) {
    if (collisionObject.radius > this.radius && !this.wasEated) {
      // Eeat this (smaller) object
      collisionObject.radius += this.radius;
      if (this instanceof Bubble) {
        this.isAlive = false;
        removePlayerFromServer(this.id);
        return;
      }
      removeMapPieceOnRerver(this.id)
      this.wasEated = true;
    } else if (collisionObject.radius < this.radius && collisionObject instanceof PlayerBubble) {
      PlayerBubble._instance.onDeath();
    }
  }

  static renderArrayDisplaced(eatablesArray, displaceOrigin) {
    eatablesArray.forEach((item) => item.renderDisplaced(displaceOrigin));
  }

  static checkCollisionsAndRemoveEated(eatablesArray, collisionSuspect) {
    return eatablesArray.filter((item) => {
      item.checkCollision(collisionSuspect);
      return !item.wasEated;
    });
  }
}

export default Eatable;
