import { PlayerConfig, PlayerData } from "../app/youtube/PlayerConfig";
import { Player } from "../app/player/Player";

export interface onPlayerConfig {
  onPlayerConfig(player: Player, config: PlayerConfig): PlayerConfig;
}

export interface onPlayerCreated {
  onPlayerCreated(player: Player): void;
}

export interface onPlayerData {
  onPlayerData(player: Player, data: PlayerData): PlayerData;
}