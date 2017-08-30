export interface IPlayer {
  play(): void;
  pause(): void;
  stop(): void;
  seekBy(time: number): void;
  seekTo(time: number): void;
}