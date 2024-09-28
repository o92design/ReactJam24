import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


const canvas = document.querySelector('canvas');
canvas!.height = 1024;
canvas!.width = 576;

const c = canvas?.getContext('2d') as CanvasRenderingContext2D;

const gravity = 0.5;

const cubeSize = 50;

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false
  }
}

let currentPlayerId = 1;

class Player {
  positon: { x: number; y: number };
  velocity: { x: number; y: number };
  height: number;
  id: number;
  color: string;
  constructor(color: string, id: number, positon: { x: number; y: number }) {
    this.positon = positon;
    this.velocity = {
      x: 0,
      y: 1,
    }
    this.height = cubeSize;
    this.id = id;
    this.color = color;
  }
    draw() {
      c.fillStyle = this.color;
      c.fillRect(this.positon.x, this.positon.y, cubeSize,this.height);
    }

    update() {
      this.draw();
      this.positon.y += this.velocity.y
      this.positon.x += this.velocity.x
      if(this.positon.y + this.height + this.velocity.y < canvas!.height) {
        this.velocity.y += gravity;
      } else {
        this.velocity.y = 0;
      }

    }

}


window.addEventListener('keydown', (event) => {
  if (event.key === 'a') {
    keys.a.pressed = true;
  }

  if (event.key === 'd') {
    keys.d.pressed = true;
  }

  if (event.key === 'w') {
      getCurrentPlayer().velocity.y = -20;
  }
  console.log(event)
  if (event.code === 'Space') {
    console.log(currentPlayerId);

    if(currentPlayerId === 1) {
      currentPlayerId = 2;
    } else {
      currentPlayerId = 1;
    }
    console.log("newPlaer", currentPlayerId)
}
})

window.addEventListener('keyup', (event) => {
  if (event.key === 'a') {
    keys.a.pressed = false;
  }

  if (event.key === 'd') {
    keys.d.pressed = false;
  }

})
const player = new Player('red',1, {

  x: 100,
  y: 100,
});

const player2 = new Player('green', 2, {
  x: 200,
  y: 100,
});

function getCurrentPlayer() {
  if(currentPlayerId === 1) {
    return player;
  } else {
    return player2;
  }
}

function animate() {
  
  window.requestAnimationFrame(animate);
  console.log("Hje")
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas!.width, canvas!.height);
    player.update();
    player2.update();

    player.velocity.x = 0;
    player2.velocity.x = 0;
    if(keys.d.pressed) {



      if(getCurrentPlayer().positon.x < (canvas!.width) - cubeSize) {
        getCurrentPlayer().velocity.x = 5;
      } 
      
    } else if (keys.a.pressed) {

      if(getCurrentPlayer().positon.x !== 0) {
        getCurrentPlayer().velocity.x = -5;
      } 

    
    }
}

animate();