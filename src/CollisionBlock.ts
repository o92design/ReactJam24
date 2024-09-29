import { Position } from "./position";

export class CollisionBlock {
  position: Position;
  width: number;
  height: number;
  color: string;
  constructor({
    position,
    height = 16,
    color = "gray",
  }: {
    position: Position;
    height?: number;
    color?: string;
  }) {
    this.position = position;
    this.width = 16;
    this.height = height;
    this.color = color;
  }

  draw() {
    window.canvas2d.fillStyle = this.color;
    window.canvas2d.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
  }
}
