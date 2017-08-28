import { IPlayer } from './IPlayer';
import { EventTarget } from '../../libs/events/EventTarget';

export class Player extends EventTarget implements IPlayer {
  private _id: string;

  /**
   * Whether YouTube has initialized the player yet.
   */
  private _initialized: boolean = false;

  constructor(id: string) {
    super();

    this._id = id;
  }

  initialize(): void {
    this._initialized = true;
  }

  isInitialized(): boolean {
    return this._initialized;
  }

  play(): void {
    throw new Error("Method not implemented.");
  }
  pause(): void {
    throw new Error("Method not implemented.");
  }
  stop(): void {
    throw new Error("Method not implemented.");
  }
  seekBy(time: number): void {
    throw new Error("Method not implemented.");
  }
  seekTo(time: number): void {
    throw new Error("Method not implemented.");
  }
}