export interface ParkingEvent {
  lotName: string;
  occupied: number;
  capacity: number;
  action: "entered" | "left";
}

export interface Subscriber {
  update(event: ParkingEvent): void;
}

export interface Publisher {
  subscribe(subscriber: Subscriber): void;
  unsubscribe(subscriber: Subscriber): void;
  notify(event: ParkingEvent): void;
}

export class ParkingLot implements Publisher {
  public occupied: number = 0;
  private subscribers: Subscriber[] = [];

  constructor(
    public name: string,
    public capacity: number
  ) {}

  public enter(): void {
    if (!this.isFull()) {
      this.occupied++;
      this.notify({
        lotName: this.name,
        occupied: this.occupied,
        capacity: this.capacity,
        action: "entered"
      });
    } else {
      throw new Error("the parking lot is full");
    }
  }

  public exit(): void {
    if (!this.isEmpty()) {
      this.occupied--;
      this.notify({
        lotName: this.name,
        occupied: this.occupied,
        capacity: this.capacity,
        action: "left"
      });
    } else {
      throw new Error("the parking lot is empty");
    }
  }

  public isFull(): boolean {
    return this.occupied === this.capacity;
  }

  public isEmpty(): boolean {
    return this.occupied === 0;
  }

  public subscribe(subscriber: Subscriber): void {
    this.subscribers.push(subscriber);
  }

  public unsubscribe(subscriber: Subscriber): void {
    this.subscribers = this.subscribers.filter(s => s !== subscriber);
  }

  public notify(event: ParkingEvent): void {
    for (const subscriber of this.subscribers) {
      subscriber.update(event);
    }
  }
}
