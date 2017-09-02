import { PlayerConfig } from "../app/youtube/PlayerConfig";
import { Player } from "../app/player/Player";

export interface onPlayerConfiguration {
  onPlayerConfiguration(player: Player, config: PlayerConfig): PlayerConfig;
}

export interface onPlayerCreated {
  onPlayerCreated(player: Player): void;
}