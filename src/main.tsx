/* eslint-disable @typescript-eslint/no-explicit-any */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { floorCollisions, platformCollisions } from "./collisions.ts";
import { CollisionBlock } from "./CollisionBlock.ts";
import { Player } from "./Player.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

declare global {
  interface Window {
    canvas2d: any;
  }
}

const canvas = document.querySelector("canvas");
canvas!.height = 576;
canvas!.width = 1024;

const c = canvas?.getContext("2d") as CanvasRenderingContext2D;
window.canvas2d = c;

const scaledCanvas = {
  width: canvas!.width / 4,
  height: canvas!.height / 4,
};

let currentPlayerId = 1;

const floorCollisions2D = [];
for (let i = 0; i < floorCollisions.length; i += 36) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 36));
}

const collisionBlocks: any[] = [];
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
          color: "black",
        })
      );
    }
  });
});

const platformCollisions2D = [];
for (let i = 0; i < platformCollisions.length; i += 36) {
  platformCollisions2D.push(platformCollisions.slice(i, i + 36));
}

const platformCollisionBlocks: CollisionBlock[] = [];
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      platformCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
          height: 6,
        })
      );
    }
  });
});

const player = new Player({
  color: "yellow",
  position: {
    x: 100,
    y: 300,
  },
  collisionBlocks,
  platformCollisionBlocks,
});

const player2 = new Player({
  color: "purple",
  position: {
    x: 300,
    y: 300,
  },
  collisionBlocks,
  platformCollisionBlocks,
});

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
};

const backgroundImageHeight = 432;

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
};

function getCurrentPlayer(): Player {
  // eslint-disable-next-line no-constant-condition
  if (currentPlayerId === 1) {
    return player;
  } else {
    return player2;
  }
}

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "#333";
  c.fillRect(0, 0, canvas!.width, canvas!.height);

  c.save();
  c.scale(4, 4);
  c.translate(camera.position.x, camera.position.y);
  // background.update()
  platformCollisionBlocks.forEach((block) => {
    block.update();
  });

  collisionBlocks.forEach((collisionBlock) => {
    collisionBlock.update();
  });

  const currentPlayer = getCurrentPlayer();

  currentPlayer.checkForHorizontalCanvasCollision();

  player.update();
  player2.update();

  currentPlayer.velocity.x = 0;
  if (keys.d.pressed) {
    currentPlayer.velocity.x = 2;
    currentPlayer.lastDirection = "right";
    currentPlayer.shouldPanCameraToTheLeft({ canvas, camera });
  } else if (keys.a.pressed) {
    currentPlayer.velocity.x = -2;
    currentPlayer.lastDirection = "left";
    currentPlayer.shouldPanCameraToTheRight({ canvas, camera });
  } else if (currentPlayer.velocity.y === 0) {
    //
  }

  if (currentPlayer.velocity.y < 0) {
    currentPlayer.shouldPanCameraDown({ camera, canvas });
  } else if (currentPlayer.velocity.y > 0) {
    currentPlayer.shouldPanCameraUp({ camera, canvas });
  }

  c.restore();

  // console.log("plalyer pos:", getCurrentPlayer().position.y);
  // console.log("camera pos", camera.position.y);
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      break;
    case "a":
      keys.a.pressed = true;
      break;
    case "w":
      getCurrentPlayer().velocity.y = -4;
      break;
    case "k": {
      const player = getCurrentPlayer();
      player.velocity.x = 0;
      player.velocity.y = 0;

      currentPlayerId = currentPlayerId === 1 ? 2 : 1;

      camera.position.x = (getCurrentPlayer().position.x * -1) / 2;
      if (camera.position.x > 0) {
        camera.position.x = 0;
      }

      break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }
});
