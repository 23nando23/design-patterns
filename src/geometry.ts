import { Rectangular } from "./geometry.third-party";

export interface Quadratic {
  getSide(): number;
}

export class Square implements Quadratic {
  constructor(private side: number) {}


  public toString(): string {
    return `Square(${this.side})`;
  }

  public getSide(): number {
    return this.side;
  }
}

export class RectangleAdapter implements Rectangular {
  constructor(private square: Quadratic) {}

  public getWidth(): number {
    return this.square.getSide();
  }

  public getHeight(): number {
    return this.square.getSide();
  }

  public toString(): string {
    const s = this.square.getSide();
    return `RectangleAdapter(${s},${s})`;
  }
}
